"use client";
import { useState, useRef } from "react";

export default function VoiceRecorder({ onFinalText }) {
  const [recording, setRecording] = useState(false);
  const wsRef = useRef(null);
  const mediaStream = useRef(null);

  const start = async () => {
    setRecording(true);

    mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const src = audioContext.createMediaStreamSource(mediaStream.current);
    const proc = audioContext.createScriptProcessor(2048, 1, 1);

    // Browser cannot set WS headers → token in query (OK for prototype)
    const ws = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview&api_key=" 
      + encodeURIComponent(process.env.NEXT_PUBLIC_OPENAI_KEY)
    );
    wsRef.current = ws;

    ws.onopen = () => {
      proc.onaudioprocess = (e) => {
        if (!recording) return;
        const input = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);
        for (let i=0;i<input.length;i++) pcm[i]=input[i]*32767;
        ws.send(pcm);
      };
      src.connect(proc);
      proc.connect(audioContext.destination);
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);

        if (data.type === "response.completed") {
          onFinalText(data.response.output_text);
        }
        if (data.type === "response.audio.delta") {
          const audio = new Audio("data:audio/wav;base64," + data.delta);
          audio.play();
        }
      } catch {}
    };
  };

  const stop = () => {
    setRecording(false);
    wsRef.current?.close();
    mediaStream.current?.getTracks().forEach(t=>t.stop());
  };

  return (
    <div style={{marginBottom:"20px"}}>
      {!recording ? (
        <button onClick={start}>🎙️ Parler</button>
      ) : (
        <button onClick={stop} style={{background:"#e33",color:"#fff"}}>⏹️ Stop</button>
      )}
    </div>
  );
}

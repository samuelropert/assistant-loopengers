"use client";
import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";

export default function ChatBox() {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");

  const handleText=async(text)=>{
    const extraction=await fetch("/api/extract",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:text})}).then(r=>r.json());
    const price=await fetch("/api/price",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(extraction)}).then(r=>r.json());
    const final=await fetch("/api/explain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({extraction,price})}).then(r=>r.json());
    setMessages(prev=>[...prev,{role:"assistant",content:final.text}]);
  };

  const sendMessage=async()=>{
    if(!input.trim())return;
    setMessages(prev=>[...prev,{role:"user",content:input}]);
    await handleText(input);
    setInput("");
  };

  return(
    <div>
      <VoiceRecorder onFinalText={(t)=>{
        setMessages(prev=>[...prev,{role:"user",content:t}]);
        handleText(t);
      }}/>

      <div style={{border:"1px solid #ccc",padding:"20px",borderRadius:"8px",minHeight:"200px",marginBottom:"20px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{marginBottom:"12px"}}>
            <strong>{m.role==="user"?"Vous":"Assistant"} :</strong><br/>{m.content}
          </div>
        ))}
      </div>

      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}
        placeholder="Décrivez votre objet…" style={{width:"100%",padding:"12px"}}/>

      <button onClick={sendMessage} style={{marginTop:"10px",padding:"10px 16px"}}>Envoyer</button>
    </div>
  );
}

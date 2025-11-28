import { client } from "@/lib/openai";

export async function POST(req){
 const {input}=await req.json();
 const c=await client.chat.completions.create({
  model:"gpt-4o-mini",
  messages:[
    {role:"system",content:"Analyse et retourne JSON: type, dimensions, matière, poids, départ, arrivée."},
    {role:"user",content:input}
  ],
  response_format:"json_object"
 });
 return Response.json(c.choices[0].message.parsed);
}

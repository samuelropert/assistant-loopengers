import { client } from "@/lib/openai";

export async function POST(req){
 const {extraction,price}=await req.json();
 const c=await client.chat.completions.create({
  model:"gpt-4o",
  messages:[
    {role:"system",content:"Explique le devis de manière claire et humaine."},
    {role:"user",content:`Extraction:${JSON.stringify(extraction)} Pricing:${JSON.stringify(price)}`}
  ]
 });
 return Response.json({text:c.choices[0].message.content});
}

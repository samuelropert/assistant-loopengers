export async function POST(req){
 const extraction=await req.json();
 const r=await fetch(process.env.PRICING_ENGINE_URL,{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${process.env.PRICING_ENGINE_SECRET}`
  },
  body:JSON.stringify(extraction)
 });
 return Response.json(await r.json());
}

// finesse demo worker + MCP server (streamable HTTP, stateless).
// HTML, REG, META and PNG_B64 are injected above by mcp/build.py from docs/.
const INFO={name:"finesse-mcp",version:"1.0.0"};
const PROTO="2025-06-18";
const INSTRUCTIONS=[
 "finesse is a library of 94 animated, RTL-first Hebrew UI components for Next.js + shadcn/ui + Tailwind + Framer Motion.",
 "Use search_components to find a component by keyword (English or Hebrew), get_component to fetch its full TSX source, and get_usage for install instructions.",
 "Every component ships as a shadcn registry item and can also be installed with: npx shadcn@latest add https://finesse-demo.orworkdelevski.workers.dev/r/<name>.json",
].join(" ");
const TOOLS=[
 {name:"list_components",description:"List all 94 finesse components (name + title).",
  inputSchema:{type:"object",properties:{},additionalProperties:false}},
 {name:"search_components",description:"Search finesse components by keyword in name, title or description (English or Hebrew). Returns up to 10 matches.",
  inputSchema:{type:"object",properties:{query:{type:"string",description:"keyword, e.g. 'menu', 'button', 'תפריט', 'טעינה'"}},required:["query"],additionalProperties:false}},
 {name:"get_component",description:"Get one component's full registry item: metadata plus complete TSX source code, ready to paste into a Next.js + shadcn/ui project.",
  inputSchema:{type:"object",properties:{name:{type:"string",description:"component name, e.g. 'goo-menu' (see list_components)"}},required:["name"],additionalProperties:false}},
 {name:"get_usage",description:"How to install and use finesse components (shadcn registry URL, RTL/Hebrew notes, live gallery).",
  inputSchema:{type:"object",properties:{},additionalProperties:false}},
];
const USAGE=[
 "finesse - animated RTL Hebrew components for shadcn/ui",
 "",
 "Install one component into a Next.js + shadcn/ui project:",
 "  npx shadcn@latest add https://finesse-demo.orworkdelevski.workers.dev/r/<name>.json",
 "Or copy the TSX from get_component into components/finesse/<name>.tsx.",
 "",
 "Requirements: Tailwind CSS and framer-motion (most components animate via Motion). Components are 'use client' and dir=rtl aware; Hebrew labels are built in and easy to replace.",
 "Browse all 94 with live demos: https://delevski.github.io/finesse/",
 "Registry index: https://finesse-demo.orworkdelevski.workers.dev/r/<name>.json (one JSON per component, shadcn schema).",
].join("\n");
function text(t){return {content:[{type:"text",text:t}]};}
function callTool(name,args){
 args=args||{};
 if(name==="list_components"){
   const lines=META.map(c=>c.name+" - "+c.title+(c.titleHe?" ("+c.titleHe+")":""));
   return text(lines.length+" components:\n"+lines.join("\n"));
 }
 if(name==="search_components"){
   const q=String(args.query||"").toLowerCase().trim();
   if(!q) return {content:[{type:"text",text:"query is required"}],isError:true};
   const hits=META.filter(c=>(c.name+" "+c.title+" "+(c.titleHe||"")+" "+(c.description||"")).toLowerCase().includes(q)).slice(0,10);
   if(!hits.length) return text("No components match '"+q+"'. Try list_components.");
   return text(hits.map(c=>c.name+" - "+c.title+(c.titleHe?" ("+c.titleHe+")":"")+"\n  "+(c.description||"")).join("\n"));
 }
 if(name==="get_component"){
   const n=String(args.name||"").trim();
   const item=REG["r/"+n+".json"];
   if(!item) return {content:[{type:"text",text:"Unknown component '"+n+"'. Use list_components or search_components."}],isError:true};
   return text(typeof item==="string"?item:JSON.stringify(item));
 }
 if(name==="get_usage") return text(USAGE);
 return {content:[{type:"text",text:"Unknown tool: "+name}],isError:true};
}
function handleRpc(msg){
 const id=msg.id,method=msg.method;
 if(method==="initialize") return {jsonrpc:"2.0",id,result:{protocolVersion:(msg.params&&msg.params.protocolVersion)||PROTO,capabilities:{tools:{}},serverInfo:INFO,instructions:INSTRUCTIONS}};
 if(method==="ping") return {jsonrpc:"2.0",id,result:{}};
 if(method==="tools/list") return {jsonrpc:"2.0",id,result:{tools:TOOLS}};
 if(method==="tools/call"){
   const p=msg.params||{};
   return {jsonrpc:"2.0",id,result:callTool(p.name,p.arguments)};
 }
 return {jsonrpc:"2.0",id:id===undefined?null:id,error:{code:-32601,message:"Method not found: "+method}};
}
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version"};
async function handleMcp(request){
 if(request.method==="GET") return new Response(JSON.stringify({jsonrpc:"2.0",error:{code:-32600,message:"Use POST for JSON-RPC; SSE streaming is not supported by this server."},id:null}),{status:405,headers:{...CORS,"Content-Type":"application/json","Allow":"POST"}});
 if(request.method!=="POST") return new Response("method not allowed",{status:405,headers:{...CORS,"Allow":"POST, GET, OPTIONS"}});
 let body;
 try{body=await request.json();}catch(e){return new Response(JSON.stringify({jsonrpc:"2.0",error:{code:-32700,message:"Parse error"},id:null}),{status:400,headers:{...CORS,"Content-Type":"application/json"}});}
 const msgs=Array.isArray(body)?body:[body];
 const notifsOnly=msgs.length>0&&msgs.every(m=>m&&m.method&&(m.id===undefined||m.id===null));
 if(notifsOnly) return new Response(null,{status:202,headers:CORS});
 const out=msgs.filter(m=>m&&m.method&&m.id!==undefined&&m.id!==null).map(handleRpc);
 const res=Array.isArray(body)?out:out[0];
 return new Response(JSON.stringify(res),{status:200,headers:{...CORS,"Content-Type":"application/json"}});
}
const PNG_BIN = Uint8Array.from(atob(PNG_B64), c => c.charCodeAt(0));
export default {async fetch(request){
 const url=new URL(request.url);
 if(request.method==="OPTIONS") return new Response(null,{status:204,headers:CORS});
 const path=url.pathname.replace(/^\/+|\/+$/g,"");
 if(path==="mcp") return handleMcp(request);
 if(path===""||path==="index.html")return new Response(HTML,{headers:{"content-type":"text/html; charset=utf-8"}});
 if(path==="social-preview.png")return new Response(PNG_BIN,{headers:{"content-type":"image/png","cache-control":"public, max-age=86400"}});
 if(REG[path])return new Response(REG[path],{headers:{"content-type":"application/json; charset=utf-8"}});
 return new Response("Not found",{status:404});}};

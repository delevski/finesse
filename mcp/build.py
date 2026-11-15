# Build the finesse demo worker (gallery + registry + /mcp MCP endpoint).
# Injects docs/index.html, docs/r/*.json (components only), metadata and the
# social-preview PNG into mcp/worker.template.js.
# Usage: python3 mcp/build.py /path/to/out/worker.js   (filename MUST be worker.js for the CF upload)
import json,pathlib,sys,base64
root=pathlib.Path(__file__).resolve().parent.parent
he={}
idx=root/'docs/r/index.json'
if idx.exists():
    for it in json.loads(idx.read_text()).get('items',[]):
        he[it.get('name')]=it.get('titleHe','')
reg={}
meta=[]
for p in sorted((root/'docs/r').glob('*.json')):
    txt=p.read_text()
    d=json.loads(txt)
    if d.get('type')!='registry:component':
        continue  # skip the shadcn index and any non-component files
    reg['r/'+p.name]=txt
    name=d.get('name',p.stem)
    meta.append({'name':name,'title':d.get('title',''),'titleHe':he.get(name,''),'description':d.get('description','')})
tpl=(root/'mcp/worker.template.js').read_text()
head=('const HTML='+json.dumps((root/'docs/index.html').read_text(),ensure_ascii=False)+';\n'
      'const REG='+json.dumps(reg,ensure_ascii=False)+';\n'
      'const META='+json.dumps(meta,ensure_ascii=False)+';\n'
      'const PNG_B64='+json.dumps(base64.b64encode((root/'docs/social-preview.png').read_bytes()).decode())+';\n')
out=sys.argv[1] if len(sys.argv)>1 else '/tmp/demo/worker.js'
pathlib.Path(out).write_text(head+tpl)
print('built gallery +',len(reg),'components + MCP ->',out)

// contrast regression: runs tc.mjs for every design/mode and compares with baseline.json (max allowed issues)
import {spawnSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {serve} from './serve.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));const PORT=+process.env.PORT||8777;
const srv=process.env.BASE?null:await serve(PORT);
const OUT=process.env.OUT||fs.mkdtempSync('/tmp/rfqa-');
const base=JSON.parse(fs.readFileSync(path.join(here,'baseline.json'),'utf8'));
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
let fail=0;const only=process.argv[2]?process.argv[2].split(','):DES;
for(const d of only)for(const m of ['dark','light']){
  const r=spawnSync('node',[path.join(here,'tc.mjs'),d,m],{env:{...process.env,OUT,BASE:`http://localhost:${PORT}`},encoding:'utf8'});
  let n=-1;try{n=JSON.parse(fs.readFileSync(`${OUT}/tc_${d}_${m}_390.json`,'utf8')).issues.length}catch(e){}
  const max=base[`${d}/${m}`]??0;const ok=n>=0&&n<=max;if(!ok)fail++;
  console.log((ok?'ok   ':'FAIL ')+`${d}/${m} issues ${n} (baseline ${max})`);
}
if(srv)srv.close();process.exit(fail?1:0);

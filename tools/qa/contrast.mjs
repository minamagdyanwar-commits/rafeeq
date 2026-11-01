// contrast regression: runs tc.mjs for every design/mode and compares with baseline.json (max allowed issues)
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {serve} from './serve.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));const PORT=+process.env.PORT||8777;
const srv=process.env.BASE?null:await serve(PORT);
const OUT=process.env.OUT||fs.mkdtempSync('/tmp/rfqa-');
const base=JSON.parse(fs.readFileSync(path.join(here,'baseline.json'),'utf8'));
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const UPD=process.argv.includes('--update'),res={};let fail=0;const only=process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2].split(','):DES;
import {spawn} from 'node:child_process';
const jobs=[];for(const d of only)for(const m of ['dark','light'])jobs.push([d,m]);
const run1=([d,m])=>new Promise(r=>{const c=spawn('node',[path.join(here,'tc.mjs'),d,m],{env:{...process.env,OUT,BASE:`http://localhost:${PORT}`}});c.on('close',()=>r())});
const CONC=+process.env.CONC||4;let qi=0;
await Promise.all(Array.from({length:CONC},async()=>{while(qi<jobs.length)await run1(jobs[qi++])}));
for(const [d,m] of jobs){
  let n=-1;try{n=JSON.parse(fs.readFileSync(`${OUT}/tc_${d}_${m}_390.json`,'utf8')).issues.length}catch(e){}
  res[`${d}/${m}`]=n;const max=base[`${d}/${m}`]??0;const ok=n>=0&&n<=max+(+process.env.TOL||2);if(!ok)fail++;
  console.log((ok?'ok   ':'FAIL ')+`${d}/${m} issues ${n} (baseline ${max})`);
}
if(UPD){fs.writeFileSync(path.join(here,'baseline.json'),JSON.stringify({...base,...res},null,1)+'\n');console.log('baseline updated');fail=0}
if(srv)srv.close();process.exit(fail?1:0);

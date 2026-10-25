const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
const BASE=process.env.BASE||'http://localhost:8777';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium';
const OUT=process.env.OUT||'/tmp/qa';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(BASE+'/index.html');await p.waitForTimeout(2500);
const r=await p.evaluate(async()=>{await __F.bible.load();const bad=[],stat=[];
for(const [id,pr] of Object.entries(__progData)){stat.push(id+':'+pr.days.length);
 pr.days.forEach((d,i)=>{try{const x=__F.bible.parseRef(d[1]);if(!x){bad.push(id+' '+(i+1)+' '+d[1]+' noparse');return}const v=__F.bible.verses(x.bi,x.ch,x.v1,x.v2);if(!v||!v.length)bad.push(id+' '+(i+1)+' '+d[1]+' empty')}catch(e){bad.push(id+' '+(i+1)+' '+d[1]+' ERR')}});}
return {stat:stat.join(' '),bad}});
console.log(r.stat);console.log(r.bad.join('\n'));console.log(errs);await b.close();

const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
const BASE=process.env.BASE||'http://localhost:8777';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium';
const OUT=process.env.OUT||'/tmp/qa';
import fs from 'node:fs';
const DES=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const only=process.argv[2]?process.argv[2].split(','):DES;
const AUD=()=>{
  const P=s=>{const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const a=m[1].split(/[ ,\/]+/).map(Number);return {r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}};
  const over=(f,b)=>({r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1});
  const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)};
  const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
  const out=[];const root=document.querySelector('#page-home');if(!root)return out;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){const tx=n.nodeValue.trim();if(tx.length<2)continue;const e=n.parentElement;if(!e||/SCRIPT|STYLE/.test(e.tagName))continue;
    const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity<.1)continue;
    const rg=document.createRange();rg.selectNodeContents(n);const r=rg.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<60||r.top>innerHeight-70||r.right<0||r.left>innerWidth)continue;
    // covered check at 3 points
    let covered=0;for(const fx of [.25,.5,.75]){const x=r.left+r.width*fx,y=r.top+r.height/2;const t=document.elementFromPoint(x,y);if(t&&t!==e&&!e.contains(t)&&!t.contains(e))covered++}
    if(covered>=2)out.push('COVERED «'+tx.slice(0,24)+'» by '+(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.className||'?'));
  }
  return out;
};
const b=await chromium.launch({executablePath:CHROME});
const rep=[];
for(const des of only)for(const mode of (des==='qalaya'?['dark']:['dark','light']))for(const [w,h] of [[390,844],[320,568],[800,390],[820,1180]]){
 const tag=`${des}/${mode}/${w}x${h}`;const iss=[];
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:w<700});const p=await ctx.newPage();p.on('pageerror',e=>iss.push('JSERR '+e.message.slice(0,60)));
 await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[des,mode]);
 try{
 await p.goto(BASE+'/index.html');await p.waitForTimeout(2200);
 await p.evaluate(()=>{try{__nh.setOpen(true)}catch(e){}});await p.waitForTimeout(500);
 for(const pos of [0,.5,1]){
  await p.evaluate(pos=>{const s=document.querySelector('.nh-sheet,.nh-body');if(s){const sc=[s,s.querySelector('.nh-body')].find(x=>x&&x.scrollHeight>x.clientHeight+10);if(sc)sc.scrollTop=(sc.scrollHeight-sc.clientHeight)*pos}window.scrollTo(0,0)},pos);
  await p.waitForTimeout(250);
  (await p.evaluate(AUD)).forEach(x=>iss.push('pos'+pos+' '+x));
 }
 // counter check
 const cnt=await p.evaluate(()=>{const f=window.__F;const it=f.todayItems(f.realKey());const d=it.filter(x=>x.done).length;const exp=d+' من '+it.length;const ar=s=>String(s).replace(/\d/g,x=>'٠١٢٣٤٥٦٧٨٩'[x]);const root=document.querySelector('#nhHome,#page-home');const txt=[...root.querySelectorAll('*')].filter(e=>!e.children.length&&/من/.test(e.textContent)&&/[٠-٩]/.test(e.textContent)&&e.textContent.length<20).map(e=>e.textContent.trim());return {exp:ar(exp),got:txt}});
 if(cnt.got.length&&!cnt.got.some(g=>g.replace(/\s+/g,' ').includes(cnt.exp)))iss.push('COUNT exp '+cnt.exp+' got '+cnt.got.join(','));
 }catch(e){iss.push('SCRIPTERR '+e.message.slice(0,80))}
 rep.push({tag,iss});await ctx.close();
}
fs.writeFileSync(OUT+'/home_'+(process.argv[2]||'all').replace(/,/g,'_')+'.json',JSON.stringify(rep,null,1));
await b.close();console.log('done');

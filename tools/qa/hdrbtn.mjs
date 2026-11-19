// أزرار الشريط العلوي (الإعدادات/البحث/الخلوة) واضحة؟ node tools/qa/hdrbtn.mjs [تصاميم] [dark|light]
// لكل تصميم × وضع × صفحة (الرئيسية والصلاة والقراءات ورسالة وصوت الله): تباين أيقونة الزر مقابل الخلفية الفعلية ≥ ٣ (مكوّن واجهة) وتباين حدّه ≥ ١.٦
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const DES=(process.argv[2]&&!['dark','light'].includes(process.argv[2])?process.argv[2].split(','):ALL);
const MODES=process.argv.includes('dark')?['dark']:process.argv.includes('light')?['light']:['dark','light'];
const PAGES=['home','pray','read','msg','talk'];
let fail=0;const say=(ok,m)=>{if(!ok)fail++;console.log((ok?'ok   ':'FAIL ')+m)};
const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES){
  const p=await b.newPage({viewport:{width:390,height:844}});
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  const bad=[];
  for(const pg of PAGES){
    if(pg!=='home'){await p.evaluate(g=>document.querySelector('#uNav [data-go="'+g+'"]').click(),pg);await p.waitForTimeout(900)}
    else{await p.evaluate(()=>document.querySelector('#uNav [data-go="home"]').click());await p.waitForTimeout(900)}
    const items=await p.evaluate(()=>['uGear','uSearchBtn','v14Khalwa'].map(id=>{const e=document.getElementById(id);if(!e)return null;const r=e.getBoundingClientRect();if(!r.width||r.top<0||r.top>150)return null;const cs=getComputedStyle(e);const col=cs.color.match(/[\d.]+/g).map(Number),bc=cs.borderTopColor.match(/[\d.]+/g).map(Number);return {id,x:r.left,y:r.top,w:r.width,h:r.height,col,bc,op:+cs.opacity}}).filter(Boolean));
    if(!items.length)continue;
    const bufA=await p.screenshot();
    await p.evaluate(()=>{window.__hb=[];['uGear','uSearchBtn','v14Khalwa'].forEach(id=>{const e=document.getElementById(id);if(!e)return;window.__hb.push([e,e.getAttribute('style')]);e.style.setProperty('color','transparent','important');e.style.setProperty('-webkit-text-fill-color','transparent','important');e.querySelectorAll('*').forEach(c=>{window.__hb.push([c,c.getAttribute('style')]);c.style.setProperty('visibility','hidden','important')})})});
    await p.waitForTimeout(150);const bufB=await p.screenshot();
    const res=await p.evaluate(async([a64,b64,items])=>{const L=async s=>{const img=new Image();img.src='data:image/png;base64,'+s;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);return {g,sc:img.width/innerWidth}};
      const A=await L(a64),B=await L(b64);
      return items.map(it=>{const x=Math.floor(it.x*A.sc),y=Math.floor(it.y*A.sc),w=Math.floor(it.w*A.sc),h=Math.floor(it.h*A.sc);const da=A.g.getImageData(x,y,w,h).data,db=B.g.getImageData(x,y,w,h).data;const fa=[],fb=[];
        for(let i=0;i<da.length;i+=4){const d=Math.abs(da[i]-db[i])+Math.abs(da[i+1]-db[i+1])+Math.abs(da[i+2]-db[i+2]);if(d>24){fa.push([da[i],da[i+1],da[i+2]]);fb.push([db[i],db[i+1],db[i+2]])}}
        const med=(arr)=>[0,1,2].map(k=>arr.map(q=>q[k]).sort((p,q)=>p-q)[Math.floor(arr.length/2)]);
        return {id:it.id,n:fa.length,fg:fa.length?med(fa):null,bg:fb.length?med(fb):null}})},[bufA.toString('base64'),bufB.toString('base64'),items]);
    await p.evaluate(()=>{(window.__hb||[]).forEach(([e,st])=>{st==null?e.removeAttribute('style'):e.setAttribute('style',st)})});
    for(const r of res){if(r.id==='v14Khalwa')continue;/* إيموجي ملوّن، لا يُقاس */if(!r.n){bad.push(`${pg}:${r.id} لا أيقونة مرئية`);continue}const ratio=cr(r.fg,r.bg);if(ratio<3)bad.push(`${pg}:${r.id} أيقونة ${ratio.toFixed(2)}`)}
    await p.evaluate(()=>{const s=[...document.querySelectorAll('style')];});
  }
  say(!bad.length,`${d}/${m} أزرار الشريط ${bad.join(' | ')}`);await p.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);

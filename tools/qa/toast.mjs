// رسالة التوست (مثل «★ حُفظت في «جمل لمستني»») وزر التراجع مقروءة؟ node tools/qa/toast.mjs [تصاميم] [dark|light]
// لكل تصميم × وضع × صفحة (الرئيسية والصلاة والقراءات وأقوال الآباء): تباين لون نص التوست مقابل خلفيته الفعلية ≥ ٤.٥
const PW=process.env.PW||'/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium }=await import(PW);
import {serve} from './serve.mjs';
const PORT=+process.env.PORT||8777,BASE=process.env.BASE||`http://localhost:${PORT}`;
const srv=process.env.BASE?null:await serve(PORT);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
const ALL=['bearer','church','classic','cross','crown','glory','holy','lamp','qalaya','royal','shroud'];
const DES=(process.argv[2]&&!['dark','light'].includes(process.argv[2])?process.argv[2].split(','):ALL);
const MODES=process.argv.includes('dark')?['dark']:process.argv.includes('light')?['light']:['dark','light'];
let fail=0;const say=(ok,m)=>{if(!ok)fail++;console.log((ok?'ok   ':'FAIL ')+m)};
const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const cr=(a,c)=>{const x=lum(a),y=lum(c);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const d of DES)for(const m of MODES){
  const p=await b.newPage({viewport:{width:390,height:844}});
  await p.addInitScript(([d,m])=>{localStorage.setItem('rafeeq_v76_design',d);localStorage.setItem('khalwa_settings_v80',JSON.stringify({themeMode:m}))},[d,m]);
  await p.goto(BASE+'/index.html');await p.waitForTimeout(1500);
  const bad=[];
  for(const pg of ['home','pray','read','fat']){
    await p.evaluate(g=>document.querySelector('#uNav [data-go="'+g+'"]').click(),pg);await p.waitForTimeout(800);
    await p.evaluate(()=>{__F.toast('★ حُفظت في «جمل لمستني» (المفضلة)',{undo:function(){}})});await p.waitForTimeout(500);
    const it=await p.evaluate(()=>{const e=document.getElementById('uToast');if(!e)return null;const r=e.getBoundingClientRect();const cs=getComputedStyle(e);const kids=[...e.querySelectorAll('*')].map(k=>({c:getComputedStyle(k).color,tag:k.tagName}));return {x:r.left,y:r.top,w:r.width,h:r.height,col:cs.color,vis:r.width>0&&+cs.opacity>.9,kids}});
    if(!it||!it.vis){bad.push(pg+': التوست غير ظاهر');continue}
    const bufA=await p.screenshot();
    await p.evaluate(()=>{const e=document.getElementById('uToast');window.__tc=[e,e.getAttribute('style')];e.style.setProperty('color','transparent','important');e.style.setProperty('-webkit-text-fill-color','transparent','important');e.querySelectorAll('*').forEach(k=>k.style.setProperty('color','transparent','important'))});
    await p.waitForTimeout(150);const bufB=await p.screenshot();
    await p.evaluate(()=>{const [e,s]=window.__tc;s==null?e.removeAttribute('style'):e.setAttribute('style',s)});
    const res=await p.evaluate(async([a64,b64,it])=>{const L=async s=>{const img=new Image();img.src='data:image/png;base64,'+s;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);return {g,sc:img.width/innerWidth}};
      const A=await L(a64),B=await L(b64);const x=Math.floor(it.x*A.sc),y=Math.floor(it.y*A.sc),w=Math.floor(it.w*A.sc),h=Math.floor(it.h*A.sc);
      const da=A.g.getImageData(x,y,w,h).data,db=B.g.getImageData(x,y,w,h).data;const fa=[],fb=[];
      for(let i=0;i<da.length;i+=4){const dd=Math.abs(da[i]-db[i])+Math.abs(da[i+1]-db[i+1])+Math.abs(da[i+2]-db[i+2]);if(dd>40){fa.push([da[i],da[i+1],da[i+2]]);fb.push([db[i],db[i+1],db[i+2]])}}
      const med=arr=>[0,1,2].map(k=>arr.map(q=>q[k]).sort((p,q)=>p-q)[Math.floor(arr.length/2)]);
      return {n:fa.length,fg:fa.length?med(fa):null,bg:fb.length?med(fb):null}},[bufA.toString('base64'),bufB.toString('base64'),it]);
    if(!res.n){bad.push(pg+': لا نص مرئي');continue}
    const r=cr(res.fg,res.bg);if(r<4.5)bad.push(`${pg}: ${r.toFixed(2)}`);
    await p.waitForTimeout(3200);
  }
  say(!bad.length,`${d}/${m} التوست ${bad.join(' | ')}`);await p.close();
}
await b.close();if(srv)srv.close();process.exit(fail?1:0);

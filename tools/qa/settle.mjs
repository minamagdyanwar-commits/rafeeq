// انتظار ذكي لأدوات الفحص: بدل مدد ثابتة طويلة، حدٌّ أدنى قصير ثم انتظار هدوء الـDOM (يشمل تعديلات مُصلح التباين الذي يعمل بعد ١٦٠ms من آخر تغيّر).
// لا يتجاوز أبدًا المدة المطلوبة ms، فأسوأ حال = السلوك القديم. يجعل الفحص أسرع وأثبت تحت الضغط (عدة فحوص متوازية).
export function makeSettle(p) {
  const raw = p.waitForTimeout.bind(p);
  const settle = async (ms, quiet = 260) => {
    const min = Math.min(ms, Math.max(60, Math.round(ms * 0.15)));
    await raw(min);
    const rest = ms - min;
    if (rest <= 60) return;
    await p.evaluate(([q, mx]) => new Promise(res => {
      let t, d = false;
      const fin = () => { if (d) return; d = true; mo.disconnect(); res(); };
      const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(fin, q); });
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
      t = setTimeout(fin, q); setTimeout(fin, mx);
    }), [Math.min(quiet, rest), rest]);
  };
  const raf2 = () => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const noAnim = () => p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}' });
  return { settle, raf2, noAnim, raw };
}

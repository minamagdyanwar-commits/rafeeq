/* يولّد رحلات «المحطات» من content/bible-notes (بلا كتابة مكررة):
   ١) حسب الأسفار: رحلة لكل سفر فيه ٣ ذرات فأكثر؛ المحطات من ١ إلى ٤ بحسب عدد الذرات (تجميع إصحاحات متتالية).
   ٢) حسب الموضوعات: من _topics.json؛ كل محطة تشير إلى ذرات بمفتاح "فهرس_السفر:إصحاح:أول_آية".
   يعيد { id: رحلة } بنفس شكل data-journeys (days = محطات). النص الظاهر مبني من حقول do/back الموجودة + why المكتوبة في الموضوعات. */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const NAMES = { 6:'القضاة',10:'الملوك الأول',11:'الملوك الثاني',12:'أخبار الأيام الأول',14:'عزرا',15:'نحميا',16:'طوبيا',27:'يشوع بن سيراخ',45:'زكريا',72:'يوحنا الثانية', 0:'التكوين',1:'الخروج',2:'اللاويين',3:'العدد',4:'التثنية',5:'يشوع',8:'صموئيل الأول',13:'أخبار الأيام الثاني',20:'أيوب',21:'المزامير',23:'الأمثال',24:'الجامعة',28:'إشعياء',29:'إرميا',30:'مراثي إرميا',32:'حزقيال',33:'دانيال',35:'هوشع',36:'يوئيل',37:'عاموس',40:'ميخا',41:'ناحوم',42:'حبقوق',43:'صفنيا',44:'حجي',46:'ملاخي', 49: 'متى', 50: 'مرقس', 51: 'لوقا', 52: 'يوحنا', 53: 'أعمال الرسل', 54: 'رومية', 55: 'كورنثوس الأولى', 56: 'كورنثوس الثانية', 57: 'غلاطية', 58: 'أفسس', 59: 'فيلبي', 60: 'كولوسي', 61: 'تسالونيكي الأولى', 62: 'تسالونيكي الثانية', 63: 'تيموثاوس الأولى', 64: 'تيموثاوس الثانية', 65: 'تيطس', 66: 'فليمون', 67: 'العبرانيين', 68: 'يعقوب', 69: 'بطرس الأولى', 70: 'بطرس الثانية', 71: 'يوحنا الأولى', 72: 'يوحنا الثانية', 73: 'يوحنا الثالثة', 74: 'يهوذا', 75: 'رؤيا' };
const STAGES = [['البداية', 'أول الخطوات', '🌱'], ['الطريق', 'في السير', '🚶'], ['الثبات', 'مع التعب', '⛰'], ['الثمر', 'نهاية الرحلة', '🍇']];
const LABELS = ['ماذا نعمل وماذا نأخذ', 'الخلفية: لماذا قيل؟', 'الآيات في هذه المحطة'];
const refOf = (b, ch, v) => `${NAMES[b] || ('سفر' + b)} ${ch}:${v[0]}${v[1] !== v[0] ? '-' + v[1] : ''}`;
const line = a => (a.k === 'c' ? 'وصية' : 'وعد') + ' — ' + a.ref + ': ' + a.text;
export function loadAtoms(root) {
  const bd = join(root, 'content/bible-notes'), atoms = [];
  if (!existsSync(bd)) return atoms;
  for (const f of readdirSync(bd).filter(x => x.endsWith('.json') && !x.startsWith('_')).sort()) {
    const j = JSON.parse(readFileSync(join(bd, f), 'utf8'));
    for (const [ch, e] of Object.entries(j.chapters || {})) {
      for (const it of e.c || []) atoms.push({ b: j.book, ch: +ch, v: it.v, k: 'c', text: it.do, ref: refOf(j.book, +ch, it.v), key: `${j.book}:${ch}:${it.v[0]}` });
      for (const it of e.p || []) atoms.push({ b: j.book, ch: +ch, v: it.v, k: 'p', text: it.back, ref: refOf(j.book, +ch, it.v), key: `${j.book}:${ch}:${it.v[0]}` });
    }
  }
  return atoms.sort((a, z) => a.b - z.b || a.ch - z.ch || a.v[0] - z.v[0] || (a.k === 'c' ? -1 : 1));
}
function question(a) { const c = a.some(x => x.k === 'c'), p = a.some(x => x.k === 'p'); return c && p ? 'أي وصية هنا أستطيع أن أبدأ بها اليوم، وأي وعد أحتاج أن أتمسك به؟' : c ? 'أي وصية هنا أستطيع أن أبدأ بها اليوم، وما الذي يمنعني؟' : 'أي وعد هنا أحتاجه اليوم، وفيمَ يخصّني؟'; }
function task(a) { const c = a.find(x => x.k === 'c'); return c ? 'جرّب اليوم: ' + c.text : 'اكتب الوعد «' + a[0].ref + '» بخط يدك وكرّره ثلاث مرات في يومك.'; }
function day(title, a, why, q, t) {
  const lead = a[0];
  const refs = [...new Set(a.map(x => x.ref))].join(' · ');
  return [title, lead.ref, a.map(line).join('\n'), why, 'اقرأ كل آية في سياق إصحاحها: ' + refs, q || question(a), t || task(a)];
}
export function bibleJourneys(root, errs) {
  const atoms = loadAtoms(root), out = {}, review = { status: 'draft', note: 'مولّدة من content/bible-notes؛ تحتاج مراجعة لاهوتية' };
  /* ١) حسب الأسفار */
  const byBook = {};
  for (const a of atoms) (byBook[a.b] = byBook[a.b] || []).push(a);
  for (const [b, as] of Object.entries(byBook)) {
    if (as.length < 3) continue;
    const k = as.length <= 6 ? 1 : as.length <= 12 ? 2 : as.length <= 20 ? 3 : 4;
    const chs = [...new Set(as.map(x => x.ch))], groups = [];
    let per = Math.ceil(as.length / k), cur = [];
    for (const ch of chs) { cur.push(ch); if (cur.reduce((s, c) => s + as.filter(x => x.ch === c).length, 0) >= per && groups.length < k - 1) { groups.push(cur); cur = []; } }
    if (cur.length) groups.push(cur);
    const days = groups.map((g, i) => {
      const part = as.filter(x => g.includes(x.ch));
      const t = `المحطة ${i + 1}: ${NAMES[b]} ${g[0]}${g.length > 1 ? '–' + g[g.length - 1] : ''}`;
      return day(t, part, `هذه المحطة تجمع ${part.filter(x => x.k === 'c').length} وصية و${part.filter(x => x.k === 'p').length} وعدًا من ${NAMES[b]} ${g[0]}${g.length > 1 ? '–' + g[g.length - 1] : ''}. اقرأ الإصحاح أولًا لتعرف من يتكلم ولمن، ثم عُد إلى الوصية أو الوعد.`);
    });
    const nc = as.filter(x => x.k === 'c').length, np = as.length - nc;
    out['bb_' + b] = { id: 'bb_' + b, title: 'وصايا ووعود ' + NAMES[b], short: NAMES[b], icon: '📜', sub: `${nc} وصية · ${np} وعد في ${days.length === 1 ? 'محطة' : days.length + ' محطات'}`, cat: 'bnbook', labels: LABELS, stages: STAGES, days, review };
  }
  /* ٢) حسب الموضوعات */
  const tf = join(root, 'content/bible-notes/_topics.json');
  if (existsSync(tf)) for (const t of JSON.parse(readFileSync(tf, 'utf8'))) {
    const days = [];
    for (const st of t.stations) {
      const part = [];
      for (const key of st.refs) { const f = atoms.filter(a => a.key === key); if (!f.length) errs.push(`موضوع ${t.id}/${st.title}: لا ذرة بالمفتاح ${key}`); part.push(...f); }
      for (const f of ['title', 'why', 'question', 'task']) if (!st[f]) errs.push(`موضوع ${t.id}/${st.title}: حقل ناقص ${f}`);
      if (part.length) days.push(day(st.title, part, st.why, st.question, st.task));
    }
    out['bt_' + t.id] = { id: 'bt_' + t.id, title: t.title, short: t.short, icon: t.icon, sub: t.sub, cat: 'bntopic', labels: LABELS, stages: STAGES, days, review };
  }
  return out;
}

#!/usr/bin/env python3
"""يحوّل نصوص OCR لصفحات السنكسار إلى ملفات بيانات لكل شهر قبطي (syn-m01.js ... syn-m12.js).
الاستخدام:  python3 tools/syn-import.py <مجلد صفحات النص *.txt بترتيب الصفحات> <مجلد الإخراج>
- يحذف الصفحات المكررة المتتالية، ثم يقسّم النص عند عناوين الأيام داخل المتن («اليوم X من شهر Y المبارك»)
  مع تحمّل تلف OCR، ويتجاهل ترويسة الصفحة المتكررة (أول سطر في كل صفحة).
- يخرج لكل يوم: التذكارات (القائمة المرقّمة أعلى اليوم) والنص بفقرات.
OCR: pdftoppm -r 300 -gray ثم tesseract -l ara (نموذج tessdata_best) --psm 3."""
import sys,re,glob,json,os,difflib

ORD={'الأول':1,'الاول':1,'الثاني':2,'الثالث':3,'الرابع':4,'الخامس':5,'السادس':6,'السابع':7,'الثامن':8,'التاسع':9,'العاشر':10,'الحادي عشر':11,'الثاني عشر':12,'الثالث عشر':13,'الرابع عشر':14,'الخامس عشر':15,'السادس عشر':16,'السابع عشر':17,'الثامن عشر':18,'التاسع عشر':19,'العشرون':20,'الحادي والعشرون':21,'الثاني والعشرون':22,'الثالث والعشرون':23,'الرابع والعشرون':24,'الخامس والعشرون':25,'السادس والعشرون':26,'السابع والعشرون':27,'الثامن والعشرون':28,'التاسع والعشرون':29,'الثلاثون':30}
MONTHS=['توت','بابه','هاتور','كيهك','طوبه','امشير','برمهات','برمودة','بشنس','بوونه','ابيب','مسري']
DIAC=re.compile(r'[ً-ٰٟۖ-ۭ‎‏‪-‮]')

def _n(x):
    x=DIAC.sub('',x)
    for a,b in (('أ','ا'),('إ','ا'),('آ','ا'),('ؤ','و'),('ئ','ي'),('ة','ه'),('ى','ي')): x=x.replace(a,b)
    return x
ORD_N={_n(k):v for k,v in ORD.items()}
MON_N=[_n(m) for m in MONTHS]

def close(w,cands,cut):
    m=difflib.get_close_matches(w,cands,n=1,cutoff=cut)
    return m[0] if m else None

def parse_heading(l):
    """عنوان يوم؟ يرجع (شهر 0..11 أو None، نص الترتيب العددي كما قرأه OCR) أو None إن لم يكن عنوانًا."""
    n=_n(l); n=re.sub(r'[^ء-ي ]',' ',n); n=n.replace('عشرمن','عشر من'); n=re.sub(r'\s+',' ',n).strip()
    toks=n.split()
    if not 3<=len(toks)<=11 or len(n)>75: return None
    if not any(re.match(r'^ال[يبه][وه]',t) for t in toks[:2]): return None        # العنوان يبدأ بـ «اليوم» (يستبعد جمل مثل «في اليوم ... من شهر»)
    mon=None
    for t in toks:
        if len(t)>=3:
            c=close(t,MON_N,0.7)
            if c: mon=MON_N.index(c); break
    # كلمة «شهر» أو «المبارك» (قد تتلف) + اسم الشهر أو نمط «اليوم ... من ...»
    has_shahr=any(close(t,['شهر'],0.66) for t in toks if len(t)>=3)
    has_mbrk=any(close(t,['المبارك'],0.6) for t in toks if len(t)>=4)
    has_yawm=bool(re.match(r'^(ال[يبه]*[وهي]*م*ر?|ل|ب|ا)\s',n)) or 'اليوم' in n
    loose=('شهر' in n) or ('مبارك' in n) or ('ابارك' in n)                      # كلمات ملتصقة مثل «شهرمشير»
    if not ((mon is not None and (has_shahr or has_mbrk)) or (has_mbrk and has_shahr) or (has_yawm and has_shahr and mon is not None) or loose): return None
    # اليوم: الكلمات قبل «من»/«شهر»
    cut=len(toks)
    for i,t in enumerate(toks):
        if t=='من' or ('شهر' in t) or (t!='عشر' and close(t,['شهر'],0.8) and len(t)>=3): cut=i; break
    head=[t for t in toks[:cut]]
    if head and (close(head[0],['اليوم'],0.6) or head[0].startswith('الي') or head[0].startswith('اله')): head=head[1:]
    return (mon,' '.join(head))

def clean_line(l):
    l=DIAC.sub('',l).replace(' ',' ')
    if l.count('+')>=2:                       # خط فاصل مزخرف: نبقي ما بعده إن وُجد نص
        l=l[l.rfind('+')+1:]
        if len(re.findall(r'[ء-ي]',l))<3: l=''
    toks=[]
    for t in l.split():
        ar=re.search(r'[ء-ي]',t)
        if '+' in t or '*' in t or len(t)>18 or (ar and re.search(r'[0-9A-Za-z]',t)): continue          # حشو OCR من خطوط فاصلة وأرقام ملتصقة
        if ar and len(t)>7 and len(set(t))<=4: continue                                    # تكرار حروف («وجوجوجو»)
        toks.append(t)
    return re.sub(r'\s+',' ',' '.join(toks)).strip()

VOCAB=set(); FREQ={}
CONF={'ب':'يتثن','ي':'بتثنى','ت':'بثنيط','ث':'بتنيط','ن':'بتثي','ح':'جخ','ج':'حخ','خ':'حج','ف':'ق','ق':'فو','ر':'ز','ز':'ر','د':'ذ','ذ':'د','س':'شص','ش':'س','ص':'سض','ض':'ص','ع':'غ','غ':'ع','ط':'ظ','ظ':'ط','ه':'ةح','ة':'ه','و':'ؤق','ى':'ي','ا':'ل'}
def fix_word(w):
    n=_n(w)
    if FREQ.get(n,0)>1 or len(n)<4 or not re.fullmatch(r'[ء-ي]+',n): return w
    best=None
    for i,ch in enumerate(n):
        for r in CONF.get(ch,''):
            c=n[:i]+r+n[i+1:]
            f=FREQ.get(c,0)
            if f>=30 and (best is None or f>best[0]): best=(f,c)
    return best[1] if best else w

# تصحيحات OCR مؤكَّدة (كلمات غير موجودة في العربية → الصواب). تُراجَع يدويًا ولا تُولَّد آليًا.
FIX={}
for _a,_b in [
 ('القديلس القهديس القلديس القدريس القليس القديى القهدس','القديس'),('هنذا هذها','هذا'),('نسنة سننة سنلة سبنة سنئة سئنة','سنة'),
 ('وكنان','وكان'),('معثا معلنا معغنا معاا','معنا'),('الربء','الرب'),('الكنليسة الكنيسنة','الكنيسة'),
 ('اسنتشهاد ستشهاد','استشهاد'),('الشهاذة','الشهادة'),('ولدء','ولد'),('إكليلى','إكليل'),('بالسيذ','بالسيد'),
 ('المرقسنية المرقفسية المرقيسية','المرقسية'),('حيلث حييث حيبث','حيث'),('يوجنا','يوحنا'),('جسلده','جسده'),
 ('الإيمانء','الإيمان'),('الرهبانء الزهبان الرهبانى','الرهبان'),('رأسنه','رأسه'),('يلسوع','يسوع'),('تكريسن','تكريس'),
 ('بظرس','بطرس'),('مكازيوس','مكاريوس'),('الإبيمان الإيبمان الإيممان','الإيمان'),('مديندة مديلة مدينئة','مدينة'),
 ('الإسشكندرية','الإسكندرية'),('نيانحة','نياحة'),('للنشهداء','للشهداء'),('ذائما','دائما'),('المجدء','المجد'),
 ('ولزبنا','ولربنا'),('نباحته','نياحته'),('ودفلنوه','ودفنوه'),('الغزبية','الغربية'),('الثلانة','الثلاثة'),
 ('اللبل','الليل'),('بللدة','بلدة'),('آلحياة','الحياة'),('الأضطهاد اللاضطهاد','الاضطهاد'),
 ('البوم','اليوم'),('الإلمي الألمي','الإلهي'),('للإلمي','للإلهي'),('تنح','تنيح'),('اللقدس الملقدس','المقدس'),('اللسيح','المسيح'),
 ('امجمع','المجمع'),('الكئيسة الكيسة','الكنيسة'),('الكئيسة','الكنيسة'),('مديئة','مدينة'),('مديئه','مدينة'),
 ('الإبمان وإبمان بالإبمان','الإيمان'),('كنئيسة كئيسة','كنيسة'),('للكنئيسة','للكنيسة'),('اللسيحي','المسيحي'),('امرقسية','المرقسية'),('ممحافظة','بمحافظة'),('اليبانا','البابا'),('وثقام','وتقام'),('ماثة','مائة'),('ألناسيوس','أثناسيوس'),('اللوت','الموت'),('اللصير','للصبر'),('بخلرد','بخلود'),('ستحاريب','سنحاريب'),('تنبا','تنبأ'),('الملنصب','المنصب'),('هادكة','هادئة'),('الملايكه','الملائكة'),('عندكذ','عندئذ'),('حينقذ','حينئذ'),('اللصير','للصبر'),('الكتيية','الكتيبة'),('لثلا','لئلا'),('جيعا','جميعا'),('الأنياء','الأنبياء'),('الرؤياء','الرؤيا'),('المميعاد','الميعاد'),('الهميكل','الهيكل'),('تعذييهم','تعذيبهم'),('بتعذييهم','بتعذيبهم'),('وبالإبمان','وبالإيمان'),('وإمانه','وإيمانه'),('إمانه إعانه','إيمانه'),('الأنا','الأنبا'),('ألأنبا','الأنبا'),('الاسكندرية','الإسكندرية'),
]:
    for _w in _a.split(): FIX[_w]=_b
_AR=re.compile(r'[ء-ي]+')
def post(l):
    l=re.sub(r'(^|\s)[فقد]\s+(مثل هذا)',r'\1في \2',l)                 # «ف مثل هذا اليوم» → «في مثل هذا اليوم»
    l=re.sub(r'\(\s*\)','',l)                                       # أقواس فارغة بعد سقوط أرقام
    def fw(m):
        w=m.group(0)
        if w in FIX: return FIX[w]
        n=_n(w)
        if w.endswith('ءء'): return w[:-1]
        if w.endswith('هاء') and len(w)>4 and FREQ.get(_n(w[:-1]),0)>=3 and FREQ.get(n,0)<=1: return w[:-1]
        if len(w)>3 and w.endswith('ء') and w[-2] not in 'يو':                                  # «ء» زائدة ناتجة من فاصلة (،) مقروءة خطأ
            f0=FREQ.get(_n(w[:-1]),0); f1=FREQ.get(n,0)
            if f0>=20 and f0>=5*f1: return w[:-1]
        return w
    return re.sub(r'\s+',' ',_AR.sub(fw,l)).strip()
def tclean(t):
    t=re.sub(r'["“”\'«»*|!؟]+',' ',t)
    if t.count('(')!=t.count(')'): t=t.replace('(','').replace(')','')
    t=re.sub(r'(\s[\d٠-٩]+)+\s*$','',t)                         # أرقام شاردة في آخر العنوان
    return re.sub(r'\s+',' ',t).strip(' .:،-')
def autocorrect(l): return ' '.join(fix_word(t) for t in l.split())
def vocab_ratio(l):
    ts=[_n(t) for t in l.split() if re.search(r'[ء-ي]{2}',t)]
    return (sum(1 for t in ts if t in VOCAB)/len(ts)) if ts else 1
def is_noise(l):
    if not l: return True
    if VOCAB and len(l.split())>=4 and vocab_ratio(l)<0.25: return True
    n=_n(l)
    if len(n.split())<=10 and any(close(t,['المبارك'],0.6) for t in n.split() if len(t)>=4) and 'شهر' in n.replace('ههر','شهر'): return True   # بقايا عنوان يوم
    if re.fullmatch(r'[\W\d_+•·\-–—=*|©®0-9٠-٩]*',l): return True        # فواصل وأرقام صفحات وحروف شاردة
    if len(re.findall(r'[ء-ي]',l))<3 and len(l)<14: return True
    if re.match(r'^[\d٠-٩\s\.:\-–/]*[ء-ي ]{0,12}[\d٠-٩ :\.\-–/]+$',l) and len(l)<26: return True   # هوامش مثل «أيوب ١:١»
    return False

TI=re.compile(r'^[^ء-ي\n]{0,8}[-–—]\s*((?:عيد|تذكار|استشهاد|نياحة|ظهور|تكريس|معجزة|انتقال|نقل|رقاد|اكتشاف|شهادة|بشارة|ميلاد|دخول|وضع|تجديد|اجتماع|صعود|تجلي|رد|عودة|إنشاء|بداية|صوم|وفاة|أول|ثاني|رسامة|سيامة|الاحتفال|احتفال|نياحه|إستشهاد|ثاني يوم|اليوم)[ء-ي ].*)$')

def nxt(cur):
    m,d=cur
    return (m,d+1) if d<30 else ((m+1,1) if m<11 else None)

def main(src,out):
    fs=sorted(glob.glob(src.rstrip('/')+'/*.txt'),key=lambda p:[int(x) if x.isdigit() else x for x in re.split(r'(\d+)',p)])
    pages=[];prev=None
    for f in fs:
        t=open(f,encoding='utf-8').read(); k=re.sub(r'\s+','',t)[:800]
        if k!=prev: pages.append(t)
        prev=k
    import collections
    cnt=collections.Counter(_n(t) for pg in pages for t in DIAC.sub('',pg).split() if re.search(r'[ء-ي]{2}',t))
    VOCAB.update(w for w,c in cnt.items() if c>=3); FREQ.update(cnt)
    cur=None; since=99; days={}; log=[]
    for pi,t in enumerate(pages):
        raw=[clean_line(l) for l in t.split('\n')]
        raw=[l for l in raw if l]
        # ترويسة الصفحة: أول عنوان بين أول 3 أسطر
        for i,l in enumerate(raw):
            ph=parse_heading(l)
            since+=1
            if ph is not None:
                mon,head=ph
                if cur is None:
                    best=max(((difflib.SequenceMatcher(None,' '.join(head.split()[-len(k.split()):]),k).ratio(),v) for k,v in ORD_N.items()),default=(0,0))
                    if mon is not None and best[0]>=0.75: cur=(mon,best[1]); days[cur]=[]; since=0; log.append(('start',cur,pi))
                    continue
                if mon is not None and mon!=cur[0] and not (cur[1]>=28 and mon==cur[0]+1):
                    continue                                          # إشارة لشهر آخر داخل النص، ليست عنوان يوم
                cands=[cur]; c=cur
                for _ in range(3):
                    c=nxt(c)
                    if c is None: break
                    cands.append(c)
                def sc(c):
                    ht=head.split()
                    r=max((difflib.SequenceMatcher(None,' '.join(ht[-len(k.split()):]),k).ratio() for k,v in ORD_N.items() if v==c[1]),default=0)
                    if mon is not None and mon!=c[0]: r-=0.25
                    return r
                best=max(cands,key=lambda c:(sc(c),-cands.index(c)))
                need=0.55 if best==nxt(cur) else 0.88                  # القفز لأكثر من يوم يحتاج تطابقًا قويًا
                if sc(best)<need or best==cur: continue            # ترويسة متكررة أو تالفة: تُهمل
                if since<=2 and best==nxt(cur) and False: continue
                cur=best; days.setdefault(cur,[]); since=0; log.append(('day',cur,pi)); continue
            if cur is not None: days[cur].append(l)
    data={}
    for (mi,d),lines in days.items():
        titles=[]; used=set()
        for k,l in enumerate(lines[:22]):
            m=TI.match(l)
            if m and len(m.group(1))<110: titles.append(m.group(1).strip(' .:،')); used.add(k)
        def trim(l):
            ts=l.split(); i=0
            for j,tk in enumerate(ts[:5]):
                if tk in ('-','–','—') and j>0 and j+1<len(ts): ts=ts[j+1:]; break
            while i<min(4,len(ts)) and _n(ts[i]) not in VOCAB and not re.match(r'^[-–—]$',ts[i]) and re.search(r'[ء-ي]',ts[i]): i+=1
            return ' '.join(ts[i:]) if i and i<len(ts) else l
        body=[post(autocorrect(trim(l))) for k,l in enumerate(lines) if k not in used and not is_noise(l)]
        titles=[tclean(post(autocorrect(t))) for t in titles]
        paras=[];buf=''
        for l in body:
            buf=(buf+' '+l).strip()
            if re.search(r'[\.؟!:]$',l) or re.search(r'(آمين|أمين)\s*\.?$',l): paras.append(buf);buf=''
        if buf: paras.append(buf)
        data.setdefault(mi,[]).append({'d':d,'t':titles,'b':'\n'.join(paras)})
    os.makedirs(out,exist_ok=True)
    hdr='/* بيانات السنكسار — مستخرجة آليًا (OCR) من كتاب «السنكسار» إعداد اللجنة المجمعية للطقوس، مكتبة دير السيدة العذراء السريان ٢٠١٢. غير مراجعة. تُولَّد بـ tools/syn-import.py */\n'
    total=0
    for mi in sorted(data):
        v=sorted(data[mi],key=lambda x:x['d'])
        js=hdr+'(window.__SYN=window.__SYN||{})['+str(mi+1)+']='+json.dumps(v,ensure_ascii=False,separators=(',',':'))+';\n'
        open('%s/syn-m%02d.js'%(out,mi+1),'w',encoding='utf-8').write(js); total+=len(js.encode())
        print(MONTHS[mi],len(v),'يومًا؛ ناقص:',sorted(set(range(1,31))-{x['d'] for x in v}),'| بلا تذكارات:',sum(1 for x in v if not x['t']))
    print('الحجم الكلي',total,'بايت')
if __name__=='__main__': main(sys.argv[1],sys.argv[2])

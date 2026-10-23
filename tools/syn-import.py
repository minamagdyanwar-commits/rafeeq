#!/usr/bin/env python3
"""يحوّل نصوص OCR لصفحات السنكسار إلى syn-data.js (بيانات الأيام لكل شهر قبطي).
الاستخدام:  python3 tools/syn-import.py <مجلد صفحات النص *.txt بترتيب الصفحات> <ملف الإخراج syn-data.js>
- يحذف الصفحات المكررة المتتالية، ويحدّد يوم كل صفحة من ترويستها («اليوم X من شهر Y المبارك») مع تصحيح أخطاء OCR الشائعة.
- يخرج لكل يوم: عناوين التذكارات (القائمة المرقّمة أعلى اليوم) والنص.
OCR: pdftoppm -r 300 -gray ثم tesseract -l ara (نموذج tessdata_best) --psm 3."""
import sys,re,glob,json,collections
ORD={'الأول':1,'الاول':1,'الثاني':2,'الثالث':3,'الرابع':4,'الخامس':5,'السادس':6,'السابع':7,'الثامن':8,'التاسع':9,'العاشر':10,'الحادي عشر':11,'الثاني عشر':12,'الثالث عشر':13,'الرابع عشر':14,'الخامس عشر':15,'السادس عشر':16,'السابع عشر':17,'الثامن عشر':18,'التاسع عشر':19,'العشرون':20,'الحادي والعشرون':21,'الثاني والعشرون':22,'الثالث والعشرون':23,'الرابع والعشرون':24,'الخامس والعشرون':25,'السادس والعشرون':26,'السابع والعشرون':27,'الثامن والعشرون':28,'التاسع والعشرون':29,'الثلاثون':30}
MON={'ثوت':'توت','نوت':'توت','دوت':'توت','توت':'توت','بأبه':'بابه','بابة':'بابه','بايه':'بابه','بابه':'بابه'}
HEAD=re.compile(r'ال[يب][وري]م\s+(.{3,30}?)\s+من\s+شهر\s*([^\s\.!:؛]+)')
DIAC=re.compile(r'[ً-ٰٟۖ-ۭ‎‏‪-‮]')
def clean_line(l):
    l=DIAC.sub('',l).replace(' ',' ')
    if l.count('+')>=3:                       # خط فاصل مزخرف: نبقي ما بعده إن وُجد نص
        l=l[l.rfind('+')+1:]
        if len(re.findall(r'[ء-ي]',l))<3: l=''
    l=re.sub(r'\s+',' ',l).strip()
    return l
def is_noise(l):
    if not l: return True
    if HEAD.search(l) and len(l)<70: return True
    if re.fullmatch(r'[\W\d_+•·\-–—=*|©®0-9٠-٩]*',l): return True        # فواصل وأرقام صفحات وحروف شاردة
    if len(re.findall(r'[ء-ي]',l))<3 and len(l)<14: return True
    if re.match(r'^[\d٠-٩\s\.:\-–/]*[ء-ي ]{0,12}[\d٠-٩ :\.\-–/]+$',l) and len(l)<26: return True   # هوامش مثل «أيوب ١:١»
    return False
def main(src,out):
    fs=sorted(glob.glob(src.rstrip('/')+'/*.txt'),key=lambda p:[int(x) if x.isdigit() else x for x in re.split(r'(\d+)',p)])
    pages=[];prev=None
    for f in fs:
        t=open(f,encoding='utf-8').read(); k=re.sub(r'\s+','',t)[:800]
        if k!=prev: pages.append(t)
        prev=k
    parsed=[]
    for t in pages:
        c=collections.Counter()
        for m in HEAD.finditer(t):
            d=ORD.get(m.group(1).strip()); mo=MON.get(m.group(2))
            if d and mo: c[(mo,d)]+=1
        parsed.append(c.most_common(1)[0][0] if c else None)
    # يوم كل صفحة: الصفحات بلا ترويسة تتبع السابقة (والمقدمة قبل أول يوم تُهمل)
    cur=None;days=collections.OrderedDict()
    for t,p in zip(pages,parsed):
        if p: cur=p
        if cur is None: continue
        days.setdefault(cur,[]).append(t)
    data=collections.OrderedDict()
    for (mo,d),ts in days.items():
        lines=[]
        for t in ts: lines+= [clean_line(l) for l in t.split('\n')]
        # قائمة التذكارات: أسطر مرقّمة قبل أول فاصل «+++»
        # التذكارات: أسطر مرقّمة «- نياحة ... / - استشهاد ...» في أعلى أول صفحات اليوم (قد يضيع بعضها من OCR)
        TI=re.compile(r'^[^ء-ي\n]{0,8}[-–—]\s*((?:عيد|تذكار|استشهاد|نياحة|ظهور|تكريس|معجزة|انتقال|نقل|رقاد|اكتشاف|شهادة|بشارة|ميلاد|دخول|وضع|تجديد|اجتماع|صعود|تجلي|رد|عودة|إنشاء|بداية|صوم|وفاة|أول|ثاني|رسامة|سيامة|الاحتفال|احتفال|نياحه|إستشهاد)[ء-ي ].*)$')
        head=[clean_line(l) for l in ts[0].split('\n')][:34]
        titles=[];used=set()
        for k,l in enumerate(head):
            m=TI.match(l)
            if m and len(m.group(1))<110: titles.append(m.group(1).strip(' .:،')); used.add(k)
        i=0
        lines=[l for l in lines]
        body=[l for l in lines if not is_noise(l) and not (TI.match(l) and len(l)<110 and l[l.find('-')+1:].strip(' .:،') in titles or TI.match(l) and l.split('-',1)[-1].strip(' .:،') in titles)]
        # دمج الأسطر المتتالية في فقرات: سطر ينتهي بنقطة/نقطتين رأسيتين يغلق الفقرة
        paras=[];buf=''
        for l in body:
            buf=(buf+' '+l).strip()
            if re.search(r'[\.؟!:]$',l) or re.search(r'(آمين|أمين)\s*\.?$',l): paras.append(buf);buf=''
        if buf: paras.append(buf)
        data.setdefault(mo,[]).append({'d':d,'t':titles,'b':'\n'.join(paras)})
    js='/* بيانات السنكسار — مستخرجة آليًا (OCR) من كتاب «السنكسار» إعداد اللجنة المجمعية للطقوس، مكتبة دير السيدة العذراء السريان ٢٠١٢. غير مراجعة. تُولَّد بـ tools/syn-import.py */\nwindow.__SYN='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
    open(out,'w',encoding='utf-8').write(js)
    for mo,v in data.items(): print(mo,len(v),'يومًا؛ ناقص:',sorted(set(range(1,31))-{x['d'] for x in v}))
    print('حجم الملف',len(js.encode()),'بايت')
if __name__=='__main__': main(sys.argv[1],sys.argv[2])

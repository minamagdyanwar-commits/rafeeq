/* مخزن حالة واحد بنسخة مخطط (schema v1) — v71
   ما كان ~٢٥ مفتاح localStorage منفصل (rafeeq_* و khalwa_* و dr_* و mohasba_*) صار كائنًا واحدًا
   تحت المفتاح rafeeq71_state. الكود القديم لا يتغيّر: نفس localStorage.getItem/setItem/removeItem/length/key،
   لكن هذه الطبقة تحوّلها إلى القراءة/الكتابة في الكائن الواحد.
   - الترحيل: أول تشغيل ينسخ المفاتيح القديمة إلى الكائن (المفاتيح القديمة تبقى كما هي لقطةً احتياطية، لا تُمسّ).
   - الكتابة مؤجّلة ~١٢٠ms وتُفرَّغ فورًا عند إخفاء الصفحة/إغلاقها؛ وتُدمج مع أي تبويب آخر مفتوح (آخر كاتب لكل مفتاح، لا لكل الكائن).
   - لا تمسّ مفاتيح غير التطبيق (مثل rafeeq2_* أو أي موقع آخر على نفس النطاق). */
(function () {
  var LS, SP;
  try { LS = window.localStorage; SP = Storage.prototype; if (!LS || !SP) return; LS.length; } catch (e) { return; }
  var raw = { get: SP.getItem, set: SP.setItem, rm: SP.removeItem, key: SP.key, clear: SP.clear };
  var lenD = Object.getOwnPropertyDescriptor(SP, 'length');
  if (!lenD || !lenD.get) return;
  var SKEY = 'rafeeq71_state', SCHEMA = 1, PRE = /^(khalwa_|dr_|mohasba_|rafeeq_)/;
  var rawLen = function () { return lenD.get.call(LS); };
  var rawKeys = function () { var a = []; for (var i = 0, n = rawLen(); i < n; i++) a.push(raw.key.call(LS, i)); return a; };
  var managed = function (k) { return PRE.test(String(k)); };
  var st = { v: SCHEMA, k: {} }, dirty = {}, timer = 0, readonly = false;

  function parse(s) { try { var o = JSON.parse(s); return o && o.k && typeof o.k === 'object' ? o : null; } catch (e) { return null; } }
  function load() {
    var cur = null;
    try { cur = parse(raw.get.call(LS, SKEY)); } catch (e) {}
    if (cur) { st = cur; if (st.v > SCHEMA) readonly = true; return; }
    /* ترحيل أول مرة من مفاتيح v70 */
    var k = {}, n = 0;
    try { rawKeys().forEach(function (key) { if (managed(key)) { var v = raw.get.call(LS, key); if (v !== null) { k[key] = v; n++; } } }); } catch (e) {}
    st = { v: SCHEMA, k: k, migrated: { at: new Date().toISOString(), from: 'v70-keys', n: n } };
    try { raw.set.call(LS, SKEY, JSON.stringify(st)); } catch (e) {}
  }
  function flush() {
    clearTimeout(timer); timer = 0;
    var keys = Object.keys(dirty); if (!keys.length || readonly) return;
    var cur = null;
    try { cur = parse(raw.get.call(LS, SKEY)); } catch (e) {}
    if (!cur) cur = { v: SCHEMA, k: {} };
    keys.forEach(function (key) { if (dirty[key] === 1) cur.k[key] = st.k[key]; else delete cur.k[key]; });
    if (st.migrated && !cur.migrated) cur.migrated = st.migrated;
    cur.v = SCHEMA; cur.t = Date.now();
    try { raw.set.call(LS, SKEY, JSON.stringify(cur)); dirty = {}; st.k = cur.k; } catch (e) { /* ممتلئ: يبقى في الذاكرة وتُعاد المحاولة */ timer = setTimeout(flush, 2000); }
  }
  function later() { if (!timer) timer = setTimeout(flush, 120); }

  SP.getItem = function (k) {
    if (this !== LS || !managed(k)) return raw.get.apply(this, arguments);
    k = String(k); return Object.prototype.hasOwnProperty.call(st.k, k) ? st.k[k] : null;
  };
  SP.setItem = function (k, v) {
    if (this !== LS || !managed(k)) return raw.set.apply(this, arguments);
    k = String(k); st.k[k] = String(v); dirty[k] = 1; later();
  };
  SP.removeItem = function (k) {
    if (this !== LS || !managed(k)) return raw.rm.apply(this, arguments);
    k = String(k); delete st.k[k]; dirty[k] = 2; later();
  };
  SP.clear = function () {
    if (this !== LS) return raw.clear.apply(this, arguments);
    Object.keys(st.k).forEach(function (k) { delete st.k[k]; dirty[k] = 2; });
    rawKeys().forEach(function (k) { if (k !== SKEY && !managed(k)) raw.rm.call(LS, k); });
    flush();
  };
  function list() {
    var a = Object.keys(st.k);
    rawKeys().forEach(function (k) { if (k !== SKEY && !managed(k)) a.push(k); });
    return a;
  }
  SP.key = function (i) { if (this !== LS) return raw.key.apply(this, arguments); var a = list(); return i >= 0 && i < a.length ? a[i] : null; };
  Object.defineProperty(SP, 'length', { configurable: true, enumerable: lenD.enumerable, get: function () { return this === LS ? list().length : lenD.get.call(this); } });

  load();
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  /* تبويب آخر كتب: ادمج مفاتيحه التي لم أعدّلها أنا */
  window.addEventListener('storage', function (e) {
    if (e.storageArea !== LS || e.key !== SKEY) return;
    var cur = parse(e.newValue); if (!cur) return;
    Object.keys(cur.k).forEach(function (k) { if (!dirty[k]) st.k[k] = cur.k[k]; });
    Object.keys(st.k).forEach(function (k) { if (!dirty[k] && !(k in cur.k)) delete st.k[k]; });
  });
  window.__rfStore = { schema: SCHEMA, flush: flush, snapshot: function () { return JSON.parse(JSON.stringify(st)); } };
})();

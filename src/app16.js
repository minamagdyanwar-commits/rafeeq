!(function () {
  "use strict";
  var e = window.__F;
  if (e) {
    var t = e.esc,
      n = "rafeeq_me_v1";
    ((window.__rfMine = _),
      (window.__dkKhalwa = dkKhalwa),
      document.addEventListener("click", function (e) {
        var t = e.target.closest && e.target.closest("[data-v70]");
        t && (e.preventDefault(), E(t.getAttribute("data-v70")));
      }),
      (window.__rfMemory = function (t, n, r) {
        if (!n) return "";
        var a = [],
          o = e.track(),
          i = e.parseKey(t),
          l = s();
        function u(t) {
          return e.dkey(e.addDays(i, -t));
        }
        var d = o.days[u(1)] || {},
          v = Object.keys(d.h || {})
            .filter(function (e) {
              return d.h[e];
            })
            .map(function (t) {
              var n = e.groupById && e.groupById(t);
              return n && n.label;
            })
            .filter(Boolean)
            .slice(0, 3),
          h = [];
        if (
          (v.length && h.push("صلّيت " + v.join(" و")),
          d.read && h.push("قريت قراءات اليوم"),
          d.med && h.push("قعدت معايا في الخلوة"),
          h.length)
        )
          a.push("وافتكر إنك امبارح " + h.join("، و") + ". كل ده محفوظ عندي.");
        else {
          for (var p = -1, m = 1; m <= 60; m++)
            if (e.dayScore(u(m)) > 0) {
              p = m;
              break;
            }
          p >= 2 &&
            a.push(
              "بقالك " +
                e.ard(p) +
                " أيام ما قابلتنيش، ومش زعلان منك. أنا مستنيك زي ما أنا، وكل مرة بترجع فيها كأنها أول مرة.",
            );
        }
        var g = l.reqs.filter(function (e) {
          return !e.done;
        });
        if (g.length) {
          var b = g[c(t) % g.length];
          a.push("وفاكر طلبتك: «" + b.t.slice(0, 60) + "»، وأنا سامعك وماسكها معاك.");
        }
        var y = l.reqs.filter(function (e) {
          return e.done && Date.now() - e.done < 2592e5;
        });
        y.length && a.push("وفرحت معاك إن «" + y[0].t.slice(0, 60) + "» استُجيبت، فاكر تشكرني؟");
        return a.join(" ");
      }));
    var o = i("godMessageArea");
    (o &&
      new MutationObserver(function () {
        b();
      }).observe(o, { childList: !0 }),
      ["openingArea", "closingArea", "recurringArea", "partsSectionArea", "introArea", "openingReflectionArea"].forEach(function (e) {
        var t = i(e);
        t && new MutationObserver(y).observe(t, { childList: !0 });
      }),
      ["page-home", "page-pray"].forEach(function (e) {
        var t = i(e);
        t && new MutationObserver(b).observe(t, { attributes: !0, attributeFilter: ["class"] });
      }),
      document.addEventListener("visibilitychange", function () {
        document.hidden || b();
      }),
      window.addEventListener("resize", function () {
        ((fabDirty = 1), b());
      }),
      document.addEventListener(
        "pointerdown",
        function (e) {
          var f = e.target.closest && e.target.closest("#uFab,#uThx,#uDrv");
          if (f) {
            ["uFab", "uThx", "uDrv"].forEach(function (id) {
              var x = i(id);
              x && x.classList.add("fab-on");
            });
            clearTimeout(window.__fabT);
            window.__fabT = setTimeout(function () {
              ["uFab", "uThx", "uDrv"].forEach(function (id) {
                var x = i(id);
                x && x.classList.remove("fab-on");
              });
            }, 3000);
          }
        },
        !0,
      ),
      new MutationObserver(function () {
        ((fabDirty = 1), b());
      }).observe(document.documentElement, { attributes: !0, attributeFilter: ["data-layout", "data-design", "data-theme", "data-pt", "data-rf-theme", "class", "style"] }),
      new MutationObserver(b).observe(document.body, { attributes: !0, attributeFilter: ["class"] }),
      setInterval(function () {
        var t = i("uThx");
        t && thxPos(t);
      }, 1000),
      setTimeout(b, 200),
      setTimeout(b, 1500));
  }
  function i(e) {
    return document.getElementById(e);
  }
  document.addEventListener("click", function (ev) {
    if (ev.target.closest && ev.target.closest("#uDrv")) {
      ev.preventDefault();
      typeof window.__driveOpen === "function" ? window.__driveOpen() : e.toast("وضع القيادة غير جاهز بعد");
    }
  });
  var cvx = null;
  function rgbOf(c) {
    cvx || (cvx = document.createElement("canvas").getContext("2d", { willReadFrequently: !0 }), (cvx.canvas.width = cvx.canvas.height = 1));
    cvx.clearRect(0, 0, 1, 1);
    cvx.fillStyle = "#000";
    cvx.fillStyle = c;
    cvx.fillRect(0, 0, 1, 1);
    var d = cvx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  function lumOf(a) {
    var f = function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(a[0]) + 0.7152 * f(a[1]) + 0.0722 * f(a[2]);
  }
  function crOf(a, b) {
    var x = lumOf(a),
      y = lumOf(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function mixC(a, b, k) {
    return [0, 1, 2].map(function (i) {
      return Math.round(a[i] * k + b[i] * (1 - k));
    });
  }
  function rgbS(a) {
    return "rgb(" + a.join(",") + ")";
  }
  /* لوحة الحالة الخفيفة للأزرار العائمة: خلفية صلبة ناعمة ورمز يحقق تباينًا لا يقلّ عن ٤٫٦ حتى لا يعدّله حارس التباين */
  function fabPalette(bg, fg, bd, pg) {
    var dbg = mixC(bg, pg, 0.5),
      cand = [fg, bd, [20, 14, 8], [250, 244, 232]],
      pick = null;
    for (var i = 0; i < cand.length && !pick; i++) crOf(cand[i], dbg) >= 4.6 && (pick = cand[i]);
    pick = pick || (crOf([20, 14, 8], dbg) >= crOf([250, 244, 232], dbg) ? [20, 14, 8] : [250, 244, 232]);
    for (var k = 0.4; k > 0; k -= 0.05) {
      var t = mixC(pick, dbg, 1 - k);
      if (crOf(t, dbg) >= 4.6) {
        pick = t;
        break;
      }
    }
    return { bg: rgbS(dbg), fg: rgbS(pick), bd: rgbS(mixC(bd, pg, 0.55)) };
  }
  var fabDirty = 1;
  function setVar(n, v) {
    var de = document.documentElement.style;
    de.getPropertyValue(n) !== v && de.setProperty(n, v);
  }
  function opq(c) {
    var m = /,\s*([\d.]+)\)$|\/\s*([\d.]+)\)$/.exec(c);
    return !!c && "transparent" !== c && !(m && parseFloat(m[1] || m[2]) < 0.95);
  }
  function thxPos(th) {
    var f = i("uFab"),
      dv = i("uDrv");
    if (f) {
      var now = Date.now();
      if (fabDirty || now - (thxPos.t || 0) > 5000) {
        fabDirty = 0;
        thxPos.t = now;
        var bd = document.body;
        bd.classList.add("fab-raw");
        var rc = getComputedStyle(f),
          fbg = rc.backgroundColor,
          ffg = rc.color,
          fbd = rc.borderTopColor,
          pg = getComputedStyle(bd).backgroundColor,
          cp = {};
        ["backgroundImage", "borderRadius", "width", "height", "fontSize", "fontWeight", "fontFamily", "lineHeight", "textShadow"].forEach(function (k) {
          cp[k] = rc[k];
        });
        cp.borderStyle = rc.borderTopStyle;
        cp.borderWidth = rc.borderTopWidth;
        bd.classList.remove("fab-raw");
        [th, dv].forEach(function (t) {
          t &&
            Object.keys(cp).forEach(function (k) {
              t.style[k] !== cp[k] && (t.style[k] = cp[k]);
            });
        });
        opq(pg) || (pg = getComputedStyle(document.documentElement).backgroundColor);
        opq(pg) || (pg = "#000");
        setVar("--fab-pg", pg);
        setVar("--fab-bg", opq(fbg) ? fbg : pg);
        setVar("--fab-fg", ffg);
        setVar("--fab-bd", fbd);
        var pl = fabPalette(rgbOf(opq(fbg) ? fbg : pg), rgbOf(ffg), rgbOf(fbd), rgbOf(pg));
        setVar("--fab-dbg", pl.bg);
        setVar("--fab-dfg", pl.fg);
        setVar("--fab-dbd", pl.bd);
      }
      var r = f.getBoundingClientRect();
      if (r.width) {
        var x = Math.round(r.left) + "px",
          y = Math.round(window.innerHeight - r.top + 10),
          h = Math.round(r.height);
        [[th, y], [dv, y + h + 10]].forEach(function (q) {
          var t = q[0],
            yy = q[1] + "px";
          t && (t.style.left !== x && (t.style.left = x), t.style.bottom !== yy && (t.style.bottom = yy), (t.style.insetInlineStart = "auto"), (t.style.right = "auto"));
        });
      }
    }
  }
  function s() {
    try {
      var e = JSON.parse(localStorage.getItem(n) || "{}") || {};
      return ((e.reqs = e.reqs || []), (e.verses = e.verses || []), (e.thx = e.thx || []), e);
    } catch (e) {
      return { reqs: [], verses: [], thx: [] };
    }
  }
  function l(e) {
    try {
      localStorage.setItem(n, JSON.stringify(e));
    } catch (e) {}
  }
  function u() {
    return ((window.__rfPrefs && window.__rfPrefs.name) || "").trim();
  }
  function c(e) {
    for (var t = 0, n = 0; n < e.length; n++) t = (31 * t + e.charCodeAt(n)) >>> 0;
    return t;
  }
  function d() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function v(e) {
    return RF.fmtDate(e);
  }
  function p() {
    var t = s(),
      o = t.reqs.filter(function (e) {
        return !e.done;
      }).length,
      d = t.reqs.length - o,
      n = t.thx.length + d;
    return (
      "<div><small>دفتر الشكر</small><b>" +
      (n || o ? e.ard(n) + " شكر · " + e.ard(o) + " تنتظر · " + e.ard(d) + " استُجيبت" : "اكتب أول شكر أو طلبة") +
      '</b></div><button type="button" class="o" data-v70="reqs">فتح</button>'
    );
  }
  function m(e, t, n, r) {
    var a = i(e);
    return (
      a || (((a = document.createElement("div")).id = e), (a.className = t), n.insertBefore(a, r || null), a)
    );
  }
  function g(e, t) {
    e.getAttribute("data-v70h") !== t && ((e.innerHTML = t), e.setAttribute("data-v70h", t));
  }
  function b() {
    var th = i("uThx"),
      ph = i("page-home");
    th && ((th.hidden = !1), thxPos(th));
    var n,
      r = document.querySelector("#page-home .u-wrap");
    if (r) {
      var a = i("hExtra"),
        o = i("v69res"),
        l = a,
        d = i("v70mood-h"),
        f = m("v70req-h", "u-card v70req", r, l);
      d && d.remove();
      d = null;
      g(f, p());
      var b = (n = s().verses.filter(function (e) {
          return Date.now() - e.ts > 5184e5;
        })).length
          ? n[c(e.dkey()) % n.length]
          : null,
        w = i("v70echo-h");
      b
        ? g(
            (w = m("v70echo-h", "u-card v70echo", r, f.nextSibling)),
            "<div><small>آية أخذتَها لنفسك في " +
              t(v(b.ts)) +
              "</small><q>" +
              t(b.text) +
              "</q><cite>" +
              t(b.ref) +
              "</cite></div>",
          )
        : w && w.remove();
      for (var q = [o, d, f, i("v70echo-h")].filter(Boolean), k = !0, _ = 0; _ < q.length - 1; _++)
        q[_].nextElementSibling !== q[_ + 1] && (k = !1);
      (!k || (a && q[q.length - 1].nextElementSibling !== a)) &&
        q.forEach(function (e) {
          r.insertBefore(e, a);
        });
    }
    var E = i("godMessageArea");
    if (E) {
      var S = i("v70mood-p");
      S && S.remove();
      var x = E.querySelector(".god-message-card"),
        M = u();
      if (x && M && !x.querySelector(".v70gcall")) {
        var A = document.createElement("div");
        ((A.className = "v70gcall"), (A.textContent = "يا " + M + "،"));
        var D = x.querySelector(".god-message-title");
        D && D.after(A);
      }
    }
    y();
  }
  function ord() {
    var rc = i("recurringArea"),
      pt = i("partsSectionArea");
    rc && pt && rc.parentNode === pt.parentNode && rc.compareDocumentPosition(pt) & 4 && pt.after(rc);
    var k = 0;
    ["introArea", "openingReflectionArea", "openingArea", "partsSectionArea", "recurringArea", "v70pray", "closingArea"].forEach(
      function (id) {
        var a = i(id),
          n = a && a.querySelector(".acc-num");
        n && /^[٠-٩0-9]+$/.test(n.textContent.trim()) && ((k += 1), n.textContent !== e0(k - 1) && (n.textContent = e0(k - 1)));
      },
    );
  }
  function y() {
    var e = i("closingArea");
    if (e) {
      var n = !!(e.firstElementChild || (i("openingArea") && i("openingArea").firstElementChild)),
        r = i("v70pray");
      if (n) {
        r ||
          (((r = document.createElement("details")).id = "v70pray"),
          (r.className = "acc-card v70pray"),
          e.parentNode.insertBefore(r, e));
        var o = u(),
          l = s().reqs.filter(function (e) {
            return !e.done;
          }),
          pn = e.querySelector(".acc-num"),
          num = pn ? pn.textContent.trim() : "",
          c =
            '<summary><span class="acc-num">' +
            (num ? e0(num) : "") +
            '</span><span class="acc-title">طلبات<span class="acc-sub">من أجلي ومن أجل من أحب</span></span><span class="acc-caret">▾</span></summary><div class="acc-body"><p>يا رب، أنا ' +
            (o ? t(o) : "ابنك") +
            " واقف أمامك، وأضع بين يديك:</p>";
        l.length
          ? (c +=
              '<ul class="v70list">' +
              l
                .map(function (e) {
                  return (
                    '<li><span class="t">' +
                    t(e.t) +
                    '</span><button type="button" class="ok" data-v70="ans:' +
                    e.id +
                    '">✓ استُجيبت</button></li>'
                  );
                })
                .join("") +
              "</ul>")
          : (c += '<p style="opacity:.7">لسه ما كتبتش طلبات. اكتب أول طلبة هنا وهتظهر في كل صلاة.</p>');
        g(
          r,
          (c +=
            '<div class="v70add"><input id="v70rq" class="u-in" maxlength="160" placeholder="اكتب طلبتك…" aria-label="طلبة جديدة"><button type="button" class="u-btn on" data-v70="rqadd">إضافة</button></div><div class="v70acts"><button type="button" data-v70="reqs">فتح دفتر الشكر</button></div></div>'),
        );
      } else r && r.remove();
    }
    ord();
  }
  function e0(n) {
    var m = String(n).replace(/[٠-٩]/g, function (c) {
      return c.charCodeAt(0) - 1632;
    });
    return e.ard(+m + 1);
  }
  var dkTab = "thx",
    dkKind = "thx",
    dkAns = null;
  function dkDay(ts) {
    var d = e.dkey(new Date(ts));
    return d === e.dkey() ? "اليوم" : d === e.dkey(new Date(Date.now() - 864e5)) ? "أمس" : v(ts);
  }
  function dkStreak(st) {
    var D = {},
      n = 0,
      d = new Date();
    (st.thx.forEach(function (x) {
      D[e.dkey(new Date(x.ts))] = 1;
    }),
      st.reqs.forEach(function (x) {
        ((D[e.dkey(new Date(x.ts))] = 1), x.done && (D[e.dkey(new Date(x.done))] = 1));
      }));
    D[e.dkey(d)] || (d = new Date(Date.now() - 864e5));
    for (; D[e.dkey(d)]; ) (n++, (d = new Date(d.getTime() - 864e5)));
    return n;
  }
  function dkItems(st, tab) {
    var L = [];
    if ("thx" === tab) {
      st.thx.forEach(function (x) {
        L.push({ k: "thx", id: x.id, t: x.t, ts: x.ts });
      });
      st.reqs.forEach(function (x) {
        x.done && L.push({ k: "thxa", id: x.id, t: x.t, ts: x.done, since: x.ts, note: x.note });
      });
    } else
      st.reqs.forEach(function (x) {
        L.push(
          x.done
            ? { k: "ans", id: x.id, t: x.t, ts: x.ts, done: x.done, note: x.note }
            : { k: "req", id: x.id, t: x.t, ts: x.ts },
        );
      });
    return L.sort(function (a, b) {
      return b.ts - a.ts;
    });
  }
  function dkRow(x) {
    var tag = { thx: "شكر", thxa: "شكر على استجابة طلبة", req: "تنتظر", ans: "استُجيبت" }[x.k],
      sub =
        "thxa" === x.k
          ? "طلبتها من " + e.ard(Math.max(1, Math.round((x.ts - x.since) / 864e5))) + " يومًا"
          : "ans" === x.k
            ? "استُجيبت " + dkDay(x.done) + " · بعد " + e.ard(Math.max(1, Math.round((x.done - x.ts) / 864e5))) + " يومًا"
            : "",
      h =
        '<li class="dk-it dk-' +
        x.k +
        '"><span class="t"><b class="dk-tag">' +
        tag +
        "</b>" +
        (sub ? " <small>" + sub + "</small>" : "") +
        "<br>" +
        t(x.t) +
        (x.note ? '<small class="dk-nt">«' + t(x.note) + "»</small>" : "") +
        "</span>";
    if ("req" === x.k)
      h +=
        '<button type="button" class="ok" data-v70="ansopen:' +
        x.id +
        '">✓ استُجيبت</button><button type="button" data-v70="del:' +
        x.id +
        '" aria-label="حذف">🗑</button>';
    else if ("thxa" !== x.k)
      h +=
        '<button type="button" data-v70="' +
        ("thx" === x.k ? "tdel:" : "del:") +
        x.id +
        '" aria-label="حذف">🗑</button>';
    h += "</li>";
    if (dkAns === x.id)
      h +=
        '<li class="dk-ask"><label for="dk-nt">كيف جاءت الاستجابة؟ (اختياري)</label><input id="dk-nt" class="u-in" maxlength="160"><button type="button" class="u-btn on" data-v70="anssave:' +
        x.id +
        '">حفظ</button></li>';
    return h;
  }
  function dkKhalwa() {
    var st = s(),
      last = st.thx.slice(0, 3),
      open = st.reqs
        .filter(function (x) {
          return !x.done;
        })
        .slice(0, 4),
      h = "";
    (last.length &&
      (h +=
        "<h4>آخر ما شكرتَ عليه</h4><ul class=\"v70list\">" +
        last
          .map(function (x) {
            return '<li><span class="t">' + t(x.t) + "<small>" + t(dkDay(x.ts)) + "</small></span></li>";
          })
          .join("") +
        "</ul>"),
      open.length &&
        (h +=
          "<h4>طلباتك المفتوحة</h4><ul class=\"v70list\">" +
          open
            .map(function (x) {
              return (
                '<li><span class="t">' +
                t(x.t) +
                '</span><button type="button" class="ok" data-v70="gdans:' +
                x.id +
                '">✓ استُجيبت</button></li>'
              );
            })
            .join("") +
          "</ul>"));
    return (
      h +
      '<label class="dk-lab" for="gdThxIn">على ماذا تشكر الله الآن؟</label><textarea id="gdThxIn" class="gd-ta" rows="2" maxlength="160"></textarea><div class="gd-row"><button type="button" class="gd-btn" data-v70="gdthx">سجّله في دفتر الشكر</button></div>'
    );
  }
  function w() {
    var st = s(),
      open = st.reqs.filter(function (x) {
        return !x.done;
      }).length,
      done = st.reqs.length - open,
      tabs = [
        ["thx", "الشكر"],
        ["req", "الطلبات"],
      ],
      a =
        '<div class="dk-stats"><div><b>' +
        e.ard(st.thx.length + done) +
        "</b><span>شكرًا مسجّلًا</span></div><div><b>" +
        e.ard(open) +
        "</b><span>طلبات تنتظر</span></div><div><b>" +
        e.ard(dkStreak(st)) +
        '</b><span>يومًا متواصلًا</span></div></div><div class="dk-tabs" role="group" aria-label="تصفية">' +
        tabs
          .map(function (x) {
            return (
              '<button type="button" class="v70chip' +
              (dkTab === x[0] ? " on" : "") +
              '" aria-pressed="' +
              (dkTab === x[0]) +
              '" data-v70="tab:' +
              x[0] +
              '">' +
              x[1] +
              "</button>"
            );
          })
          .join("") +
        "</div>",
      L = dkItems(st, dkTab),
      last = "";
    L.length
      ? (L.forEach(function (x) {
          var d = dkDay(x.ts);
          (d !== last && ((a += (last ? "</ul>" : "") + "<h4>" + t(d) + '</h4><ul class="v70list">'), (last = d)),
            (a += dkRow(x)));
        }),
        (a += "</ul>"))
      : (a += '<p style="opacity:.7">' + ("req" === dkTab ? "لا طلبات بعد. اكتب أول طلبة." : "اكتب أول شكر على ما أعطاك الله اليوم.") + "</p>");
    return a;
  }
  var bfN = 14,
    BFALL = [
      ["bakr", "باكر"],
      ["thalitha", "الثالثة"],
      ["sadisa", "السادسة"],
      ["tasi3a", "التاسعة"],
      ["ghouroub", "الغروب"],
      ["noum", "النوم"],
      ["midnight", "نصف الليل"],
      ["setar", "الستار"],
      ["read", "قراءات"],
      ["med", "تأملات"],
      ["gd", "خلوة"],
      ["exam", "محاسبة"],
      ["prog", "رحلتي"],
    ],
    BFDEF = ["bakr", "thalitha", "sadisa", "tasi3a", "ghouroub", "noum", "read", "med"],
    bfEdit = !1;
  var BFD = { read: 1, med: 1, gd: 1, exam: 1, prog: 1 };
  function bfCols() {
    var v = RF.jget("rafeeq_bf_cols_v1", null);
    v = Array.isArray(v) ? v : BFDEF;
    return BFALL.filter(function (c) {
      return v.indexOf(c[0]) > -1;
    });
  }
  function bfOn(d, k) {
    return BFD[k] ? !!(e.day(d) || {})[k] : e.hourDone(d, k);
  }
  function bfSet(d, k, on) {
    BFD[k]
      ? e.setDay(d, function (x) {
          on ? (x[k] = 1) : delete x[k];
        })
      : e.setHour(d, k, on);
  }
  function bfDays() {
    for (var L = [], i = 0; i < bfN; i++) L.push(e.dkey(e.addDays(new Date(), -i)));
    return L;
  }
  function bfGrid() {
    var L = bfDays(),
      C = bfCols(),
      cnt = L.filter(function (d) {
        return C.some(function (c) {
          return bfOn(d, c[0]);
        });
      }).length,
      h =
        '<p class="bf-n">أيام فيها نشاط من آخر ' +
        e.ard(bfN) +
        ": <b>" +
        e.ard(cnt) +
        '</b> · <button type="button" class="bf-e" data-v70="bfedit">' +
        (bfEdit ? "إغلاق الأعمدة" : "اختيار الأعمدة") +
        "</button></p>";
    bfEdit &&
      (h +=
        '<div class="bf-pick">' +
        BFALL.map(function (c) {
          var on = C.some(function (x) {
            return x[0] === c[0];
          });
          return '<button type="button" class="v70chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-v70="bfcol:' + c[0] + '">' + c[1] + "</button>";
        }).join("") +
        "</div>");
    var gt = "grid-template-columns:74px repeat(" + C.length + ',minmax(46px,1fr));min-width:' + (74 + C.length * 50) + "px";
    h += '<div class="bf-w"><div class="bf-g" role="grid"><div class="bf-r bf-h" style="' + gt + '"><span></span>' +
      C.map(function (c) {
        return '<button type="button" data-v70="bfc:' + c[0] + '" aria-label="تعليم عمود ' + c[1] + '">' + c[1] + "</button>";
      }).join("") +
      "</div>";
    L.forEach(function (d) {
      h +=
        '<div class="bf-r" style="' + gt + '"><button type="button" class="bf-d" data-v70="bfr:' +
        d +
        '">' +
        t(RF.fmtDate(e.parseKey(d), { weekday: "short", day: "numeric", month: "numeric" })) +
        "</button>" +
        C.map(function (c) {
          var on = bfOn(d, c[0]);
          return '<button type="button" class="bf-c' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-v70="bf:' + d + ":" + c[0] + '">' + (on ? "✓" : "") + "</button>";
        }).join("") +
        "</div>";
    });
    return h + "</div></div>";
  }
  function bfOpen() {
    e.sheet(
      '<div class="v70sh bf"><h3 class="u-h3">استرجاع سجل الأيام</h3><p style="opacity:.8;margin:0 0 6px">اضغط على الخانة لتعليم الصلاة أو القراءة في اليوم ده. اضغط على اسم اليوم لتعليمه كله، أو على عنوان العمود لتعليمه في كل الأيام.</p><div id="bfg">' +
        bfGrid() +
        '</div><div class="row-gap" style="margin-top:10px"><button type="button" class="u-btn" data-v70="bfmore">أيام أكتر (٣٠ يوم)</button><button type="button" class="u-btn" onclick="__F.closeSheet()">تم</button></div></div>',
    );
  }
  function bfPaint() {
    var g = i("bfg");
    g && (g.innerHTML = bfGrid());
    e.refreshHome && e.refreshHome();
    e.renderTrk && e.renderTrk();
  }
  function q() {
    ((dkKind = dkTab), (dkAns = null));
    e.sheet(
      '<div class="v70sh dk"><h3 class="u-h3">دفتر الشكر</h3><div class="v70add"><input id="v70in" class="u-in" maxlength="160" placeholder="'+("req"===dkTab?"اكتب طلبتك…":"أشكرك يا رب على…")+'" aria-label="إدخال جديد"><button type="button" class="u-btn on" data-v70="add">إضافة</button></div><div id="v70lst">' +
        w() +
        '</div><div class="row-gap" style="margin-top:12px"><button type="button" class="u-btn" onclick="__F.closeSheet()">إغلاق</button></div></div>',
    );
    var n = i("v70in");
    n &&
      n.addEventListener("keydown", function (e) {
        "Enter" === e.key && (e.preventDefault(), E("add"));
      });
  }
  function k() {
    var e = i("v70lst");
    (e && (e.innerHTML = w()), b());
  }
  function _(t, n) {
    var r = s();
    if (
      r.verses.some(function (e) {
        return e.ref === t && e.text === n;
      })
    )
      e.toast("هذه الآية عندك بالفعل في «آياتي»");
    else {
      var a = { id: d(), ref: t, text: n, ts: Date.now() };
      (r.verses.unshift(a),
        l(r),
        b(),
        e.toast("حُفظت في «آياتي»", {
          undo: function () {
            var e = s();
            ((e.verses = e.verses.filter(function (e) {
              return e.id !== a.id;
            })),
              l(e),
              b());
          },
        }));
    }
  }
  function E(n) {
    var r = n.split(":"),
      o = r[0],
      c = r.slice(1).join(":"),
      v = s();
    if ("kind" === o) {
      dkKind = "req" === c ? "req" : "thx";
      var kb = document.querySelectorAll(".dk-seg button"),
        ki = i("v70in");
      (kb.forEach(function (x) {
        var on = x.getAttribute("data-v70") === "kind:" + dkKind;
        (x.classList.toggle("on", on), x.setAttribute("aria-pressed", String(on)));
      }),
        ki && (ki.placeholder = "req" === dkKind ? "اكتب طلبتك…" : "أشكرك يا رب على…"));
    } else if ("tab" === o) {
      ((dkTab = "req" === c ? "req" : "thx"), (dkKind = dkTab), k(), (i("v70in") && (i("v70in").placeholder = "req" === dkKind ? "اكتب طلبتك…" : "أشكرك يا رب على…")));
    } else if ("ansopen" === o) {
      ((dkAns = c), k());
      var an = i("dk-nt");
      an && an.focus();
    } else if ("anssave" === o) {
      var nt = i("dk-nt");
      v.reqs.forEach(function (x) {
        x.id === c && ((x.done = Date.now()), nt && nt.value.trim() && (x.note = nt.value.trim().slice(0, 160)));
      });
      ((dkAns = null), l(v), k(), e.toast("شكرًا يا رب ✓"));
    } else if ("tdel" === o) {
      var ti = -1,
        tw = null;
      if (
        (v.thx.forEach(function (x, n) {
          x.id === c && ((ti = n), (tw = x));
        }),
        !tw)
      )
        return;
      (v.thx.splice(ti, 1),
        l(v),
        k(),
        e.toast("حُذف", {
          undo: function () {
            var e = s();
            (e.thx.splice(Math.min(ti, e.thx.length), 0, tw), l(e), k());
          },
        }));
    } else if ("gdthx" === o) {
      var gi = i("gdThxIn"),
        gv = gi ? gi.value.trim() : "";
      if (!gv) return;
      (v.thx.unshift({ id: d(), t: gv.slice(0, 160), ts: Date.now() }), l(v), (gi.value = ""), e.toast("اتسجّل في دفتر الشكر ✓"), b());
    } else if ("gdans" === o) {
      (v.reqs.forEach(function (x) {
        x.id === c && (x.done = Date.now());
      }),
        l(v),
        b());
      var gl = document.querySelector('[data-v70="gdans:' + c + '"]');
      (gl && gl.closest("li") && gl.closest("li").remove(), e.toast("شكرًا يا رب ✓"));
    } else if ("reqs" === o) q();
    else if ("name" === o)
      e.sheet(
        '<div class="v70sh"><h3 class="u-h3">ما اسمك؟</h3><p style="opacity:.8">سيخاطبك به البرنامج في الرسائل والآيات والصلاة.</p><input id="v70nm" class="u-in" maxlength="30" value="' +
          t(u()) +
          '" placeholder="اسمك"><div class="row-gap" style="margin-top:10px"><button type="button" class="u-btn on" data-v70="namesave">حفظ</button></div></div>',
      );
    else if ("namesave" === o) {
      var p = i("v70nm");
      (!(function (e) {
        var t = window.__rfPrefs;
        if (t) {
          t.name = String(e || "")
            .trim()
            .slice(0, 30);
          try {
            localStorage.setItem("rafeeq_msg_v1", JSON.stringify(t));
          } catch (e) {}
        }
      })(p ? p.value : ""),
        e.closeSheet(),
        b(),
        e.toast("تشرّفنا يا " + (u() || "حبيبي")));
    } else if ("backfill" === o) bfOpen();
    else if ("bfmore" === o) {
      ((bfN = 30), bfPaint());
      var bm = document.querySelector('[data-v70="bfmore"]');
      bm && bm.remove();
    } else if ("bf" === o) {
      var bp = c.split(":");
      (bfSet(bp[0], bp[1], !bfOn(bp[0], bp[1])), bfPaint());
    } else if ("bfr" === o) {
      var br = bfCols().every(function (x) {
        return bfOn(c, x[0]);
      });
      (bfCols().forEach(function (x) {
        bfSet(c, x[0], !br);
      }),
        bfPaint());
    } else if ("bfedit" === o) ((bfEdit = !bfEdit), bfPaint());
    else if ("bfcol" === o) {
      var bv = bfCols().map(function (x) {
        return x[0];
      }),
        bi = bv.indexOf(c);
      (bi > -1 ? bv.splice(bi, 1) : bv.push(c), bv.length && RF.jset("rafeeq_bf_cols_v1", bv), bfPaint());
    } else if ("bfc" === o) {
      var bl = bfDays(),
        ba = bl.every(function (d) {
          return bfOn(d, c);
        });
      (bl.forEach(function (d) {
        bfSet(d, c, !ba);
      }),
        bfPaint());
    } else if ("rqadd" === o) {
      var rq = i("v70rq"),
        rv = rq ? rq.value.trim() : "";
      if (!rv) return;
      (v.reqs.unshift({ id: d(), t: rv.slice(0, 160), ts: Date.now(), done: 0 }), l(v), b(), e.toast("اتحطّت في طلباتك ✓"));
      var rq2 = i("v70rq");
      rq2 && rq2.focus();
    } else if ("add" === o || "add" === n) {
      var m = i("v70in"),
        g = m ? m.value.trim() : "";
      if (!g) return;
      ("req" === dkKind
        ? v.reqs.unshift({ id: d(), t: g.slice(0, 160), ts: Date.now(), done: 0 })
        : v.thx.unshift({ id: d(), t: g.slice(0, 160), ts: Date.now() }),
        l(v),
        (m.value = ""),
        k(),
        m.focus());
    } else if ("ans" === o)
      (v.reqs.forEach(function (e) {
        e.id === c && (e.done = Date.now());
      }),
        l(v),
        k(),
        e.toast("شكرًا يا رب ✓", {
          undo: function () {
            var e = s();
            (e.reqs.forEach(function (e) {
              e.id === c && (e.done = 0);
            }),
              l(e),
              k());
          },
        }));
    else if ("del" === o) {
      var y = -1,
        w = null;
      if (
        (v.reqs.forEach(function (e, t) {
          e.id === c && ((y = t), (w = e));
        }),
        !w)
      )
        return;
      (v.reqs.splice(y, 1),
        l(v),
        k(),
        e.toast("حُذفت", {
          undo: function () {
            var e = s();
            (e.reqs.splice(Math.min(y, e.reqs.length), 0, w), l(e), k());
          },
        }));
    } else if ("vdel" === o) {
      var E = -1,
        S = null;
      if (
        (v.verses.forEach(function (e, t) {
          e.id === c && ((E = t), (S = e));
        }),
        !S)
      )
        return;
      (v.verses.splice(E, 1),
        l(v),
        k(),
        e.toast("حُذفت", {
          undo: function () {
            var e = s();
            (e.verses.splice(Math.min(E, e.verses.length), 0, S), l(e), k());
          },
        }));
    }
  }
})();

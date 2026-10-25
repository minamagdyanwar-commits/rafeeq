!(function () {
  "use strict";
  var e = window.__F;
  if (e) {
    var t = [
        {
          i: "✠",
          h: "أهلًا بك في «الرفيق الروحي»",
          p: "صلاتك وقراءاتك وتأملاتك ومحاسبتك في مكان واحد، وتعمل كلها <b>بدون إنترنت</b>.",
        },
        {
          i: "🕊",
          h: "الصلاة",
          p: "من «الصلاة» افتح <b>صلاة الساعة الحالية</b> مباشرة، أو اختر أي ساعة من الأجبية، ويمكنك دمج صلاتين معًا.",
        },
        {
          i: "📖",
          h: "القراءات والكتاب المقدس",
          p: "«القراءات» لقراءات اليوم، و«الكتاب» (من «المزيد» أو «رحلتي») للكتاب المقدس كاملًا. حدّد آية لتحفظها أو تنسخها.",
        },
        {
          i: "✉",
          h: "رسالة من يسوع",
          p: "رسالة جديدة كل يوم باسمك. احفظ المفضلة، وشاركها كبطاقة جميلة. تظهر نقطة حمراء حتى تقرأ رسالة اليوم.",
        },
        {
          i: "🕯",
          h: "الخلوة والمحاسبة",
          p: "الشمعة 🕯 أعلى الشاشة تُبقي الشاشة مضاءة وتخفي المشتّتات (اضغط مطوّلًا للخروج). و«المحاسبة» لمراجعة يومك قبل النوم.",
        },
      ],
      r = 0;
    ((window.__tour = v),
      document.addEventListener("click", function (t) {
        var n = t.target.closest && t.target.closest("[data-v69]");
        if (n) {
          var i = n.getAttribute("data-v69");
          if ("next" === i) {
            r++;
            var o = c("uSheetBody");
            o && (o.innerHTML = d());
          } else if ("skip" === i || "done" === i) (e.closeSheet(), f("rafeeq_onb_v1", 1));
          else if ("res" === i)
            !(function () {
              var t = u(a);
              if (!t) return;
              try {
                "bible" === t.t
                  ? e.openBible(t.b, t.c)
                  : "hour" === t.t && window.__rafeeq.act("hour", { dataset: { key: t.key } });
              } catch (e) {}
            })();
          else if ("tour" === i) {
            var l = c("settingsClose");
            (l && l.click(), setTimeout(v, 150));
          }
        }
      }),
      /[?&]go=/.test(location.search) ||
        setTimeout(function () {
          var e = c("uSheet");
          (function () {
            try {
              if (localStorage.getItem("rafeeq_onb_v1")) return !1;
              for (
                var e = {
                    rafeeq_last: 1,
                    rafeeq_prefs_v1: 1,
                    rafeeq_msgseen_v1: 1,
                    rafeeq_resume_v1: 1,
                    dr_visited_v1: 1,
                  },
                  t = 0;
                t < localStorage.length;
                t++
              )
                if (!e[localStorage.key(t)]) return !1;
              return !0;
            } catch (e) {
              return !1;
            }
          })() &&
            e &&
            !e.classList.contains("on") &&
            v();
        }, 1200),
      b(),
      setTimeout(b, 800),
      document.addEventListener(
        "click",
        function (e) {
          e.target.closest && e.target.closest("#settingsBtn,#uGear") && setTimeout(b, 200);
        },
        !0,
      ));
    var a = "rafeeq_resume_v1",
      n = c("trkBody");
    n &&
      new MutationObserver(function () {
        var t = e.bible,
          r = t && t.state;
        if (r && t.data && "read" === r.view)
          try {
            h({ t: "bible", b: r.b, c: r.c, label: t.label(r.b, r.c) });
          } catch (e) {}
      }).observe(n, { childList: !0 });
    var i = "";
    setInterval(m, 2e3);
    var o = c("page-pray");
    o &&
      new MutationObserver(function () {
        setTimeout(m, 300);
      }).observe(o, { attributes: !0, attributeFilter: ["class"] });
    var l = c("page-home");
    (l && new MutationObserver(g).observe(l, { attributes: !0, attributeFilter: ["class"] }),
      document.addEventListener("visibilitychange", function () {
        document.hidden || g();
      }),
      g());
    var s = c("msgBody");
    (s && (new MutationObserver(p).observe(s, { childList: !0 }), p()),
      (window.__shareCard = S),
      document.addEventListener("click", async function (t) {
        var r = t.target.closest && t.target.closest(".v69share");
        if (r) {
          r.disabled = !0;
          try {
            var a = await S();
            if (!a) throw 0;
            var n = new File([a], "رسالة-يسوع.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [n] }))
              await navigator.share({ files: [n], title: "رسالة من يسوع" });
            else {
              var i = document.createElement("a");
              ((i.href = URL.createObjectURL(a)),
                (i.download = "رسالة-يسوع.png"),
                document.body.appendChild(i),
                i.click(),
                i.remove(),
                setTimeout(function () {
                  URL.revokeObjectURL(i.href);
                }, 4e3),
                e.toast("حُفظت البطاقة كصورة"));
            }
          } catch (t) {
            (t && "AbortError" === t.name) || e.toast("تعذّر إنشاء البطاقة");
          }
          r.disabled = !1;
        }
      }),
      /[?&]go=tour/.test(location.search) && setTimeout(v, 900));
  }
  function c(e) {
    return document.getElementById(e);
  }
  function u(e) {
    try {
      return JSON.parse(localStorage.getItem(e));
    } catch (e) {
      return null;
    }
  }
  function f(e, t) {
    try {
      localStorage.setItem(e, JSON.stringify(t));
    } catch (e) {}
  }
  function d() {
    var e = t[r],
      a = r === t.length - 1,
      n = t
        .map(function (e, t) {
          return "<i" + (t === r ? ' class="on"' : "") + "></i>";
        })
        .join("");
    return (
      '<div class="v69tour" role="group" aria-label="الجولة ' +
      (r + 1) +
      " من " +
      t.length +
      '"><div class="ic" aria-hidden="true">' +
      e.i +
      "</div><h3>" +
      e.h +
      "</h3><p>" +
      e.p +
      '</p><div class="v69dots" aria-hidden="true">' +
      n +
      '</div><div class="v69row">' +
      (a ? "" : '<button type="button" data-v69="skip">تخطي</button>') +
      '<button type="button" class="p" data-v69="' +
      (a ? "done" : "next") +
      '">' +
      (a ? "ابدأ" : "التالي") +
      "</button></div></div>"
    );
  }
  function v() {
    ((r = 0), e.sheet(d(), "v69t"));
  }
  function b() {
    var e = c("settingsPanel");
    if (e && !e.querySelector(".v69tourbtn")) {
      var t = document.createElement("button");
      ((t.type = "button"),
        (t.className = "v69tourbtn"),
        t.setAttribute("data-v69", "tour"),
        (t.textContent = "عرض الجولة التعريفية"));
      var r = c("rfVer");
      r && r.parentNode === e ? e.insertBefore(t, r) : e.appendChild(t);
    }
  }
  function h(e) {
    e.ts = Date.now();
    var t = u(a);
    (t && t.t === e.t && t.b === e.b && t.c === e.c && t.key === e.key && Date.now() - t.ts < 3e4) ||
      (f(a, e), g());
  }
  function m() {
    var e = c("page-pray");
    if (e && e.classList.contains("on")) {
      var t = window.__k,
        r = t && t.getState && t.getState();
      if (r && r.hour && !r.mergedPair && r.hour !== i) {
        i = r.hour;
        var a = t.HOURS && t.HOURS[r.hour];
        h({ t: "hour", key: r.hour, label: "صلاة " + (a && a.label ? a.label : "الساعة") });
      }
    }
  }
  function g() {
    var e = document.querySelector("#page-home .u-wrap");
    if (e) {
      var t = u(a),
        r = c("v69res");
      if (t && t.label && Date.now() - t.ts < 2592e5) {
        if (!r) {
          (((r = document.createElement("div")).id = "v69res"), (r.className = "u-card v69res"));
          var n = c("hExtra");
          e.insertBefore(r, n || e.children[1] || null);
        }
        r.getAttribute("data-k") !== String(t.ts) &&
          ((r.innerHTML =
            '<div><small>أكمل من حيث توقفت</small><b></b></div><button type="button" data-v69="res">متابعة ←</button>'),
          (r.querySelector("b").textContent = t.label),
          r.setAttribute("data-k", String(t.ts)));
      } else r && r.remove();
    }
  }
  function p() {
    if (s) {
      var e = s.querySelector('[data-mg="copy"]');
      if (e && !s.querySelector(".v69share")) {
        var t = document.createElement("button");
        ((t.type = "button"),
          (t.className = "u-btn v69share"),
          (t.textContent = "🖼 مشاركة كبطاقة"),
          e.parentNode.insertBefore(t, e.nextSibling));
      }
    }
  }
  function y(e, t, r) {
    var a = String(t).split(/\s+/),
      n = [],
      i = "";
    return (
      a.forEach(function (t) {
        var a = i ? i + " " + t : t;
        e.measureText(a).width > r && i ? (n.push(i), (i = t)) : (i = a);
      }),
      i && n.push(i),
      n
    );
  }
  async function S() {
    var e = 1080,
      t = 1350,
      r = document.createElement("canvas");
    ((r.width = e), (r.height = t));
    var a = r.getContext("2d");
    try {
      await Promise.all(
        ["700 44px Amiri", "700 40px Cairo", "400 38px Cairo"].map(function (e) {
          return document.fonts.load(e);
        }),
      );
    } catch (e) {}
    var n = a.createLinearGradient(0, 0, 0, t);
    (n.addColorStop(0, "#5a1a28"),
      n.addColorStop(1, "#26080f"),
      (a.fillStyle = n),
      a.fillRect(0, 0, e, t),
      (a.strokeStyle = "#d6ad5a"),
      (a.lineWidth = 4),
      a.strokeRect(36, 36, 1008, 1278),
      (a.lineWidth = 1.5),
      a.strokeRect(52, 52, 976, 1246),
      (a.direction = "rtl"),
      (a.textAlign = "center"),
      (a.textBaseline = "alphabetic"));
    var i = 170;
    ((a.fillStyle = "#e8c468"),
      (a.font = "700 90px Amiri, serif"),
      a.fillText("✠", 540, i),
      (i += 82),
      (a.fillStyle = "#f6e7c1"),
      (a.font = "700 52px Amiri, Cairo, serif"),
      a.fillText("رسالة من يسوع", 540, i));
    var o = s.querySelector(".mg-date b"),
      l = o ? o.textContent : "";
    ((i += 64), (a.fillStyle = "#d6ad5a"), (a.font = "400 34px Cairo, sans-serif"), a.fillText(l, 540, i));
    var c = s.querySelectorAll(".mg-q"),
      u = c[c.length - 1],
      f = u && u.querySelector("p") ? u.querySelector("p").textContent : "",
      d = u && u.querySelector("cite") ? u.querySelector("cite").textContent : "",
      v = s.querySelector(".mg-p.end"),
      b = v ? v.textContent : "",
      h = s.querySelector(".mg-sig"),
      m = h ? h.textContent : "أحبك — يسوع ✠";
    return (
      (i += 110),
      (a.fillStyle = "#fff6df"),
      (a.font = "700 50px Amiri, serif"),
      y(a, "«" + f + "»", 860).forEach(function (e) {
        (a.fillText(e, 540, i), (i += 78));
      }),
      (i += 4),
      (a.fillStyle = "#d6ad5a"),
      (a.font = "400 34px Cairo, sans-serif"),
      a.fillText(d, 540, i),
      (i += 70),
      (a.strokeStyle = "#d6ad5a"),
      (a.lineWidth = 2),
      a.beginPath(),
      a.moveTo(450, i),
      a.lineTo(630, i),
      a.stroke(),
      (i += 82),
      (a.fillStyle = "#f3e6cf"),
      (a.font = "400 40px Cairo, sans-serif"),
      y(a, b, 840)
        .slice(0, 5)
        .forEach(function (e) {
          (a.fillText(e, 540, i), (i += 66));
        }),
      (a.fillStyle = "#e8c468"),
      (a.font = "700 46px Amiri, serif"),
      a.fillText(m, 540, Math.max(i + 60, 1130)),
      (a.fillStyle = "rgba(246,231,193,.55)"),
      (a.font = "400 28px Cairo, sans-serif"),
      a.fillText("الرفيق الروحي", 540, 1264),
      new Promise(function (e) {
        r.toBlob(e, "image/png");
      })
    );
  }
})();

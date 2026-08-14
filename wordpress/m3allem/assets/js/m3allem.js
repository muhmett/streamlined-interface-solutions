/**
 * M3allem front-end: the gate, the zone walkthrough, and the live search.
 * All data comes from WordPress through the localized `M3` object.
 */
(function () {
  "use strict";

  var D = window.M3 || {};

  /* ------------------------------------------------------------------ *
   * The gate
   * ------------------------------------------------------------------ */

  var gate = document.getElementById("gate");

  if (gate) {
    // Paint the door photo onto both leaves.
    if (D.door) {
      [].forEach.call(gate.querySelectorAll(".leaf .tex"), function (t) {
        t.style.backgroundImage = 'url("' + D.door + '")';
      });
    }

    // Dust motes drifting up through the light.
    var dust = document.getElementById("dust");
    if (dust) {
      for (var i = 0; i < 46; i++) {
        var m = document.createElement("span");
        var s = (1 + Math.random() * 2.4).toFixed(1);
        m.className = "mote";
        m.style.left = Math.random() * 100 + "%";
        m.style.bottom = -10 + Math.random() * 20 + "%";
        m.style.animationDuration = 9 + Math.random() * 13 + "s";
        m.style.animationDelay = Math.random() * 10 + "s";
        m.style.opacity = 0.25 + Math.random() * 0.6;
        m.style.width = s + "px";
        m.style.height = s + "px";
        dust.appendChild(m);
      }
    }

    // The photo is cover-fitted, so the padlock drifts as the viewport ratio
    // changes. Map its spot in the image through the same cover transform.
    var lock = document.getElementById("lock");
    var lockY = typeof D.doorPos === "number" ? D.doorPos : 0.655;
    var natural = { w: 2528, h: 1696 };

    if (D.door) {
      var probe = new Image();
      probe.onload = function () {
        natural.w = probe.naturalWidth;
        natural.h = probe.naturalHeight;
        placeLock();
      };
      probe.src = D.door;
    }

    function placeLock() {
      if (!lock) return;
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var scale = Math.max(vw / natural.w, vh / natural.h);
      var w = natural.w * scale;
      var h = natural.h * scale;
      lock.style.left = (vw - w) / 2 + 0.5 * w + "px";
      lock.style.top = (vh - h) / 2 + lockY * h + "px";
    }
    placeLock();
    window.addEventListener("resize", placeLock);

    var opened = false;
    function openGate() {
      if (opened) return;
      opened = true;
      gate.classList.add("open");
      document.body.classList.add("entered");
      setTimeout(function () {
        document.body.classList.remove("locked");
      }, 1500);
      setTimeout(function () {
        gate.classList.add("gone");
      }, 3000);
    }
    gate.addEventListener("click", openGate);
    window.addEventListener("keydown", function (e) {
      if (!opened && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openGate();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Walkthrough: parallax, reveals, progress rail
   * ------------------------------------------------------------------ */

  var zoneEls = [].slice.call(document.querySelectorAll(".zone"));
  var rail = document.getElementById("rail");

  if (rail && zoneEls.length) {
    zoneEls.forEach(function (z, i) {
      var name = z.querySelector("h3");
      var b = document.createElement("button");
      b.innerHTML =
        '<span class="dot"></span><span class="lbl"></span>';
      b.querySelector(".lbl").textContent = name ? name.textContent : "زون " + (i + 1);
      b.addEventListener("click", function () {
        z.scrollIntoView({ behavior: "smooth" });
      });
      rail.appendChild(b);
    });
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  [].forEach.call(document.querySelectorAll(".rv"), function (el) {
    io.observe(el);
  });

  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;

    zoneEls.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = (vh - r.top) / (vh + r.height);
      var pic = s.querySelector(".pic");
      if (pic) {
        pic.style.transform =
          "translateY(" + ((p - 0.5) * 9).toFixed(2) + "%) scale(" + (1.06 - p * 0.05).toFixed(3) + ")";
      }
    });

    if (rail) {
      var active = -1;
      zoneEls.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top < vh * 0.5 && r.bottom > vh * 0.5) active = i;
      });
      rail.classList.toggle("show", active >= 0);
      [].forEach.call(rail.children, function (b, i) {
        b.classList.toggle("on", i === active);
      });
    }
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", frame);
  frame();

  document.addEventListener("click", function (e) {
    var nav = e.target.closest && e.target.closest("[data-nav]");
    if (nav) {
      var el = document.getElementById(nav.dataset.nav);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ------------------------------------------------------------------ *
   * Toast
   * ------------------------------------------------------------------ */

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("on");
    }, 2800);
  }

  function post(action, data) {
    var body = new URLSearchParams();
    body.set("action", action);
    body.set("nonce", D.nonce);
    Object.keys(data).forEach(function (k) {
      body.set(k, data[k]);
    });
    return fetch(D.ajax, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }).then(function (r) {
      return r.json();
    });
  }

  /* ------------------------------------------------------------------ *
   * Client dashboard: live artisan search
   * ------------------------------------------------------------------ */

  var results = document.getElementById("results");
  if (results) {
    var clientEl = document.getElementById("client");
    var craft = clientEl ? clientEl.dataset.preset || "" : "";
    var q = "";
    var city = "";
    var filters = document.getElementById("filters");

    function buildFilters() {
      if (!filters) return;
      filters.innerHTML = "";
      var make = function (id, label) {
        var b = document.createElement("button");
        b.className = "f" + (craft === id ? " on" : "");
        b.textContent = label;
        b.addEventListener("click", function () {
          craft = craft === id ? "" : id;
          buildFilters();
          render();
        });
        filters.appendChild(b);
      };
      make("", "كلشي");
      (D.zones || []).forEach(function (z) {
        make(z.id, z.n);
      });
    }

    function stars(r) {
      var n = Math.round(r);
      return "★".repeat(n) + "☆".repeat(5 - n);
    }

    function card(p) {
      var wa = p.wa || (p.t ? "212" + p.t.replace(/^0/, "") : "");
      return (
        '<article class="card"><div class="pro">' +
        (p.img ? '<div class="av" style="background-image:url(\'' + p.img + "')\"></div>" : '<div class="av"></div>') +
        '<div style="flex:1;min-width:0">' +
        '<div class="nm"><a href="' + p.link + '">' + p.n + "</a>" +
        (p.v ? ' <span class="vf" title="موثّق">✓</span>' : "") +
        "</div>" +
        '<div class="cr">' + p.cn + (p.city ? " · " + p.city : "") + "</div>" +
        '<div class="stars">' + stars(p.r) +
        ' <small>' + (p.r || "—") + " (" + p.k + " تقييم)</small></div>" +
        "</div></div>" +
        '<div class="acts">' +
        (p.t ? '<a class="a-call" href="tel:' + p.t + '">📞 عيّط</a>' : "") +
        (wa ? '<a class="a-wa" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">واتساب</a>' : "") +
        '<a class="a-gh" href="' + p.link + '">البروفايل</a>' +
        "</div></article>"
      );
    }

    var reqId = 0;
    function render() {
      var mine = ++reqId;
      post("m3_search", { q: q, craft: craft, city: city })
        .then(function (res) {
          if (mine !== reqId) return; // a newer keystroke already won
          var list = (res && res.data) || [];
          if (!list.length) {
            results.innerHTML =
              '<div class="card" style="grid-column:1/-1;text-align:center;padding:44px">' +
              '<div style="font-size:34px">🔍</div>' +
              '<p style="margin-top:12px;opacity:.72">ماكاين حتى معلّم بهاد المواصفات. جرّب تبدّل الحرفة ولا المدينة.</p></div>';
            return;
          }
          results.innerHTML = list.map(card).join("");
        })
        .catch(function () {
          results.innerHTML =
            '<div class="card" style="grid-column:1/-1;text-align:center;padding:44px;opacity:.7">ماقدرناش نجيبو النتائج. عاود عافاك.</div>';
        });
    }

    var qEl = document.getElementById("q");
    var debounce;
    if (qEl) {
      qEl.addEventListener("input", function (e) {
        q = e.target.value.trim();
        clearTimeout(debounce);
        debounce = setTimeout(render, 280);
      });
    }
    var cityEl = document.getElementById("city");
    if (cityEl) {
      cityEl.addEventListener("change", function (e) {
        city = e.target.value;
        render();
      });
    }

    buildFilters();
    render();
  }

  /* ------------------------------------------------------------------ *
   * Urgent problem
   * ------------------------------------------------------------------ */

  var urgBtn = document.getElementById("urgBtn");
  if (urgBtn) {
    urgBtn.addEventListener("click", function () {
      var body = document.getElementById("urgTxt");
      var tel = document.getElementById("urgTel");
      var cityEl = document.getElementById("city");
      if (!body.value.trim()) {
        toast("كتب المشكل ديالك الأول");
        return;
      }
      urgBtn.disabled = true;
      post("m3_urgent", {
        body: body.value.trim(),
        tel: tel ? tel.value.trim() : "",
        city: cityEl ? cityEl.value : "",
      })
        .then(function (res) {
          if (res && res.success) {
            body.value = "";
            toast(res.data.msg);
          } else {
            toast((res && res.data && res.data.msg) || "وقع شي مشكل.");
          }
        })
        .catch(function () {
          toast("ماوصلش. شوف الكونيكسيون ديالك.");
        })
        .then(function () {
          urgBtn.disabled = false;
        });
    });
  }
})();

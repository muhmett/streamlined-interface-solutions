/**
 * M3allem front-end.
 *
 *  1. The gate — each brass knocker is its own entrance (client / artisan).
 *  2. The lobby — a real 3D shaft you fly into, one craft per side of a storey.
 *  3. The client search — filters, and ranking by actual distance.
 *
 * Everything it renders comes from WordPress through the localized `M3` object.
 */
(function () {
  "use strict";

  var D = window.M3 || {};
  var ZONES = D.zones || [];
  var ROLE_KEY = "m3allem.role";

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("on"); }, 2800);
  }

  function post(action, data) {
    var body = new URLSearchParams();
    body.set("action", action);
    body.set("nonce", D.nonce);
    Object.keys(data).forEach(function (k) { body.set(k, data[k]); });
    return fetch(D.ajax, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }).then(function (r) { return r.json(); });
  }

  function role() {
    try { return localStorage.getItem(ROLE_KEY) || ""; } catch (e) { return ""; }
  }
  function setRole(r) {
    try { localStorage.setItem(ROLE_KEY, r); } catch (e) {}
  }
  function roleUrl() {
    return role() === "pro" ? D.urls.pro : D.urls.client;
  }

  // Show which door the visitor came through, on every page.
  function showChip() {
    var r = role();
    if (!r) return;
    var nav = document.querySelector("header nav");
    if (!nav || nav.querySelector(".rolechip")) return;
    var c = document.createElement("span");
    c.className = "rolechip";
    c.textContent = r === "pro" ? "معلّم" : "كليان";
    nav.insertBefore(c, nav.firstChild);
  }
  showChip();

  /* ================================================================== *
   * 1. The gate
   * ================================================================== */

  var gate = document.getElementById("gate");

  if (gate) {
    if (D.door) {
      [].forEach.call(gate.querySelectorAll(".leaf .tex"), function (t) {
        t.style.backgroundImage = 'url("' + D.door + '")';
      });
    }

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

    // Where each knocker sits inside the photo, as a fraction of the image.
    // The photo is cover-fitted, so these have to be mapped every resize.
    var handY = typeof D.handY === "number" ? D.handY : 0.44;
    var handX = typeof D.handX === "number" ? D.handX : 0.075;
    var SPOTS = {
      client: { x: 0.5 + handX, y: handY },
      pro: { x: 0.5 - handX, y: handY },
    };
    var natural = { w: 2528, h: 1696 };
    var hands = [].slice.call(gate.querySelectorAll(".hand"));

    if (D.door) {
      var probe = new Image();
      probe.onload = function () {
        natural.w = probe.naturalWidth;
        natural.h = probe.naturalHeight;
        placeHands();
      };
      probe.src = D.door;
    }

    function placeHands() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var scale = Math.max(vw / natural.w, vh / natural.h);
      var w = natural.w * scale;
      var h = natural.h * scale;
      hands.forEach(function (el) {
        var spot = SPOTS[el.dataset.role];
        if (!spot) return;
        el.style.left = (vw - w) / 2 + spot.x * w + "px";
        el.style.top = (vh - h) / 2 + spot.y * h + "px";
      });
    }
    placeHands();
    window.addEventListener("resize", placeHands);

    var opened = false;
    function openGate(chosen) {
      if (opened) return;
      opened = true;
      if (chosen) {
        setRole(chosen);
        showChip();
      }
      gate.classList.add("open");
      document.body.classList.add("entered");
      setTimeout(function () { document.body.classList.remove("locked"); }, 1500);
      setTimeout(function () { gate.classList.add("gone"); }, 3000);
    }

    hands.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        el.classList.add("knock");
        setTimeout(function () { openGate(el.dataset.role); }, 260);
      });
    });

    // Anywhere else on the door still lets you in, without picking a side.
    gate.addEventListener("click", function () { openGate(""); });
    window.addEventListener("keydown", function (e) {
      if (!opened && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openGate("");
      }
    });
  }

  /* ================================================================== *
   * 2. The lobby — storeys receding in Z, one craft per side
   * ================================================================== */

  var scene = document.getElementById("scene");
  var lobby = document.getElementById("tour");
  var GAP = 520; // px between storeys in 3D space
  var storeys = [];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  if (scene && ZONES.length) {
    ZONES.forEach(function (z, i) {
      // One craft per hall. The work hangs on one wall and the carved maâlem
      // stands on a plinth across from it, so you walk between the two.
      var wall = i % 2 === 0 ? "r" : "l";
      var opposite = wall === "r" ? "l" : "r";
      var el = document.createElement("div");
      el.className = "storey";
      el.style.transform = "translateZ(" + -(i + 1) * GAP + "px)";
      el.innerHTML =
        '<div class="frame"></div><div class="sill"></div>' +
        '<a class="artwall ' + wall + '" href="' + z.link + '">' +
          '<span class="artframe"><span class="canvas" style="--h:' + (z.hue != null ? z.hue : 40) + '">' +
            (z.img
              ? '<img src="' + z.img + '" alt="" loading="lazy">'
              : '<span class="mark">' + (z.emblem || "") + "</span>") +
          "</span></span>" +
          '<span class="cartel"><span class="no">قاعة ' + pad(i + 1) + " / " + pad(ZONES.length) + "</span>" +
            "<b>" + z.n + "</b><span>" + z.pros + " معلّم</span></span>" +
        "</a>" +
        '<div class="plinth ' + opposite + '">' +
          '<div class="fig">' + (z.figure || "") + "</div>" +
          '<div class="base"></div>' +
        "</div>";
      el.dataset.names = z.n;
      el.dataset.link = z.link;
      scene.appendChild(el);
      storeys.push(el);
    });
    // Enough scroll to walk every hall.
    lobby.style.height = 100 + storeys.length * 78 + "svh";
  }

  var hud = document.getElementById("hud");
  var hudLvl = document.getElementById("hudLvl");
  var hudName = document.getElementById("hudName");
  var hudGo = document.getElementById("hudGo");
  var liveIndex = -1;

  function drive() {
    if (!scene || !lobby) return;
    var box = lobby.getBoundingClientRect();
    var travel = lobby.offsetHeight - window.innerHeight;
    var p = Math.min(Math.max(-box.top / travel, 0), 1);

    // Stop with the last storey right at the camera — overshooting it would
    // leave the screen empty at the bottom of the lobby.
    var cam = p * (storeys.length - 0.4) * GAP;
    scene.style.transform = "translateZ(" + cam.toFixed(1) + "px)";

    var live = -1;
    storeys.forEach(function (el, i) {
      var z = cam - (i + 1) * GAP; // 0 means it is right at the camera
      // Fade in as it approaches; drop it fast once it slips behind, otherwise
      // a passed storey stretches across the screen.
      var o = z > 0 ? Math.max(0, 1 - z / (GAP * 0.42)) : Math.max(0, 1 + z / (GAP * 2.6));
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o < 0.02 ? "hidden" : "visible";
      // Highlight a storey while it is still comfortably ahead, not as it
      // sweeps past the camera and overflows the screen.
      var isLive = z > -GAP * 0.95 && z < -GAP * 0.1;
      el.classList.toggle("live", isLive);
      if (isLive) live = i;
    });

    if (hud) {
      hud.classList.toggle("show", live >= 0 && box.bottom > window.innerHeight * 0.5);
      if (live !== liveIndex && live >= 0) {
        liveIndex = live;
        hudLvl.textContent = "قاعة " + (live + 1) + " / " + storeys.length;
        hudName.textContent = storeys[live].dataset.names;
        hudGo.href = storeys[live].dataset.link;
      }
    }
  }

  /* ================================================================== *
   * Walkthrough below the lobby: parallax, reveals, rail
   * ================================================================== */

  var zoneEls = [].slice.call(document.querySelectorAll(".zone"));
  var rail = document.getElementById("rail");

  if (rail && zoneEls.length) {
    zoneEls.forEach(function (z, i) {
      var name = z.querySelector("h3");
      var b = document.createElement("button");
      b.innerHTML = '<span class="dot"></span><span class="lbl"></span>';
      b.querySelector(".lbl").textContent = name ? name.textContent : "زون " + (i + 1);
      b.addEventListener("click", function () { z.scrollIntoView({ behavior: "smooth" }); });
      rail.appendChild(b);
    });
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  [].forEach.call(document.querySelectorAll(".rv"), function (el) { io.observe(el); });

  var ticking = false;
  function frame() {
    ticking = false;
    drive();

    var vh = window.innerHeight;
    zoneEls.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = (vh - r.top) / (vh + r.height);
      var pic = sec.querySelector(".pic");
      if (pic) {
        pic.style.transform =
          "translateY(" + ((p - 0.5) * 9).toFixed(2) + "%) scale(" + (1.06 - p * 0.05).toFixed(3) + ")";
      }
    });

    if (rail) {
      var active = -1;
      zoneEls.forEach(function (sec, i) {
        var r = sec.getBoundingClientRect();
        if (r.top < vh * 0.5 && r.bottom > vh * 0.5) active = i;
      });
      rail.classList.toggle("show", active >= 0);
      [].forEach.call(rail.children, function (b, i) { b.classList.toggle("on", i === active); });
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener("resize", frame);
  frame();

  document.addEventListener("click", function (e) {
    var nav = e.target.closest && e.target.closest("[data-nav]");
    if (nav) {
      var el = document.getElementById(nav.dataset.nav);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ================================================================== *
   * 3. Client search, ranked by distance when the visitor allows it
   * ================================================================== */

  var results = document.getElementById("results");
  if (results) {
    var clientEl = document.getElementById("client");
    var craft = clientEl ? clientEl.dataset.preset || "" : "";
    var q = "";
    var city = "";
    var here = null; // { lat, lng }
    var radius = 0;
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
      ZONES.forEach(function (z) { make(z.id, z.n); });
    }

    function stars(r) {
      var n = Math.round(r);
      return "★".repeat(n) + "☆".repeat(5 - n);
    }

    function card(p) {
      var wa = p.wa || (p.t ? "212" + p.t.replace(/^0/, "") : "");
      var dist = "";
      if (typeof p.km === "number") {
        dist = '<div class="dist' + (p.km > 25 ? " far" : "") + '">📍 على بعد ' +
          (p.km < 1 ? Math.round(p.km * 1000) + " متر" : p.km.toFixed(1) + " كلم") + " منك</div>";
      }
      return (
        '<article class="card"><div class="pro">' +
        '<div class="av"' + (p.img ? " style=\"background-image:url('" + p.img + "')\"" : "") + "></div>" +
        '<div style="flex:1;min-width:0">' +
        '<div class="nm"><a href="' + p.link + '">' + p.n + "</a>" +
        (p.v ? ' <span class="vf" title="موثّق">✓</span>' : "") + "</div>" +
        '<div class="cr">' + p.cn + (p.city ? " · " + p.city : "") + "</div>" +
        '<div class="stars">' + stars(p.r) + " <small>" + (p.r || "—") + " (" + p.k + " تقييم)</small></div>" +
        dist +
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
      var payload = { q: q, craft: craft, city: city };
      if (here) {
        payload.lat = here.lat;
        payload.lng = here.lng;
        payload.radius = radius;
      }
      post("m3_search", payload)
        .then(function (res) {
          if (mine !== reqId) return; // a newer request already answered
          var list = (res && res.data) || [];
          if (!list.length) {
            results.innerHTML =
              '<div class="card" style="grid-column:1/-1;text-align:center;padding:44px">' +
              '<div style="font-size:34px">🔍</div>' +
              '<p style="margin-top:12px;opacity:.72">ماكاين حتى معلّم بهاد المواصفات' +
              (here && radius ? " فهاد المسافة" : "") +
              ". جرّب توسّع البحث.</p></div>";
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
      cityEl.addEventListener("change", function (e) { city = e.target.value; render(); });
    }

    // --- geolocation ---
    var geoBox = document.getElementById("geo");
    var geoBtn = document.getElementById("geoBtn");
    var geoTxt = document.getElementById("geoTxt");
    var radiusEl = document.getElementById("radius");

    function locate() {
      if (!navigator.geolocation) {
        toast("النافيغاتور ديالك ماكيدعمش تحديد الموقع.");
        return;
      }
      geoBtn.disabled = true;
      geoBtn.textContent = "كنقلّب عليك…";
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          radius = radiusEl ? Number(radiusEl.value) : 0;
          geoBox.classList.add("on");
          geoTxt.innerHTML = "<b>الموقع ديالك تفعّل ✓</b><span>المعلّمية مرتّبين من الأقرب ليك</span>";
          geoBtn.textContent = "بدّل الموقع";
          geoBtn.disabled = false;
          if (radiusEl) radiusEl.hidden = false;
          render();
        },
        function (err) {
          geoBtn.disabled = false;
          geoBtn.textContent = "فعّل الموقع";
          toast(
            err.code === 1
              ? "رفضتي الإذن. فعّلو من إعدادات النافيغاتور."
              : "ماقدرناش نلقاو الموقع ديالك. جرّب من بعد."
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }

    if (geoBtn) geoBtn.addEventListener("click", locate);
    if (radiusEl) {
      radiusEl.addEventListener("change", function () {
        radius = Number(radiusEl.value);
        render();
      });
    }

    buildFilters();
    render();
  }

  /* ================================================================== *
   * Join form: stamp the artisan's coordinates so distance search works
   * ================================================================== */

  var joinGeoBtn = document.getElementById("joinGeoBtn");
  if (joinGeoBtn) {
    joinGeoBtn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        toast("النافيغاتور ديالك ماكيدعمش تحديد الموقع.");
        return;
      }
      joinGeoBtn.disabled = true;
      joinGeoBtn.textContent = "كنحدّد…";
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          document.getElementById("j-lat").value = pos.coords.latitude;
          document.getElementById("j-lng").value = pos.coords.longitude;
          document.getElementById("joinGeo").classList.add("on");
          document.getElementById("joinGeoTxt").innerHTML =
            "<b>البلاصة تحدّدات ✓</b><span>غادي تبان للكليان لي قريبين منك</span>";
          joinGeoBtn.textContent = "بدّل";
          joinGeoBtn.disabled = false;
        },
        function () {
          joinGeoBtn.disabled = false;
          joinGeoBtn.textContent = "حدّد الموقع";
          toast("ماقدرناش نحدّدو البلاصة. تقدر تصيفط الطلب بلاها.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  /* ================================================================== *
   * Urgent problem
   * ================================================================== */

  var urgBtn = document.getElementById("urgBtn");
  if (urgBtn) {
    urgBtn.addEventListener("click", function () {
      var body = document.getElementById("urgTxt");
      var tel = document.getElementById("urgTel");
      var cityEl2 = document.getElementById("city");
      if (!body.value.trim()) {
        toast("كتب المشكل ديالك الأول");
        return;
      }
      urgBtn.disabled = true;
      post("m3_urgent", {
        body: body.value.trim(),
        tel: tel ? tel.value.trim() : "",
        city: cityEl2 ? cityEl2.value : "",
      })
        .then(function (res) {
          if (res && res.success) {
            body.value = "";
            toast(res.data.msg);
          } else {
            toast((res && res.data && res.data.msg) || "وقع شي مشكل.");
          }
        })
        .catch(function () { toast("ماوصلش. شوف الكونيكسيون ديالك."); })
        .then(function () { urgBtn.disabled = false; });
    });
  }
})();

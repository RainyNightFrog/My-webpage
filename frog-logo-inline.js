/**
 * 青蛙 logo：使用內嵌 data URI 的 <img>（不依賴外部檔、file:// / GitHub Pages 皆可用）
 */
(function (global) {
  var SRC =
    global.RNF_FROG_LOGO_SRC ||
    (function () {
      var s =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
        '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#ff6b9d"/><stop offset="50%" stop-color="#c084fc"/>' +
        '<stop offset="100%" stop-color="#38bdf8"/></linearGradient>' +
        '<linearGradient id="frog" x1="30%" y1="0%" x2="70%" y2="100%">' +
        '<stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#22c55e"/></linearGradient>' +
        '<linearGradient id="belly" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#fde68a"/></linearGradient></defs>' +
        '<rect width="64" height="64" rx="16" fill="url(#bg)"/>' +
        '<ellipse cx="20" cy="14" rx="9" ry="5" fill="rgba(255,255,255,0.35)"/>' +
        '<ellipse cx="28" cy="12" rx="7" ry="4" fill="rgba(255,255,255,0.28)"/>' +
        '<path d="M16 18v4M22 19v5M28 18v4" stroke="#a5f3fc" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>' +
        '<path d="M48 11l1.2 2.4 2.6.4-1.9 1.8.5 2.5-2.4-1.2-2.4 1.2.5-2.5-1.9-1.8 2.6-.4z" fill="#fde68a" opacity="0.95"/>' +
        '<ellipse cx="32" cy="40" rx="20" ry="17" fill="url(#frog)" stroke="#14532d" stroke-width="2"/>' +
        '<ellipse cx="32" cy="44" rx="14" ry="10" fill="url(#belly)" opacity="0.95"/>' +
        '<ellipse cx="24" cy="30" rx="8" ry="9" fill="#fff" stroke="#14532d" stroke-width="1.5"/>' +
        '<ellipse cx="40" cy="30" rx="8" ry="9" fill="#fff" stroke="#14532d" stroke-width="1.5"/>' +
        '<circle cx="25" cy="31" r="4" fill="#1e293b"/><circle cx="41" cy="31" r="4" fill="#1e293b"/>' +
        '<circle cx="26.5" cy="29" r="1.4" fill="#fff"/><circle cx="42.5" cy="29" r="1.4" fill="#fff"/>' +
        '<ellipse cx="18" cy="38" rx="3.5" ry="2" fill="#f9a8d4" opacity="0.75"/>' +
        '<ellipse cx="46" cy="38" rx="3.5" ry="2" fill="#f9a8d4" opacity="0.75"/>' +
        '<path d="M26 42 Q32 47 38 42" fill="none" stroke="#14532d" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M32 18 Q28 12 32 8 Q36 12 32 18" fill="#4ade80" stroke="#166534" stroke-width="1.2"/>' +
        "</svg>";
      return "data:image/svg+xml," + encodeURIComponent(s);
    })();

  function mountFrogLogos() {
    document.querySelectorAll("[data-frog-logo]").forEach(function (el) {
      if (el.querySelector("img, svg")) return;
      var img = document.createElement("img");
      img.src = SRC;
      img.alt = "";
      img.decoding = "async";
      img.setAttribute("width", "64");
      img.setAttribute("height", "64");
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.display = "block";
      img.style.objectFit = "cover";
      el.appendChild(img);
    });
  }

  function scheduleMount() {
    if (scheduleMount._pending) return;
    scheduleMount._pending = true;
    var run = function () {
      scheduleMount._pending = false;
      mountFrogLogos();
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(run);
    } else {
      setTimeout(run, 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFrogLogos);
  } else {
    mountFrogLogos();
  }

  if (typeof MutationObserver !== "undefined" && document.documentElement) {
    new MutationObserver(scheduleMount).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  global.RNFFrogLogo = { mount: mountFrogLogos, src: SRC };
})(window);

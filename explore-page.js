/**
 * 探索工具箱頁 — 語言世界介紹
 */
(function (global) {
  function bindLangCards() {
    document.querySelectorAll(".lc-explore-world[data-learn]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        var code = card.getAttribute("data-learn");
        if (!code || !global.LCApp || !LCApp.setLearnTarget) return;
        e.preventDefault();
        LCApp.setLearnTarget(code);
        try {
          sessionStorage.setItem("rnf_setup_flow", "course");
        } catch (err) {}
        if (code === "zh") {
          location.href = "languages.html";
          return;
        }
        location.href = "setup.html";
      });
    });
  }

  function initParade() {
    var parade = document.querySelector(".lc-explore-join-parade");
    if (!parade) return;
    var items = parade.querySelectorAll("span");
    items.forEach(function (sp, i) {
      sp.style.animationDelay = i * 0.35 + "s";
    });
  }

  function init() {
    if (global.AppI18n) AppI18n.applyPage("explore");
    if (global.LCApp && LCApp.initLangPopover) {
      LCApp.initLangPopover("exploreLangMount");
    }
    if (global.RNFFrogLogo) RNFFrogLogo.mount(document.body);
    bindLangCards();
    initParade();
  }

  document.addEventListener("lc:langchange", function () {
    if (global.AppI18n) AppI18n.applyPage("explore");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);

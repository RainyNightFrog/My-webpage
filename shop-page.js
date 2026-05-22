/**
 * Gem shop — Rainy Night Frog
 */
(function (global) {
  var MAX_HEARTS = 5;
  var REFILL_COST = 350;

  var COURSE_KEYS = {
    en: "flow.courseEn",
    es: "flow.courseEs",
    fr: "flow.courseFr",
    ja: "flow.courseJa",
    zh: "flow.courseZh",
    de: "flow.courseDe",
    ko: "flow.courseKo",
    it: "flow.courseIt",
    pt: "flow.coursePt",
  };

  var LANG_FLAGS = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    ja: "🇯🇵",
    zh: "🇨🇳",
    de: "🇩🇪",
    ko: "🇰🇷",
    it: "🇮🇹",
    pt: "🇧🇷",
  };

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function getUnitsRemaining() {
    if (!global.LCApp) return 9;
    var done = LCApp.getUnitsCompleted ? LCApp.getUnitsCompleted() : 0;
    var need = global.RNFLeaderboard ? RNFLeaderboard.UNLOCK_UNITS : 10;
    return Math.max(0, need - done);
  }

  function renderStats(stats) {
    var bar =
      global.LCApp && LCApp.renderLearnStatsBar
        ? LCApp.renderLearnStatsBar(stats)
        : '<div class="lc-learn-stats"></div>';
    return bar.replace(
      'class="lc-learn-stats"',
      'class="lc-learn-stats lc-shop-top-stats"'
    );
  }

  function renderShopHero(stats) {
    return (
      '<header class="lc-shop-hero">' +
      '<div class="lc-shop-hero-glow" aria-hidden="true"></div>' +
      '<div class="lc-shop-hero-copy">' +
      "<h1>" +
      t("flow.shopHeroTitle") +
      "</h1>" +
      "<p>" +
      t("flow.shopHeroDesc") +
      "</p>" +
      '<p class="lc-shop-hero-balance">' +
      t("flow.shopBalance", { n: stats.gems }) +
      " 💎</p></div>" +
      '<div class="lc-shop-hero-mascot" aria-hidden="true">' +
      '<span>🐸</span><span>💎</span><span>🛍️</span>' +
      "</div></header>"
    );
  }

  function renderShopCard(item, stats, inv) {
    var owned = inv[item.id] || 0;
    var heartsFull = stats.hearts >= MAX_HEARTS;
    var disabled = false;
    var btnText = t(item.btnKey, { n: item.cost });
    var statusHtml = "";

    if (item.id === "heart") {
      if (heartsFull) {
        disabled = true;
        btnText = t("flow.shopHeartsFull");
        statusHtml =
          '<span class="lc-shop-card-status">' +
          t("flow.shopHeartCount", { n: stats.hearts, max: MAX_HEARTS }) +
          "</span>";
      } else {
        statusHtml =
          '<span class="lc-shop-card-status">' +
          t("flow.shopHeartCount", { n: stats.hearts, max: MAX_HEARTS }) +
          "</span>";
      }
      disabled = heartsFull || stats.gems < item.cost;
    } else {
      if (owned > 0) {
        statusHtml =
          '<span class="lc-shop-card-owned">' +
          t("flow.shopOwned", { n: owned }) +
          "</span>";
      }
      disabled = stats.gems < item.cost;
    }

    return (
      '<article class="lc-shop-card lc-shop-card--' +
      item.color +
      '">' +
      '<span class="lc-shop-card-icon" aria-hidden="true">' +
      item.icon +
      "</span>" +
      '<h3 class="lc-shop-card-title">' +
      t(item.titleKey) +
      "</h3>" +
      '<p class="lc-shop-card-desc">' +
      t(item.descKey) +
      "</p>" +
      statusHtml +
      '<p class="lc-shop-card-price">' +
      item.cost +
      " 💎</p>" +
      '<button type="button" class="lc-shop-card-btn' +
      (disabled ? " disabled" : "") +
      '" data-buy="' +
      item.id +
      '"' +
      (disabled ? " disabled" : "") +
      ">" +
      btnText +
      "</button></article>"
    );
  }

  function renderUseCards(inv) {
    var html = "";
    if (inv.mission > 0) {
      html +=
        '<button type="button" class="lc-shop-use-btn" data-use="mission">' +
        t("flow.shopUseMission", { n: inv.mission }) +
        "</button>";
    }
    if (inv.challenge > 0) {
      html +=
        '<button type="button" class="lc-shop-use-btn" data-use="challenge">' +
        t("flow.shopUseChallenge", { n: inv.challenge }) +
        "</button>";
    }
    if (!html) return "";
    return (
      '<section class="lc-shop-section lc-shop-section--owned">' +
      "<h2>" +
      t("flow.shopOwnedTitle") +
      "</h2>" +
      '<div class="lc-shop-use-row">' +
      html +
      "</div></section>"
    );
  }

  function renderMain(stats) {
    var inv = global.RNFShopInventory
      ? RNFShopInventory.loadInventory()
      : { revive: 0, challenge: 0, mission: 0 };
    var items = global.RNFShopInventory ? RNFShopInventory.ITEMS : {};
    var cards = "";
    ["heart", "revive", "challenge", "mission"].forEach(function (id) {
      if (items[id]) cards += renderShopCard(items[id], stats, inv);
    });

    var heartsFull = stats.hearts >= MAX_HEARTS;
    var canRefill = !heartsFull && stats.gems >= REFILL_COST;

    return (
      renderShopHero(stats) +
      '<section class="lc-shop-section">' +
      "<h2>" +
      t("flow.shopItemsTitle") +
      "</h2>" +
      '<div class="lc-shop-grid">' +
      cards +
      "</div></section>" +
      renderUseCards(inv) +
      '<section class="lc-shop-section lc-shop-section--plus">' +
      "<h2>" +
      t("flow.shopHeartsTitle") +
      "</h2>" +
      '<article class="lc-shop-row lc-shop-row--wide">' +
      '<span class="lc-shop-row-icon" aria-hidden="true">♾️</span>' +
      '<div class="lc-shop-row-body">' +
      "<h3>" +
      t("flow.shopUnlimitedTitle") +
      "</h3>" +
      "<p>" +
      t("flow.shopUnlimitedDesc") +
      "</p></div>" +
      '<a href="super.html" class="lc-shop-btn accent">' +
      t("flow.shopFreeTrial") +
      "</a></article>" +
      '<article class="lc-shop-row lc-shop-row--wide">' +
      '<span class="lc-shop-row-icon" aria-hidden="true">❤️‍🔥</span>' +
      '<div class="lc-shop-row-body">' +
      "<h3>" +
      t("flow.shopRefillTitle") +
      "</h3>" +
      "<p>" +
      t("flow.shopRefillDesc") +
      "</p></div>" +
      '<button type="button" class="lc-shop-btn' +
      (canRefill ? "" : " disabled") +
      '" data-action="refill"' +
      (canRefill ? "" : " disabled") +
      ">" +
      (heartsFull
        ? t("flow.shopHeartsFull")
        : t("flow.shopRefillBtn", { n: REFILL_COST })) +
      "</button></article></section>"
    );
  }

  function renderSidebar(stats) {
    var dailyPct = stats.dailyGoal
      ? Math.min(100, Math.round((stats.dailyXp / stats.dailyGoal) * 100))
      : 0;
    var dailyCur = Math.min(stats.dailyXp, stats.dailyGoal);
    var dailyDone = dailyCur >= stats.dailyGoal;
    var boardLeft = getUnitsRemaining();

    return (
      renderStats(stats) +
      '<div class="lc-panel-card lc-shop-board-card">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnBoardTitle") +
      "</h3>" +
      '<div class="lc-shop-board-row">' +
      '<span class="lc-shop-board-shield" aria-hidden="true">🛡️</span>' +
      '<p class="lc-panel-text">' +
      t("flow.learnBoardDesc", { n: boardLeft }) +
      "</p></div></div>" +
      '<div class="lc-panel-card lc-panel-daily">' +
      '<div class="lc-panel-head-row">' +
      "<h3 class=\"lc-panel-title\">" +
      t("flow.learnDailyTitle") +
      "</h3>" +
      '<a href="quests.html" class="lc-panel-link">' +
      t("flow.learnShowAll") +
      "</a></div>" +
      '<p class="lc-panel-quest-lbl">' +
      t("flow.dailyXpTask", { n: stats.dailyGoal }) +
      "</p>" +
      '<div class="lc-panel-quest-bar' +
      (dailyDone ? " done" : "") +
      '">' +
      '<div class="lc-panel-quest-fill" style="width:' +
      dailyPct +
      '%"></div>' +
      '<span class="lc-panel-quest-num">' +
      dailyCur +
      " / " +
      stats.dailyGoal +
      "</span>" +
      (dailyDone
        ? '<span class="lc-panel-quest-chest" aria-hidden="true">🎁</span>'
        : "") +
      "</div></div>" +
      '<div class="lc-shop-ad-slot">' +
      '<a href="super.html" class="lc-shop-remove-ads">' +
      t("flow.shopRemoveAds") +
      "</a></div>"
    );
  }

  function showToast(msg) {
    var el = document.getElementById("shopToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "shopToast";
      el.className = "lc-shop-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 2200);
  }

  function bindActions(stats) {
    document.querySelectorAll(".lc-shop-card-btn[data-buy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled || !global.RNFShopInventory) return;
        var id = btn.getAttribute("data-buy");
        var res = RNFShopInventory.purchase(id);
        if (res.ok) {
          showToast(t("flow.shopBuySuccess"));
          init();
        } else if (res.reason === "gems") {
          showToast(t("flow.shopNotEnoughGems"));
        } else if (res.reason === "full") {
          showToast(t("flow.shopHeartsFull"));
        }
      });
    });

    document.querySelectorAll(".lc-shop-use-btn[data-use]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var use = btn.getAttribute("data-use");
        if (use === "mission" && RNFShopInventory.consumeMission()) {
          RNFShopInventory.addMissionXp(5);
          showToast(t("flow.shopMissionUsed"));
          init();
        }
        if (use === "challenge") {
          showToast(t("flow.shopChallengeHint"));
        }
      });
    });

    document.querySelectorAll(".lc-shop-btn[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-action");
        if (!action || btn.disabled) return;
        if (action === "refill" && global.LCApp && LCApp.refillHeartsFromGems) {
          if (LCApp.refillHeartsFromGems()) {
            showToast(t("flow.shopBuySuccess"));
            init();
          }
        }
      });
    });
  }

  function init() {
    var stats = global.LCApp
      ? LCApp.getLearnStats()
      : {
          streak: 1,
          gems: 505,
          hearts: 5,
          dailyXp: 10,
          dailyGoal: 10,
          target: "en",
        };

    var main = document.getElementById("shopMain");
    var side = document.getElementById("shopSide");
    if (main) main.innerHTML = renderMain(stats);
    if (side) side.innerHTML = renderSidebar(stats);

    if (global.RNFFrogLogo) RNFFrogLogo.mount();
    bindActions(stats);
    if (global.LCApp && LCApp.initCoursePicker) LCApp.initCoursePicker();
    if (global.LCApp && LCApp.initStreakPicker) LCApp.initStreakPicker();
    if (global.LCApp && LCApp.initGemsPicker) LCApp.initGemsPicker();
    if (global.LCApp && LCApp.initHeartsPicker) LCApp.initHeartsPicker();

    var langLbl = document.querySelector("[data-learn-lang-label]");
    if (langLbl) {
      langLbl.textContent =
        (LANG_FLAGS[stats.target] || "") +
        " " +
        t(
          stats.target === "zh"
            ? "flow.courseZh"
            : COURSE_KEYS[stats.target] || "flow.courseEn"
        );
    }
  }

  global.RNFShop = { init: init, REFILL_COST: REFILL_COST };
})(typeof window !== "undefined" ? window : this);

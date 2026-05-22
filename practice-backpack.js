/**
 * In-lesson backpack — use shop items while answering questions
 */
(function (global) {
  var invApi = function () {
    return global.RNFShopInventory;
  };

  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function buffKey() {
    try {
      return "rnf_lesson_buffs_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_lesson_buffs_en";
    }
  }

  function loadBuffs() {
    try {
      var raw = sessionStorage.getItem(buffKey());
      return raw
        ? JSON.parse(raw)
        : {
            shield: false,
            streakSave: false,
            xpBoost: false,
            gemCharm: false,
            starBoost: false,
          };
    } catch (e) {
      return {
        shield: false,
        streakSave: false,
        xpBoost: false,
        gemCharm: false,
        starBoost: false,
      };
    }
  }

  function saveBuffs(b) {
    try {
      sessionStorage.setItem(buffKey(), JSON.stringify(b));
    } catch (e) {}
  }

  function clearBuffs() {
    saveBuffs({
      shield: false,
      streakSave: false,
      xpBoost: false,
      gemCharm: false,
      starBoost: false,
    });
  }

  function toast(msg) {
    var el = document.getElementById("lessonBackpackToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "lessonBackpackToast";
      el.className = "lc-backpack-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2400);
  }

  function lessonItems() {
    var api = invApi();
    if (!api || !api.ITEMS) return [];
    var inv = api.loadInventory();
    var out = [];
    Object.keys(api.ITEMS).forEach(function (id) {
      var item = api.ITEMS[id];
      if (!item.useInLesson) return;
      var n = inv[id] || 0;
      if (n > 0) out.push({ item: item, count: n });
    });
    return out;
  }

  function consume(id) {
    var api = invApi();
    if (!api || !api.consumeItem) return false;
    return api.consumeItem(id);
  }

  function applyFocus(engine) {
    var q = engine.current();
    if (!q || engine.state.checked) return false;
    var root = engine.root;
    if (!root) return false;
    var opts = root.querySelectorAll(
      "[data-choice]:not([data-correct]), .lc-opt-btn-chip:not([data-correct])"
    );
    if (opts.length < 3) {
      toast(t("flow.backpackFocusNo"));
      return false;
    }
    var wrong = [];
    opts.forEach(function (el) {
      wrong.push(el);
    });
    for (var i = wrong.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = wrong[i];
      wrong[i] = wrong[j];
      wrong[j] = tmp;
    }
    var hideCount = Math.min(2, wrong.length - 1);
    for (var k = 0; k < hideCount; k++) {
      wrong[k].classList.add("lc-backpack-dimmed");
      wrong[k].setAttribute("aria-hidden", "true");
      wrong[k].style.pointerEvents = "none";
    }
    toast(t("flow.backpackFocusOn"));
    return true;
  }

  function useItem(id, engine) {
    var api = invApi();
    if (!api) return;
    var item = api.ITEMS[id];
    if (!item || !item.useInLesson) return;

    if (engine.state.checked) {
      toast(t("flow.backpackWaitNext"));
      return;
    }

    if (id === "heart") {
      if (api.getHearts() >= api.MAX_HEARTS) {
        toast(t("flow.shopHeartsFull"));
        return;
      }
      var invH = api.loadInventory();
      if (!(invH.heart > 0)) {
        toast(t("flow.backpackNoHeart"));
        return;
      }
      if (!consume("heart")) return;
      api.setHearts(api.getHearts() + 1);
      engine.state.lives = Math.min(api.MAX_HEARTS, engine.state.lives + 1);
      if (global.LCApp && LCApp.updateScoreDisplay) {
        LCApp.updateScoreDisplay({
          correct: engine.state.correct,
          total: engine.state.queue.length,
          lives: engine.state.lives,
        });
      }
      toast(t("flow.backpackHeartUsed"));
      renderPanel(engine);
      return;
    }

    if (id === "hint") {
      var q = engine.current();
      var text =
        q && q.explanation
          ? q.explanation
          : q && q.prompt
            ? q.prompt
            : "";
      if (!text) {
        toast(t("flow.backpackHintEmpty"));
        return;
      }
      if (!consume("hint")) return;
      toast(t("flow.backpackHintShow") + ": " + text.slice(0, 120));
      renderPanel(engine);
      return;
    }

    if (id === "focus") {
      if (!consume("focus")) return;
      if (!applyFocus(engine)) {
        var inv = api.loadInventory();
        inv.focus = (inv.focus || 0) + 1;
        api.saveInventory && api.saveInventory(inv);
      } else {
        renderPanel(engine);
      }
      return;
    }

    var buff = loadBuffs();
    if (id === "shield") {
      if (buff.shield) {
        toast(t("flow.backpackAlreadyArmed"));
        return;
      }
      if (!consume("shield")) return;
      buff.shield = true;
      saveBuffs(buff);
      toast(t("flow.backpackShieldOn"));
      renderPanel(engine);
      return;
    }
    if (id === "streakSave") {
      if (buff.streakSave) {
        toast(t("flow.backpackAlreadyArmed"));
        return;
      }
      if (!consume("streakSave")) return;
      buff.streakSave = true;
      saveBuffs(buff);
      toast(t("flow.backpackStreakOn"));
      renderPanel(engine);
      return;
    }
    if (id === "xpBoost") {
      if (buff.xpBoost) {
        toast(t("flow.backpackAlreadyArmed"));
        return;
      }
      if (!consume("xpBoost")) return;
      buff.xpBoost = true;
      saveBuffs(buff);
      toast(t("flow.backpackXpOn"));
      renderPanel(engine);
      return;
    }
    if (id === "gemCharm") {
      if (buff.gemCharm) {
        toast(t("flow.backpackAlreadyArmed"));
        return;
      }
      if (!consume("gemCharm")) return;
      buff.gemCharm = true;
      saveBuffs(buff);
      toast(t("flow.backpackGemOn"));
      renderPanel(engine);
      return;
    }
    if (id === "starBoost") {
      if (buff.starBoost) {
        toast(t("flow.backpackAlreadyArmed"));
        return;
      }
      if (!consume("starBoost")) return;
      buff.starBoost = true;
      saveBuffs(buff);
      toast(t("flow.backpackStarOn"));
      renderPanel(engine);
      return;
    }
  }

  function renderPanel(engine) {
    var panel = document.getElementById("lessonBackpackPanel");
    if (!panel) return;
    var list = lessonItems();
    var buff = loadBuffs();
    var buffTags = "";
    if (buff.shield) buffTags += '<span class="lc-backpack-buff">🛡️</span>';
    if (buff.streakSave) buffTags += '<span class="lc-backpack-buff">🔥</span>';
    if (buff.xpBoost) buffTags += '<span class="lc-backpack-buff">⚡</span>';
    if (buff.gemCharm) buffTags += '<span class="lc-backpack-buff">💎</span>';
    if (buff.starBoost) buffTags += '<span class="lc-backpack-buff">⭐</span>';

    if (!list.length) {
      panel.innerHTML =
        '<p class="lc-backpack-empty">' + t("flow.backpackEmpty") + "</p>";
      return;
    }

    var html =
      '<div class="lc-backpack-head">' +
      "<h3>" +
      t("flow.backpackTitle") +
      "</h3>" +
      (buffTags ? '<div class="lc-backpack-buffs">' + buffTags + "</div>" : "") +
      '<button type="button" class="lc-backpack-close" id="btnBackpackClose" aria-label="×">×</button></div>' +
      '<p class="lc-backpack-sub">' +
      t("flow.backpackSub") +
      "</p>" +
      '<div class="lc-backpack-list">';

    list.forEach(function (row) {
      var it = row.item;
      var n = row.count;
      if (it.id === "heart") {
        var api = invApi();
        n = n || (api ? 1 : 0);
      }
      html +=
        '<button type="button" class="lc-backpack-item lc-backpack-item--' +
        it.color +
        '" data-backpack-use="' +
        it.id +
        '">' +
        '<span class="lc-backpack-item-icon" aria-hidden="true">' +
        it.icon +
        "</span>" +
        '<span class="lc-backpack-item-body">' +
        "<strong>" +
        t(it.titleKey) +
        "</strong>" +
        "<span>" +
        t(it.descKey) +
        "</span></span>" +
        '<span class="lc-backpack-item-qty">×' +
        (it.id === "heart" ? n : row.count) +
        "</span></button>";
    });

    html += "</div>";
    panel.innerHTML = html;

    panel.querySelectorAll("[data-backpack-use]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        useItem(btn.getAttribute("data-backpack-use"), engine);
      });
    });
    var close = document.getElementById("btnBackpackClose");
    if (close) close.onclick = function () {
      togglePanel(false);
    };
  }

  function togglePanel(open) {
    var panel = document.getElementById("lessonBackpackPanel");
    var btn = document.getElementById("btnLessonBackpack");
    if (!panel) return;
    var show = open === undefined ? panel.hidden : open;
    panel.hidden = !show;
    if (btn) btn.setAttribute("aria-expanded", show ? "true" : "false");
  }

  function init(engine) {
    if (!invApi() || !engine) return;
    try {
      clearBuffs();

      var bar = document.querySelector(".lc-footer-bar");
      if (!bar || bar.querySelector(".lc-btn-backpack")) return;

      var wrap = document.createElement("div");
      wrap.className = "lc-backpack-wrap";
      wrap.innerHTML =
        '<button type="button" class="lc-btn-backpack" id="btnLessonBackpack" aria-expanded="false" aria-controls="lessonBackpackPanel">' +
        "🎒 " +
        t("flow.backpackBtn") +
        "</button>" +
        '<div class="lc-backpack-panel" id="lessonBackpackPanel" hidden role="dialog" aria-label="' +
        t("flow.backpackTitle") +
        '"></div>';
      bar.insertBefore(wrap, bar.firstChild);
      bar.dataset.defaultHtml = bar.innerHTML;
      if (engine._footerBar) engine._footerBar.dataset.defaultHtml = bar.dataset.defaultHtml;

      var btn = wrap.querySelector("#btnLessonBackpack");
      var panel = wrap.querySelector("#lessonBackpackPanel");
      if (!btn || !panel) return;

      btn.addEventListener("click", function () {
        var open = panel.hidden;
        if (open) renderPanel(engine);
        togglePanel(open);
      });

      if (!init._docClickBound) {
        init._docClickBound = true;
        document.addEventListener("click", function (e) {
          var p = document.getElementById("lessonBackpackPanel");
          if (!p || p.hidden) return;
          if (
            e.target.closest("#lessonBackpackPanel") ||
            e.target.closest("#btnLessonBackpack")
          )
            return;
          togglePanel(false);
        });
      }

      renderPanel(engine);
    } catch (err) {
      if (global.console && console.warn) {
        console.warn("[RNFPracticeBackpack] init skipped:", err);
      }
    }
  }

  function beforeHeartLoss(engine) {
    var buff = loadBuffs();
    var blockHeart = false;
    var saveStreak = false;

    if (buff.streakSave) {
      buff.streakSave = false;
      saveBuffs(buff);
      saveStreak = true;
      toast(t("flow.backpackStreakUsed"));
    }

    if (buff.shield) {
      buff.shield = false;
      saveBuffs(buff);
      blockHeart = true;
      toast(t("flow.backpackShieldUsed"));
    }

    return { blockHeart: blockHeart, saveStreak: saveStreak };
  }

  function onCorrect(engine) {
    var buff = loadBuffs();
    var bonusXp = 0;
    var bonusGems = 0;
    var mult = 1;

    if (buff.xpBoost) {
      buff.xpBoost = false;
      bonusXp += 20;
      toast(t("flow.backpackXpBonus"));
    }
    if (buff.gemCharm) {
      buff.gemCharm = false;
      bonusGems += 2;
      toast(t("flow.backpackGemBonus"));
    }
    if (buff.starBoost) {
      buff.starBoost = false;
      mult = 2;
      toast(t("flow.backpackStarBonus"));
    }
    saveBuffs(buff);

    if (bonusXp) engine.state.xp += bonusXp * mult;
    if (bonusGems && invApi()) {
      invApi().setGems(invApi().getGems() + bonusGems * mult);
    }
  }

  function onAdvance(engine) {
    var root = engine.root;
    if (root) {
      root.querySelectorAll(".lc-backpack-dimmed").forEach(function (el) {
        el.classList.remove("lc-backpack-dimmed");
        el.removeAttribute("aria-hidden");
        el.style.pointerEvents = "";
      });
    }
    togglePanel(false);
  }

  function ensureFooter(engine) {
    var bar = document.querySelector(".lc-footer-bar");
    if (!bar || bar.querySelector(".lc-btn-backpack")) return;
    init(engine);
  }

  global.RNFPracticeBackpack = {
    init: init,
    ensureFooter: ensureFooter,
    useItem: useItem,
    beforeHeartLoss: beforeHeartLoss,
    onCorrect: onCorrect,
    onAdvance: onAdvance,
    lessonItems: lessonItems,
    clearBuffs: clearBuffs,
  };
})(typeof window !== "undefined" ? window : this);

/**
 * 練習引擎：多元題型、洗牌輪換、錯題重溫、完成統計
 */
(function (global) {
  var MISTAKE_KEY = "rnf_mistakes";
  var SESSION_REPORT_KEY = "rnf_last_session";
  var SESSION_SIZE = 10;
  var XP_PER_CORRECT = 12;
  var XP_STREAK_BONUS = 5;
  var DAILY_XP_GOAL = 10;
  var DAILY_GEM_REWARD = 5;
  var MAX_HEARTS = 5;

  function t(key, vars) {
    return global.AppI18n ? AppI18n.t(key, vars) : key;
  }

  function pickCorrectPrompt() {
    var lang = global.AppI18n && AppI18n.getLang ? AppI18n.getLang() : "zhHant";
    var course = getLearnCourse();
    if (course === "zh") {
      if (lang === "zhHans") return t("flow.pickCorrectHans");
      return t("flow.pickCorrect");
    }
    var targetName = learnLangLabel();
    if (course === "en") {
      if (lang === "zhHans") return t("flow.pickCorrectEnHans");
      if (lang === "zhHant") return t("flow.pickCorrectEn");
      return t("flow.pickCorrectTarget", { language: targetName });
    }
    return t("flow.pickCorrectTarget", { language: targetName });
  }

  function uiIsZhHans() {
    return global.AppI18n && AppI18n.getLang && AppI18n.getLang() === "zhHans";
  }

  function correctAnswerLabelText() {
    return uiIsZhHans()
      ? t("flow.correctAnswerLabelHans")
      : t("flow.correctAnswerLabel");
  }

  function reportErrorLabelText() {
    return uiIsZhHans() ? t("flow.reportErrorHans") : t("flow.reportError");
  }

  function wrongEncourageText() {
    return uiIsZhHans() ? t("flow.wrongEncourageHans") : t("flow.wrongEncourage");
  }

  function pickEncourageLine(ok) {
    if (global.AppI18n && AppI18n.pickEncourageLine) {
      return AppI18n.pickEncourageLine(ok);
    }
    return ok ? t("flow.correctFbShort") : wrongEncourageText();
  }

  function matchEncourageMessage(correct, total) {
    if (global.AppI18n && AppI18n.matchEncourageMessage) {
      return AppI18n.matchEncourageMessage(correct, total);
    }
    return wrongEncourageText();
  }

  function lastChanceWarningText() {
    return uiIsZhHans() ? t("flow.lastChanceWarningHans") : t("flow.lastChanceWarning");
  }

  function jumpTestFailMsgText(part) {
    var n = part || 6;
    return uiIsZhHans()
      ? t("flow.jumpTestFailMsgHans", { n: n })
      : t("flow.jumpTestFailMsg", { n: n });
  }

  function getJumpTestPart() {
    try {
      var params = new URLSearchParams(location.search);
      var fromUrl = params.get("part");
      if (fromUrl) {
        var n = parseInt(fromUrl, 10);
        if (!isNaN(n) && n > 0) return n;
      }
      var stored = sessionStorage.getItem("rnf_jump_test_part");
      if (stored) {
        var s = parseInt(stored, 10);
        if (!isNaN(s) && s > 0) return s;
      }
    } catch (e) {}
    return 6;
  }

  function writeSentencePrompt() {
    return uiIsZhHans() ? t("flow.writeSentenceHans") : t("flow.writeSentence");
  }

  function promptTextForQuestion(q) {
    if (!q) return "";
    if (q.type === "translate_choice") return pickCorrectPrompt();
    if (isWriteSentenceQuestion(q)) return writeSentencePrompt();
    if (isTranslateChipQuestion(q)) return uiTf(q.prompt);
    if (q.type === "match_pairs" && q.prompt) return uiTf(q.prompt);
    if (q.type === "text_choice" && q.prompt) return uiTf(q.prompt);
    if (q.type === "true_false" && q.prompt) return uiTf(q.prompt);
    if (q.type === "word_bank" && q.prompt) return uiTf(q.prompt);
    if (q.type === "fill_pick" && q.prompt) return uiTf(q.prompt);
    if (q.type === "listen_pick" && q.prompt) return uiTf(q.prompt);
    return uiTf(q.prompt) || tf(q.prompt);
  }

  function isWriteSentenceQuestion(q) {
    return q && q.type === "word_bank" && q.variant === "write_sentence";
  }

  function isTranslateChipQuestion(q) {
    return q && q.type === "word_bank" && q.variant === "translate_chip";
  }

  function isListenPickQuestion(q) {
    return q && q.type === "listen_pick";
  }

  function isZhUiLang() {
    if (!global.AppI18n || !AppI18n.getLang) return false;
    var lang = AppI18n.getLang();
    return lang === "zhHans" || lang === "zhHant";
  }

  function correctPraiseText() {
    if (isZhUiLang()) {
      return uiIsZhHans() ? t("flow.correctPraiseOkHans") : t("flow.correctPraiseOk");
    }
    return t("flow.correctPraiseGreat");
  }

  function getTranslateCorrectPraise(q) {
    if (isZhUiLang()) {
      return uiIsZhHans() ? t("flow.correctPraiseOkHans") : t("flow.correctPraiseOk");
    }
    if (q && q.correctPraise === "short") return t("flow.correctFbShort");
    return t("flow.correctPraiseGreat");
  }

  function getWordBankAnswerText(q) {
    if (!q) return "";
    if (q.answerDisplay) return tf(q.answerDisplay);
    if (!q.answer || !q.words) return "";
    var byId = {};
    q.words.forEach(function (w) {
      byId[w.id] = w;
    });
    var parts = [];
    q.answer.forEach(function (id) {
      if (byId[id]) parts.push(tf(byId[id].text));
    });
    return parts.join("");
  }

  function lockWriteSentenceChips(root, ok) {
    if (!root) return;
    root.querySelectorAll(".lc-word-chip").forEach(function (chip) {
      chip.style.pointerEvents = "none";
      if (chip.classList.contains("lc-word-chip--placed")) {
        chip.classList.add(ok ? "correct-pick" : "wrong-pick");
      }
    });
  }

  function getCorrectOptionLabel(q) {
    if (!q) return "";
    if (q.chips) {
      for (var c = 0; c < q.chips.length; c++) {
        if (q.chips[c].correct) return tf(q.chips[c].text);
      }
    }
    if (!q.options) return "";
    for (var i = 0; i < q.options.length; i++) {
      if (q.options[i].correct) return tf(q.options[i].label);
    }
    return "";
  }

  function tf(obj) {
    return global.RNFQuestions ? RNFQuestions.tField(obj) : "";
  }

  function uiTf(obj) {
    return global.RNFQuestions && RNFQuestions.tUiField
      ? RNFQuestions.tUiField(obj)
      : tf(obj);
  }

  function matchTf(obj, side) {
    var course = getLearnCourse();
    return global.RNFQuestions && RNFQuestions.tMatchLabel
      ? RNFQuestions.tMatchLabel(obj, course, side)
      : tf(obj);
  }

  function mascotHtml(engine, q) {
    if (global.RNFMascot && RNFMascot.html) {
      if (!engine._mascotUsed) engine._mascotUsed = {};
      return RNFMascot.html(q, engine.state.index, engine._mascotUsed);
    }
    var emoji = (q && q.avatar) || "🐸";
    var cls =
      q && q.avatarClass ? " lc-mascot--" + q.avatarClass : " lc-mascot--frog";
    return (
      '<div class="lc-mascot lc-mascot--animal' +
      cls +
      '" aria-hidden="true">' +
      emoji +
      "</div>"
    );
  }

  function loadMistakes() {
    try {
      var raw = localStorage.getItem(MISTAKE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function mistakeKeyFor(q) {
    if (global.RNFQuestions && RNFQuestions.mistakeKey) return RNFQuestions.mistakeKey(q);
    return q && q.setId && q.type === "match_pairs" ? "matchSet:" + q.setId : q ? q.id : "";
  }

  function saveMistake(qOrId) {
    var key = typeof qOrId === "string" ? qOrId : mistakeKeyFor(qOrId);
    if (!key) return;
    var list = loadMistakes();
    if (list.indexOf(key) === -1) list.push(key);
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(list.slice(-80)));
  }

  function removeMistake(qOrId) {
    var key = typeof qOrId === "string" ? qOrId : mistakeKeyFor(qOrId);
    var list = loadMistakes().filter(function (x) {
      return x !== key;
    });
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(list));
  }

  function questionSummary(q) {
    if (!q) return "";
    var parts = [];
    if (q.promptLine) parts.push(tf(q.promptLine));
    if (q.prompt) parts.push(tf(q.prompt));
    if (q.statement) parts.push(tf(q.statement));
    if (!parts.length && q.type === "match_pairs") parts.push(tf(q.prompt) || t("flow.pickPairs"));
    var s = parts.join(" · ") || q.id || "";
    s = s.replace(/\s+/g, " ").trim();
    if (s.length > 48) s = s.slice(0, 46) + "…";
    return s;
  }

  function saveSessionReport(state) {
    try {
      localStorage.setItem(
        SESSION_REPORT_KEY,
        JSON.stringify({
          at: Date.now(),
          correct: state.correct,
          answered: state.answered,
          total: state.queue.length,
          xp: state.xp,
          results: state.results || [],
        })
      );
    } catch (e) {}
  }

  function loadLastSession() {
    try {
      var raw = localStorage.getItem(SESSION_REPORT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function unlockStorageKey() {
    try {
      return "rnf_unlock_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_unlock_en";
    }
  }

  function explainStorageKey() {
    try {
      return "rnf_score_explain_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_score_explain_en";
    }
  }

  function streakDataKey() {
    try {
      return "rnf_streak_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_streak_en";
    }
  }

  function streakUiKey() {
    try {
      return (
        "rnf_streak_ui_" +
        (sessionStorage.getItem("learn_target") || "en") +
        "_" +
        new Date().toDateString()
      );
    } catch (e) {
      return "rnf_streak_ui_en";
    }
  }

  function updateStreak() {
    var key = streakDataKey();
    var today = new Date().toDateString();
    var data = { count: 1, lastDate: today };
    try {
      var raw = localStorage.getItem(key);
      if (raw) data = JSON.parse(raw);
    } catch (e) {}
    if (data.lastDate === today) {
      if (!data.count) data.count = 1;
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e2) {}
      return data.count;
    }
    var y = new Date();
    y.setDate(y.getDate() - 1);
    if (data.lastDate === y.toDateString()) {
      data.count = (data.count || 0) + 1;
    } else {
      data.count = 1;
    }
    data.lastDate = today;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e3) {}
    return data.count;
  }

  function weekdayStrip(streakCount) {
    var keys = [
      "daySun",
      "dayMon",
      "dayTue",
      "dayWed",
      "dayThu",
      "dayFri",
      "daySat",
    ];
    var out = [];
    var start = new Date();
    for (var i = 0; i < 5; i++) {
      var d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push({
        label: t("flow." + keys[d.getDay()]),
        done: i === 0 && streakCount > 0,
        today: i === 0,
      });
    }
    return out;
  }

  /** Seven-day row: today done, tomorrow goal ring, later grey (unit-complete screen). */
  function streakWeekRow() {
    var keys = [
      "daySun",
      "dayMon",
      "dayTue",
      "dayWed",
      "dayThu",
      "dayFri",
      "daySat",
    ];
    var out = [];
    var today = new Date();
    for (var i = 0; i < 7; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() + i);
      var state = i === 0 ? "done" : i === 1 ? "goal" : "future";
      out.push({
        label: t("flow." + keys[d.getDay()]),
        state: state,
        highlight: i === 0,
      });
    }
    return out;
  }

  var STREAK_MILESTONES = [
    { days: 7, mult: 2, m: "streakM7", r: "streakR7" },
    { days: 14, mult: 3, m: "streakM14", r: "streakR14" },
    { days: 30, mult: 5, m: "streakM30", r: "streakR30" },
    { days: 50, mult: 7, m: "streakM50", r: "streakR50" },
  ];

  function streakMultiplierForDays(days) {
    for (var i = 0; i < STREAK_MILESTONES.length; i++) {
      if (STREAK_MILESTONES[i].days === days) return STREAK_MILESTONES[i].mult;
    }
    return 2;
  }

  function streakGoalsKey() {
    try {
      return "rnf_streak_goals_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_streak_goals_en";
    }
  }

  function streakGoalBubbleHtml(days) {
    var n = streakMultiplierForDays(days || 7);
    var mult =
      '<strong class="lc-goal-bubble-em">' +
      t("flow.streakGoalTimes", { n: n }) +
      "</strong>";
    return t("flow.streakGoalIntro", { multiplier: mult });
  }

  function updateStreakGoalPick(self, days) {
    var bubble = self.root.querySelector(".lc-goal-bubble");
    if (bubble) bubble.innerHTML = streakGoalBubbleHtml(days);
    var cal = self.root.querySelector(".lc-goal-cal-num");
    if (cal) cal.textContent = String(days);
    self.root.querySelectorAll(".lc-goal-row").forEach(function (row) {
      var d = parseInt(row.getAttribute("data-days"), 10);
      row.classList.toggle("selected", d === days);
    });
  }

  function getStreakCount() {
    try {
      var raw = localStorage.getItem(streakDataKey());
      if (raw) return JSON.parse(raw).count || 1;
    } catch (e) {}
    return 1;
  }

  function todayDateKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function dailyQuestStorageKey() {
    try {
      return (
        "rnf_daily_xp_" +
        (sessionStorage.getItem("learn_target") || "en") +
        "_" +
        todayDateKey()
      );
    } catch (e) {
      return "rnf_daily_xp_en_" + todayDateKey();
    }
  }

  function loadDailyQuest() {
    try {
      var raw = localStorage.getItem(dailyQuestStorageKey());
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { xp: 0, celebrated: false };
  }

  function saveDailyQuest(data) {
    try {
      localStorage.setItem(dailyQuestStorageKey(), JSON.stringify(data));
    } catch (e) {}
  }

  function gemsStorageKey() {
    try {
      return "rnf_gems_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_gems_en";
    }
  }

  function addGems(amount) {
    try {
      var cur = parseInt(localStorage.getItem(gemsStorageKey()) || "0", 10) || 0;
      localStorage.setItem(gemsStorageKey(), String(cur + (amount || 0)));
    } catch (e) {}
  }

  function heartsStorageKey() {
    try {
      return "rnf_hearts_" + (sessionStorage.getItem("learn_target") || "en");
    } catch (e) {
      return "rnf_hearts_en";
    }
  }

  function loadHearts() {
    try {
      var n = parseInt(localStorage.getItem(heartsStorageKey()) || String(MAX_HEARTS), 10);
      if (isNaN(n)) return MAX_HEARTS;
      return Math.min(MAX_HEARTS, Math.max(0, n));
    } catch (e) {
      return MAX_HEARTS;
    }
  }

  function saveHearts(n) {
    try {
      localStorage.setItem(
        heartsStorageKey(),
        String(Math.min(MAX_HEARTS, Math.max(0, n)))
      );
    } catch (e) {}
  }

  /** 一般練習：每開新的一堂課補滿愛心（跳關測驗除外） */
  function initLessonHearts(mode) {
    if (mode === "jump") {
      var capped = Math.min(loadHearts(), 2);
      saveHearts(capped);
      return capped;
    }
    if (mode === "challenge" || mode === "drill") {
      var hardCap = Math.min(loadHearts(), 3);
      saveHearts(hardCap);
      return hardCap;
    }
    if (mode === "normal" || mode === "review" || mode === "chest") {
      saveHearts(MAX_HEARTS);
      return MAX_HEARTS;
    }
    return loadHearts();
  }

  function refillHeartsForNewLesson(mode) {
    return initLessonHearts(mode || "normal");
  }

  function profileStorageKey() {
    return "rnf_profile_created";
  }

  function profilePromptKey() {
    return "rnf_profile_prompt";
  }

  function hasProfile() {
    try {
      return localStorage.getItem(profileStorageKey()) === "1";
    } catch (e) {
      return false;
    }
  }

  function profilePromptDeferred() {
    try {
      return localStorage.getItem(profilePromptKey()) === "later";
    } catch (e) {
      return false;
    }
  }

  function deferProfilePrompt() {
    try {
      localStorage.setItem(profilePromptKey(), "later");
    } catch (e) {}
  }

  function proceedToComplete(self) {
    if (!hasProfile() && !profilePromptDeferred()) {
      self.renderProfilePrompt();
      return;
    }
    self.renderCompleteSummary();
  }

  function proceedAfterRewards(self) {
    var current = self.state.lives;
    if (current < MAX_HEARTS) {
      var newCount = current + 1;
      saveHearts(newCount);
      self.state.lives = newCount;
      self.renderHeartReward(newCount);
      return;
    }
    saveHearts(current);
    proceedToComplete(self);
  }

  function addTotalXp(amount) {
    try {
      var cur = parseInt(localStorage.getItem("rnf_total_xp") || "0", 10) || 0;
      localStorage.setItem("rnf_total_xp", String(cur + (amount || 0)));
    } catch (e) {}
  }

  function addSessionDailyXp(amount) {
    var data = loadDailyQuest();
    data.xp = (data.xp || 0) + (amount || 0);
    saveDailyQuest(data);
    addTotalXp(amount || 0);
    return data;
  }

  function proceedToFinish(self) {
    var daily = addSessionDailyXp(self.state.xp || 0);
    if (daily.xp >= DAILY_XP_GOAL && !daily.celebrated) {
      self.renderDailyQuestComplete(
        Math.min(daily.xp, DAILY_XP_GOAL),
        DAILY_XP_GOAL,
        self.state.xp || 0
      );
      return;
    }
    proceedAfterRewards(self);
  }

  function proceedAfterStreak(self) {
    try {
      if (!localStorage.getItem(streakGoalsKey())) {
        self.renderStreakGoals();
        return;
      }
    } catch (e) {}
    proceedToFinish(self);
  }

  function finishSessionFlow(self) {
    var count = updateStreak();
    self._streakCount = count;
    try {
      if (!localStorage.getItem(streakUiKey())) {
        self.renderStreakCelebrate(count);
        return;
      }
    } catch (e) {}
    proceedAfterStreak(self);
  }

  function computeScoreTier(correct, total) {
    if (!total) return 1;
    var r = correct / total;
    if (r >= 0.95) return 5;
    if (r >= 0.8) return 4;
    if (r >= 0.6) return 3;
    if (r >= 0.4) return 2;
    return 1;
  }

  function learnLangLabel() {
    if (global.AppI18n && AppI18n.getLearnTargetName) {
      return AppI18n.getLearnTargetName();
    }
    return "English";
  }

  function badgeLabel(badge) {
    var map = {
      new_word: "flow.newWord",
      daily: "flow.badgeDaily",
      phrase: "flow.badgePhrase",
      grammar: "flow.badgeGrammar",
      review: "flow.badgeReview",
    };
    return t(map[badge] || "flow.badgeDaily");
  }

  function PracticeEngine(opts) {
    this.root = opts.root;
    this.onProgress = opts.onProgress || function () {};
    this.onScore = opts.onScore || opts.onLives || function () {};
    this.state = {
      queue: [],
      index: 0,
      correct: 0,
      answered: 0,
      xp: 0,
      streak: 0,
      checked: false,
      lives: 5,
      mode: "normal",
      results: [],
    };
    this._bindFooter(opts);
    this.start(opts.mode);
  }

  PracticeEngine.prototype.start = function (mode) {
    this.state.mode = mode || "normal";
    this.state.index = 0;
    this.state.correct = 0;
    this.state.answered = 0;
    this.state.xp = 0;
    this.state.streak = 0;
    this.state.checked = false;
    this.state.lives = initLessonHearts(this.state.mode);
    this.state.results = [];
    this._mascotUsed = {};

    var filterIds = null;
    if (this.state.mode === "review") {
      filterIds = loadMistakes();
      if (!filterIds.length) {
        this.renderNoMistakes();
        return;
      }
      var reviewSize = Math.max(1, Math.min(filterIds.length, SESSION_SIZE));
      this.state.queue = RNFQuestions.buildSession(reviewSize, filterIds, {
        mode: "review",
        mistakesOnly: true,
      });
      this.renderCurrent();
      return;
    }
    var sessionSize = SESSION_SIZE;
    if (this.state.mode === "challenge") sessionSize = 12;
    if (this.state.mode === "chest" || this.state.mode === "bonus") sessionSize = 6;
    if (this.state.mode === "listen") sessionSize = 8;
    if (this.state.mode === "match") sessionSize = 10;
    if (this.state.mode === "story") sessionSize = 10;
    var stageTier =
      global.RNFPathProgress && RNFPathProgress.getPathTier
        ? RNFPathProgress.getPathTier()
        : 1;
    this.state.queue = RNFQuestions.buildSession(sessionSize, filterIds, {
      mode: this.state.mode,
      stageTier: stageTier,
    });
    if (this.state.mode === "jump") {
      this._jumpPart = getJumpTestPart();
      var priority = [];
      if (global.RNFQuestions && RNFQuestions.getById) {
        var tq = RNFQuestions.getById("q_translate_sister");
        var wq = RNFQuestions.getById("q_write_photo");
        var bq = RNFQuestions.getById("q_translate_breakup");
        var dy = RNFQuestions.getById("q_write_dad_young");
        var who = RNFQuestions.getById("q_translate_who");
        if (tq) priority.push(tq);
        if (wq) priority.push(wq);
        if (bq) priority.push(bq);
        if (dy) priority.push(dy);
        if (who) priority.push(who);
      }
      if (priority.length) {
        var jumpCourse = sessionStorage.getItem("learn_target") || "en";
        priority = priority.filter(function (pq) {
          if (
            global.RNFQuestions &&
            RNFQuestions.isCantoneseQuestion &&
            RNFQuestions.isCantoneseQuestion(pq)
          ) {
            return false;
          }
          if (
            global.RNFQuestions &&
            RNFQuestions.questionMatchesCourse &&
            !RNFQuestions.questionMatchesCourse(pq, jumpCourse)
          ) {
            return false;
          }
          return true;
        });
        var ids = {};
        priority.forEach(function (pq) {
          ids[pq.id] = true;
        });
        this.state.queue = priority.concat(
          this.state.queue.filter(function (q) {
            return !ids[q.id];
          })
        );
        this.state.queue = this.state.queue.slice(0, SESSION_SIZE);
      }
    }
    this.renderCurrent();
  };

  PracticeEngine.prototype._bindFooter = function (opts) {
    var self = this;
    var bar = document.querySelector(".lc-footer-bar");
    if (bar && !bar.dataset.defaultHtml) {
      bar.dataset.defaultHtml = bar.innerHTML;
    }
    this._footerBar = bar;
    this._wireDefaultFooter();
  };

  PracticeEngine.prototype._wireDefaultFooter = function () {
    var self = this;
    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = document.getElementById("btnSkip");
    if (this.btnSkip) {
      this.btnSkip.onclick = function () {
        if (self.state.checked) self.advance();
        else self.skipQuestion();
      };
    }
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        if (self.state.checked) self.advance();
        else self.checkAnswer();
      };
    }
  };

  PracticeEngine.prototype.resetLessonFooter = function () {
    document.body.classList.remove(
      "lc-lesson-result-wrong",
      "lc-lesson-result-correct",
      "lc-lesson-result-encourage",
      "lc-lesson-last-chance"
    );
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (bar && bar.dataset.defaultHtml) {
      bar.innerHTML = bar.dataset.defaultHtml;
      bar.classList.remove("lc-footer-bar--result");
      this._wireDefaultFooter();
    }
  };

  PracticeEngine.prototype.showTranslateResultFooter = function (ok, q) {
    if (ok) {
      this.showTranslateCorrectFooter(q);
    } else {
      this.showTranslateCorrectionFooter(q);
    }
  };

  PracticeEngine.prototype.showTranslateCorrectFooter = function (q) {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.add("lc-lesson-result-correct");
    document.body.classList.remove("lc-lesson-result-wrong", "lc-lesson-result-encourage");
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--ok lc-lesson-result-bar--praise">' +
      '<div class="lc-lesson-result-body">' +
      '<span class="lc-lesson-result-icon ok" aria-hidden="true">✓</span>' +
      '<div class="lc-lesson-result-text">' +
      '<p class="lc-lesson-result-praise">' +
      (getTranslateCorrectPraise(q) || pickEncourageLine(true)) +
      "</p>" +
      '<button type="button" class="lc-lesson-result-report">' +
      "🚩 " +
      reportErrorLabelText() +
      "</button></div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta lc-lesson-result-cta--green" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    var reportBtn = bar.querySelector(".lc-lesson-result-report");
    if (reportBtn) {
      reportBtn.addEventListener("click", function () {
        alert(t("flow.reportThanks") || "Thanks, we'll review this.");
      });
    }

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        self.advance();
      };
    }
  };

  function trueFalseCorrectLabel(q) {
    return q && q.correct ? t("flow.trueLabel") : t("flow.falseLabel");
  }

  PracticeEngine.prototype.showTrueFalseResultFooter = function (ok, q) {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    if (ok) {
      document.body.classList.add("lc-lesson-result-correct");
      document.body.classList.remove("lc-lesson-result-wrong", "lc-lesson-result-encourage");
      bar.classList.add("lc-footer-bar--result");
      bar.innerHTML =
        '<div class="lc-lesson-result-bar lc-lesson-result-bar--ok">' +
        '<div class="lc-lesson-result-body">' +
        '<span class="lc-lesson-result-icon ok" aria-hidden="true">✓</span>' +
        '<div class="lc-lesson-result-text">' +
        '<p class="lc-lesson-result-praise">' +
        t("flow.correctFbShort") +
        "</p></div></div>" +
        '<button type="button" class="lc-btn-primary lc-lesson-result-cta lc-lesson-result-cta--green" id="btnAction">' +
        t("flow.continue") +
        "</button></div>";
    } else {
      document.body.classList.add("lc-lesson-result-wrong");
      document.body.classList.remove("lc-lesson-result-correct", "lc-lesson-result-encourage");
      bar.classList.add("lc-footer-bar--result");
      var explain = q && q.explanation ? tf(q.explanation) : "";
      bar.innerHTML =
        '<div class="lc-lesson-result-bar lc-lesson-result-bar--bad">' +
        '<div class="lc-lesson-result-body">' +
        '<span class="lc-lesson-result-icon bad" aria-hidden="true">✗</span>' +
        '<div class="lc-lesson-result-text">' +
        '<p class="lc-lesson-result-label">' +
        correctAnswerLabelText() +
        "</p>" +
        '<p class="lc-lesson-result-ans">' +
        trueFalseCorrectLabel(q) +
        "</p>" +
        (explain
          ? '<p class="lc-lesson-result-note">' + explain + "</p>"
          : "") +
        "</div></div>" +
        '<button type="button" class="lc-btn-primary lc-lesson-result-cta" id="btnAction">' +
        t("flow.continue") +
        "</button></div>";
    }

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        self.advance();
      };
    }
  };

  PracticeEngine.prototype.showTranslateCorrectionFooter = function (q) {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.add("lc-lesson-result-wrong");
    document.body.classList.remove("lc-lesson-result-correct", "lc-lesson-result-encourage");
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--bad">' +
      '<div class="lc-lesson-result-body">' +
      '<span class="lc-lesson-result-icon bad" aria-hidden="true">✗</span>' +
      '<div class="lc-lesson-result-text">' +
      '<p class="lc-lesson-result-label">' +
      correctAnswerLabelText() +
      "</p>" +
      '<p class="lc-lesson-result-ans">' +
      getCorrectOptionLabel(q) +
      "</p>" +
      '<button type="button" class="lc-lesson-result-report">' +
      "🚩 " +
      reportErrorLabelText() +
      "</button></div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    var reportBtn = bar.querySelector(".lc-lesson-result-report");
    if (reportBtn) {
      reportBtn.addEventListener("click", function () {
        alert(t("flow.reportThanks") || "Thanks, we'll review this.");
      });
    }

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        self.showTranslateEncourageFooter();
      };
    }
  };

  PracticeEngine.prototype.showWriteSentenceCorrectFooter = function () {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.add("lc-lesson-result-correct");
    document.body.classList.remove(
      "lc-lesson-result-wrong",
      "lc-lesson-result-encourage"
    );
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--ok lc-lesson-result-bar--praise">' +
      '<div class="lc-lesson-result-body">' +
      '<span class="lc-lesson-result-icon ok" aria-hidden="true">✓</span>' +
      '<div class="lc-lesson-result-text">' +
      '<p class="lc-lesson-result-praise">' +
      correctPraiseText() +
      "</p>" +
      '<button type="button" class="lc-lesson-result-report">' +
      "🚩 " +
      reportErrorLabelText() +
      "</button></div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta lc-lesson-result-cta--green" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    var reportBtn = bar.querySelector(".lc-lesson-result-report");
    if (reportBtn) {
      reportBtn.addEventListener("click", function () {
        alert(t("flow.reportThanks") || "Thanks, we'll review this.");
      });
    }

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        self.advance();
      };
    }
  };

  PracticeEngine.prototype.showWriteSentenceWrongFooter = function (q) {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.add("lc-lesson-result-wrong");
    document.body.classList.remove("lc-lesson-result-correct", "lc-lesson-result-encourage");
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--bad">' +
      '<div class="lc-lesson-result-body">' +
      '<span class="lc-lesson-result-icon bad" aria-hidden="true">✗</span>' +
      '<div class="lc-lesson-result-text">' +
      '<p class="lc-lesson-result-label">' +
      correctAnswerLabelText() +
      "</p>" +
      '<p class="lc-lesson-result-ans">' +
      getWordBankAnswerText(q) +
      "</p>" +
      '<button type="button" class="lc-lesson-result-report">' +
      "🚩 " +
      reportErrorLabelText() +
      "</button></div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    var reportBtn = bar.querySelector(".lc-lesson-result-report");
    if (reportBtn) {
      reportBtn.addEventListener("click", function () {
        alert(t("flow.reportThanks") || "Thanks, we'll review this.");
      });
    }

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        self.showTranslateEncourageFooter();
      };
    }
  };

  PracticeEngine.prototype.applyWrongAnswerVisuals = function (q) {
    if (q.type === "translate_choice") {
      if (this._selection && this._selection.classList) {
        this._selection.classList.add("wrong-pick");
      }
      this.root.querySelectorAll("[data-correct]").forEach(function (b) {
        b.classList.add("correct-pick");
      });
      this.root.querySelectorAll(".lc-opt-btn-translate").forEach(function (b) {
        b.disabled = true;
      });
    } else if (
      q.type === "emoji_pick" ||
      q.type === "text_choice" ||
      isListenPickQuestion(q)
    ) {
      if (this._selection && this._selection.classList) {
        this._selection.classList.add("wrong-pick");
      }
      this.root.querySelectorAll("[data-correct]").forEach(function (b) {
        b.classList.add("correct-pick");
      });
      this.root
        .querySelectorAll(
          ".lc-pick-card, .lc-opt-btn[data-choice], .lc-listen-chip"
        )
        .forEach(function (b) {
          b.disabled = true;
        });
    } else if (isWriteSentenceQuestion(q)) {
      lockWriteSentenceChips(this.root, false);
    }
  };

  PracticeEngine.prototype.finishWrongAnswerFlow = function (q) {
    if (
      q.type === "translate_choice" ||
      q.type === "emoji_pick" ||
      q.type === "text_choice" ||
      isListenPickQuestion(q)
    ) {
      this.showTranslateResultFooter(false, q);
    } else if (isWriteSentenceQuestion(q)) {
      this.showWriteSentenceWrongFooter(q);
    }
  };

  PracticeEngine.prototype.showLastChanceFooter = function (onContinue) {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.add("lc-lesson-last-chance");
    document.body.classList.remove(
      "lc-lesson-result-wrong",
      "lc-lesson-result-correct",
      "lc-lesson-result-encourage"
    );
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--last-chance">' +
      '<div class="lc-lesson-encourage-duo">' +
      '<div class="lc-lesson-encourage-mascot lc-lesson-encourage-mascot--wave" data-frog-logo aria-hidden="true"></div>' +
      '<div class="lc-lesson-encourage-bubble lc-lesson-last-chance-bubble">' +
      lastChanceWarningText() +
      "</div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta lc-lesson-result-cta--green" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount(bar);

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        document.body.classList.remove("lc-lesson-last-chance");
        if (onContinue) onContinue();
      };
    }
  };

  PracticeEngine.prototype.showTranslateEncourageFooter = function () {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.remove("lc-lesson-result-wrong");
    document.body.classList.add("lc-lesson-result-encourage");
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--encourage">' +
      '<div class="lc-lesson-encourage-duo">' +
      '<div class="lc-lesson-encourage-mascot" data-frog-logo aria-hidden="true"></div>' +
      '<div class="lc-lesson-encourage-bubble">' +
      pickEncourageLine(false) +
      "</div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta lc-lesson-result-cta--green" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount(bar);

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        self.advance();
      };
    }
  };

  PracticeEngine.prototype.current = function () {
    return this.state.queue[this.state.index];
  };

  PracticeEngine.prototype.recordResult = function (q, ok, skipped) {
    if (!skipped && global.RNFAdventureIsland && RNFAdventureIsland.recordAnswer) {
      RNFAdventureIsland.recordAnswer();
    }
    if (!q) return;
    var idx = this.state.results.length;
    this.state.results.push({
      index: idx + 1,
      qid: q.id,
      type: q.type,
      badge: q.badge,
      title: questionSummary(q),
      fullPrompt: tf(q.prompt) || questionSummary(q),
      correct: !!ok,
      skipped: !!skipped,
    });
  };

  PracticeEngine.prototype.publishScore = function (bump) {
    if (this.onScore) {
      this.onScore({
        correct: this.state.correct,
        total: this.state.queue.length,
        lives: this.state.lives,
        streak: this.state.streak,
        bump: !!bump,
      });
    }
  };

  PracticeEngine.prototype.setAction = function (enabled, label) {
    if (!this.btnAction) return;
    this.btnAction.disabled = !enabled;
    if (label) this.btnAction.textContent = label;
  };

  PracticeEngine.prototype.renderNoMistakes = function () {
    this.resetLessonFooter();
    this.root.innerHTML =
      '<div class="lc-complete">' +
      '<div class="lc-mascot lc-complete-mascot">🐸</div>' +
      "<p class=\"lc-quiz-q\">" +
      t("flow.noMistakes") +
      "</p>" +
      '<div class="lc-complete-actions">' +
      '<a class="lc-btn-primary lc-btn-block" href="lesson.html">' +
      t("flow.continuePractice") +
      "</a>" +
      '<a class="lc-btn-ghost lc-btn-block" href="home.html">' +
      t("flow.backHome") +
      "</a>" +
      "</div></div>";
    this.setAction(false);
    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.onProgress(100);
    this.publishScore(false);
  };

  PracticeEngine.prototype.renderCurrent = function () {
    var q = this.current();
    if (!q) {
      this.renderComplete();
      return;
    }
    this.state.checked = false;
    this._selection = null;
    this._bankOrder = [];
    this._matchState = null;
    if (this.btnSkip) this.btnSkip.classList.remove("lc-hidden");
    this.setAction(false, t("flow.check"));
    if (
      q.type === "translate_choice" ||
      isWriteSentenceQuestion(q) ||
      isListenPickQuestion(q)
    ) {
      this.resetLessonFooter();
    }

    var pct = Math.round((this.state.index / this.state.queue.length) * 100);
    this.onProgress(pct);
    this.publishScore(false);

    var isTranslate = q.type === "translate_choice";
    var isWriteSentence = isWriteSentenceQuestion(q);
    var isLongWrite =
      q.type === "word_bank" && q.variant === "write_sentence";
    var isTranslateChip = isTranslateChipQuestion(q);
    var isListenPick = isListenPickQuestion(q);
    var isTrueFalse = q.type === "true_false";
    var badge =
      !isTranslate && !isLongWrite && q.badge
        ? '<span class="lc-quiz-badge lc-quiz-badge--' +
          q.badge +
          '">✨ ' +
          badgeLabel(q.badge) +
          "</span>"
        : "";
    var counter =
      !isTranslate && !isLongWrite && !isTranslateChip && !isListenPick
        ? '<p class="lc-q-counter">' +
          t("flow.questionOf", {
            current: this.state.index + 1,
            total: this.state.queue.length,
          }) +
          "</p>"
        : "";
    var promptText = promptTextForQuestion(q);

    var html =
      '<div class="lc-step active' +
      (isTranslate ? " lc-step-translate" : "") +
      (isWriteSentence ? " lc-step-write-sentence" : "") +
      (isTranslateChip ? " lc-step-translate-chip" : "") +
      (isListenPick ? " lc-step-listen" : "") +
      (isTrueFalse ? " lc-step-true-false" : "") +
      '" data-qid="' +
      q.id +
      '">' +
      counter +
      badge;
    var headerSpeak =
      !isTranslate &&
      !isListenPick &&
      !isTranslateChip &&
      !isTrueFalse &&
      questionSpeakText(q);
    if (headerSpeak) {
      html +=
        '<p class="lc-quiz-q lc-quiz-q--speak">' +
        promptText +
        '<button type="button" class="lc-quiz-speak" aria-label="' +
        t("flow.guidePlayAudio") +
        '">🔊</button></p>';
    } else {
      html += '<p class="lc-quiz-q">' + promptText + "</p>";
    }

    if (q.type === "emoji_pick") {
      html += this.renderEmojiPick(q);
    } else if (q.type === "listen_pick") {
      html += this.renderListenPick(q);
    } else if (q.type === "translate_choice") {
      html += this.renderTranslateChoice(q);
    } else if (q.type === "text_choice") {
      html += this.renderTextChoice(q);
    } else if (q.type === "word_bank") {
      html += this.renderWordBank(q);
    } else if (q.type === "fill_pick") {
      html += this.renderFillPick(q);
    } else if (q.type === "true_false") {
      html += this.renderTrueFalse(q);
    } else if (q.type === "match_pairs") {
      html += this.renderMatchPairs(q);
    }

    if (!isTranslate && !isWriteSentence && !isTranslateChip && !isListenPick) {
      html +=
        '<div class="lc-feedback" id="engineFeedback">' +
        '<span class="lc-feedback-icon" id="engineFbIcon">✓</span>' +
        '<div><strong id="engineFbTitle"></strong><span id="engineFbSub"></span></div></div>';
    }

    this.root.innerHTML = html;
    this.wireInteractions(q);
    this.maybeAutoSpeak(q);
  };

  /** 切換網站語言：只更新介面文案，不重抽題目、不重置進度 */
  PracticeEngine.prototype.refreshLocale = function () {
    var q = this.current();
    if (!q || !this.root) return;
    var step = this.root.querySelector(".lc-step[data-qid]");
    if (!step || step.getAttribute("data-qid") !== q.id) return;

    var promptEl = this.root.querySelector(".lc-quiz-q");
    if (promptEl) {
      var speakBtn = promptEl.querySelector(".lc-quiz-speak");
      var text = promptTextForQuestion(q);
      if (speakBtn) {
        promptEl.textContent = text;
        promptEl.appendChild(speakBtn);
        speakBtn.setAttribute("aria-label", t("flow.guidePlayAudio"));
      } else {
        promptEl.textContent = text;
      }
    }

    var counter = this.root.querySelector(".lc-q-counter");
    if (counter) {
      counter.textContent = t("flow.questionOf", {
        current: this.state.index + 1,
        total: this.state.queue.length,
      });
    }

    var badge = this.root.querySelector(".lc-quiz-badge");
    if (badge && q.badge) {
      badge.textContent = "✨ " + badgeLabel(q.badge);
    }

    var audioHint = this.root.querySelector(".lc-bubble-audio-hint");
    if (audioHint) audioHint.textContent = t("flow.listenArrangeHint");

    var bubbleHint = this.root.querySelector(".lc-bubble-hint");
    if (bubbleHint) bubbleHint.textContent = t("flow.bubbleHoverHint");

    if (q.type === "translate_choice") {
      var trLine = this.root.querySelector(".lc-guide-translate .lc-bubble-line");
      if (trLine) trLine.textContent = translatePromptText(q);
    }

    if (q.type === "text_choice") {
      var cueLine = this.root.querySelector(".lc-guide-text .lc-bubble-line");
      if (cueLine) {
        var cue = textChoiceBubbleText(q);
        if (cue) cueLine.textContent = cue;
      }
    }

    if (q.type === "word_bank" && !isTranslateChipQuestion(q)) {
      var wbLine = this.root.querySelector(".lc-guide-write .lc-bubble-line");
      if (wbLine) {
        wbLine.textContent =
          getLearnCourse() === "zh"
            ? global.RNFQuestions && RNFQuestions.tUiField
              ? RNFQuestions.tUiField(q.promptLine)
              : tf(q.promptLine)
            : translatePromptText(q);
      }
    }

    if (q.type === "match_pairs") {
      var matchHint = this.root.querySelector(".lc-match-hint");
      if (matchHint) {
        matchHint.textContent = t("flow.matchHint", { n: q.pairs.length });
      }
    }

    if (q.type === "true_false") {
      var stmtEl = this.root.querySelector(".lc-statement");
      if (stmtEl && q.statement) {
        stmtEl.textContent =
          global.RNFQuestions && RNFQuestions.tUiField
            ? RNFQuestions.tUiField(q.statement) || tf(q.statement)
            : tf(q.statement);
      }
    }

    if (q.type === "listen_pick") {
      var slowBtn = this.root.querySelector(".lc-listen-btn--slow");
      if (slowBtn) slowBtn.setAttribute("aria-label", t("flow.listenSlow"));
    }

    this.root.querySelectorAll(".lc-bubble-speak, .lc-quiz-speak, .lc-listen-btn--main").forEach(
      function (btn) {
        btn.setAttribute("aria-label", t("flow.guidePlayAudio"));
      }
    );

    if (this.btnAction && !this._footerBar) {
      var label = this.state.checked ? t("flow.continue") : t("flow.check");
      this.setAction(!this.btnAction.disabled, label);
    }
  };

  PracticeEngine.prototype.renderEmojiPick = function (q) {
    if (RNFQuestions.dedupeEmojiPickQuestion) {
      try {
        var epCourse = sessionStorage.getItem("learn_target") || "en";
        q = RNFQuestions.dedupeEmojiPickQuestion(q, epCourse);
      } catch (e) {}
    }
    var opts = RNFQuestions.shuffle(q.options);
    var epCourse = "en";
    try {
      epCourse = sessionStorage.getItem("learn_target") || "en";
    } catch (e) {}
    var showLabels = epCourse === "zh";
    var html =
      '<div class="lc-pick-grid lc-pick-grid--vivid' +
      (showLabels ? " lc-pick-grid--labeled" : " lc-pick-grid--icon-only") +
      '">';
    opts.forEach(function (opt, i) {
      var artCls = opt.cardArt ? " lc-pick-art--" + opt.cardArt : "";
      var labelTxt = tf(opt.label);
      html +=
        '<button type="button" class="lc-pick-card lc-pick-card--vivid lc-pick-card--tone-' +
        (i % 3) +
        (showLabels ? "" : " lc-pick-card--icon-only") +
        '" data-pick="' +
        i +
        '"' +
        (opt.correct ? ' data-correct="1"' : "") +
        (labelTxt ? ' data-pick-label="' + labelTxt.replace(/"/g, "&quot;") + '"' : "") +
        ' aria-label="' +
        (labelTxt ? labelTxt + " · " : "") +
        (uiIsZhHans() ? "选项 " : "Option ") +
        (i + 1) +
        '">' +
        '<div class="lc-pick-art' +
        artCls +
        '"><span class="lc-pick-emoji">' +
        (opt.emoji || "❓") +
        "</span></div>" +
        (showLabels && labelTxt
          ? '<span class="lc-pick-label">' + labelTxt + "</span>"
          : "") +
        '<span class="lc-pick-key">' +
        (i + 1) +
        "</span></button>";
    });
    return html + "</div>";
  };

  PracticeEngine.prototype.renderListenPick = function (q) {
    var html =
      '<div class="lc-listen-stage">' +
      '<div class="lc-listen-audio">' +
      '<button type="button" class="lc-listen-btn lc-listen-btn--main" data-listen-rate="1" aria-label="' +
      t("flow.guidePlayAudio") +
      '"><span class="lc-listen-btn-icon" aria-hidden="true">🔊</span></button>' +
      '<button type="button" class="lc-listen-btn lc-listen-btn--slow" data-listen-rate="slow" aria-label="' +
      t("flow.listenSlow") +
      '"><span class="lc-listen-btn-icon" aria-hidden="true">🐢</span></button>' +
      "</div>" +
      '<div class="lc-listen-slot" id="listenSlot"></div>' +
      '<div class="lc-listen-bank" id="listenBank"></div></div>';
    this._listenQ = q;
    return html;
  };

  PracticeEngine.prototype.renderTranslateChoice = function (q) {
    var bubbleCls = "lc-bubble lc-bubble-source lc-bubble--audio";
    var html =
      '<div class="lc-guide lc-guide-translate">' +
      mascotHtml(this, q) +
      '<div class="' +
      bubbleCls +
      '">' +
      '<span class="lc-bubble-line">' +
      translatePromptText(q) +
      "</span>" +
      '<button type="button" class="lc-bubble-speak" aria-label="' +
      t("flow.guidePlayAudio") +
      '">🔊</button></div></div>';
    var opts = RNFQuestions.shuffle(q.options);
    html += '<div class="lc-options lc-options-translate">';
    opts.forEach(function (opt, i) {
      html +=
        '<button type="button" class="lc-opt-btn lc-opt-btn-translate" data-choice="' +
        i +
        '"' +
        (opt.correct ? ' data-correct="1"' : "") +
        '"><span class="lc-opt-key">' +
        (i + 1) +
        '</span><span class="lc-opt-txt">' +
        tf(opt.label) +
        "</span></button>";
    });
    return html + "</div>";
  };

  function textChoiceOptionLabel(opt) {
    if (!opt || !opt.label) return "";
    if (
      getLearnCourse() !== "zh" &&
      global.RNFQuestions &&
      RNFQuestions.tUiField &&
      (opt.label.hant || opt.label.hans)
    ) {
      return RNFQuestions.tUiField(opt.label);
    }
    return tf(opt.label);
  }

  PracticeEngine.prototype.renderTextChoice = function (q) {
    var html = "";
    var cue = textChoiceBubbleText(q);
    if (cue) {
      html +=
        '<div class="lc-guide lc-guide-text">' +
        mascotHtml(this, q) +
        '<div class="lc-bubble lc-bubble--audio lc-bubble--cue">' +
        '<span class="lc-bubble-line">' +
        cue +
        "</span>" +
        '<button type="button" class="lc-bubble-speak" aria-label="' +
        t("flow.guidePlayAudio") +
        '">🔊</button></div></div>';
    }
    var opts = RNFQuestions.shuffle(q.options);
    html += '<div class="lc-options">';
    opts.forEach(function (opt, i) {
      html +=
        '<button type="button" class="lc-opt-btn" data-choice="' +
        i +
        '"' +
        (opt.correct ? ' data-correct="1"' : "") +
        ">" +
        '<span class="lc-pick-key">' +
        (i + 1) +
        "</span> " +
        textChoiceOptionLabel(opt) +
        "</button>";
    });
    return html + "</div>";
  };

  PracticeEngine.prototype.renderFillPick = function (q) {
    var tpl = tf(q.template).replace("___", '<span class="lc-blank">___</span>');
    var html = '<p class="lc-fill-line">' + tpl + "</p>";
    var opts = RNFQuestions.shuffle(q.options);
    html += '<div class="lc-options">';
    opts.forEach(function (opt, i) {
      html +=
        '<button type="button" class="lc-opt-btn" data-choice="' +
        i +
        '"' +
        (opt.correct ? ' data-correct="1"' : "") +
        ">" +
        '<span class="lc-pick-key">' +
        (i + 1) +
        "</span> " +
        tf(opt.label) +
        "</button>";
    });
    return html + "</div>";
  };

  PracticeEngine.prototype.renderTrueFalse = function (q) {
    var stmt =
      global.RNFQuestions && RNFQuestions.tUiField
        ? RNFQuestions.tUiField(q.statement) || tf(q.statement)
        : tf(q.statement);
    var html =
      '<div class="lc-tf-block">' +
      '<p class="lc-statement">' +
      stmt +
      "</p>" +
      '<div class="lc-tf-row">' +
      '<button type="button" class="lc-tf-btn" data-tf="true">' +
      t("flow.trueLabel") +
      "</button>" +
      '<button type="button" class="lc-tf-btn" data-tf="false">' +
      t("flow.falseLabel") +
      "</button></div></div>";
    this._tfCorrect = q.correct ? "true" : "false";
    return html;
  };

  PracticeEngine.prototype.renderMatchPairs = function (q) {
    var leftItems = [];
    var rightItems = [];
    q.pairs.forEach(function (pair) {
      leftItems.push({ pairId: pair.pairId, text: pair.left });
      rightItems.push({ pairId: pair.pairId, text: pair.right });
    });
    leftItems = RNFQuestions.shuffle(leftItems);
    rightItems = RNFQuestions.shuffle(rightItems);

    this._matchState = {
      total: q.pairs.length,
      correctCount: 0,
      pairsDone: 0,
      pendingLeft: null,
      pendingRight: null,
    };

    var html = '<div class="lc-match-grid">';
    html += '<div class="lc-match-col lc-match-col--native" data-side="left">';
    leftItems.forEach(function (item, i) {
      html +=
        '<button type="button" class="lc-match-btn" data-side="left" data-pair-id="' +
        item.pairId +
        '" data-idx="' +
        i +
        '">' +
        '<span class="lc-match-num">' +
        (i + 1) +
        "</span>" +
        '<span class="lc-match-txt">' +
        matchTf(item.text, "left") +
        "</span></button>";
    });
    html += '</div><div class="lc-match-col lc-match-col--target" data-side="right">';
    rightItems.forEach(function (item, i) {
      var num = (i + 6) % 10;
      html +=
        '<button type="button" class="lc-match-btn" data-side="right" data-pair-id="' +
        item.pairId +
        '" data-idx="' +
        i +
        '">' +
        '<span class="lc-match-num">' +
        num +
        "</span>" +
        '<span class="lc-match-txt">' +
        matchTf(item.text, "right") +
        "</span></button>";
    });
    html += "</div></div>";
    html +=
      '<p class="lc-match-hint">' +
      t("flow.matchHint", { n: q.pairs.length }) +
      "</p>";
    return html;
  };

  PracticeEngine.prototype.renderWordBank = function (q) {
    if (isTranslateChipQuestion(q)) {
      return this.renderTranslateChip(q);
    }
    if (isWriteSentenceQuestion(q)) {
      return this.renderWriteSentence(q);
    }
    var html = "";
    if (q.promptLine || isListenOnlyWordBank(q)) {
      html += wordBankBubbleHtml(this, q);
    }
    html +=
      '<div class="lc-sentence-area" id="sentenceArea"></div>' +
      '<div class="lc-word-bank" id="wordBank"></div>';
    this._wordBankQ = q;
    return html;
  };

  PracticeEngine.prototype.renderTranslateChip = function (q) {
    var bubbleText = translatePromptText(q);
    var html =
      '<div class="lc-guide lc-guide-chip">' +
      mascotHtml(this, q) +
      '<div class="lc-bubble lc-bubble-source lc-bubble--audio">' +
      '<span class="lc-bubble-line">' +
      bubbleText +
      "</span>" +
      '<button type="button" class="lc-bubble-speak" aria-label="' +
      t("flow.guidePlayAudio") +
      '">🔊</button></div>' +
      (q.badge === "new_word"
        ? '<p class="lc-bubble-hint">' + t("flow.bubbleHoverHint") + "</p>"
        : "") +
      "</div></div>" +
      '<div class="lc-options lc-options-chip-pick lc-options--vivid">';
    var opts = RNFQuestions.shuffle(q.words);
    opts.forEach(function (w, i) {
      html +=
        '<button type="button" class="lc-opt-btn lc-opt-btn-chip" data-word-id="' +
        w.id +
        '"' +
        (w.correct ? ' data-correct="1"' : "") +
        '"><span class="lc-opt-key">' +
        (i + 1) +
        '</span><span class="lc-opt-txt">' +
        chipWordText(w.text) +
        "</span></button>";
    });
    this._wordBankQ = q;
    return html + "</div>";
  };

  function stripAudioPrefix(s) {
    return (s || "").replace(/^🔊\s*/, "").trim();
  }

  function wordBankSpeakText(q) {
    if (!q) return "";
    if (shouldSpeakKeyForeignOnly(q)) {
      var kw = keyForeignFromQuestion(q);
      if (kw) return kw;
    }
    if (q.speakLine) {
      var sl = q.speakLine;
      if (getLearnCourse() !== "zh") {
        return stripAudioPrefix(sl.en || sl.hant || sl.hans || "");
      }
      if (sl.en && /^[A-Za-z0-9]/.test(sl.en) && sl.en === sl.hant && sl.en === sl.hans) {
        return stripAudioPrefix(sl.en);
      }
      return global.RNFQuestions && RNFQuestions.tUiField
        ? RNFQuestions.tUiField(sl)
        : tf(sl);
    }
    if (!q.promptLine) return "";
    return stripAudioPrefix(
      getLearnCourse() === "zh"
        ? (global.RNFQuestions && RNFQuestions.tUiField
            ? RNFQuestions.tUiField(q.promptLine)
            : tf(q.promptLine))
        : translatePromptText(q)
    );
  }

  /** 學英語排列句：泡泡不顯示英文全文，只播語音 */
  function isListenOnlyWordBank(q) {
    if (!q || q.type !== "word_bank" || isTranslateChipQuestion(q)) return false;
    if (q.audioOnly || q.listenOnly) return true;
    var course = getLearnCourse();
    if (course !== "en") return false;
    var line = wordBankSpeakText(q);
    if (!line || !/^[A-Za-z"'’「]/.test(line)) return false;
    if (!q.words || !q.words.length) return false;
    for (var i = 0; i < q.words.length; i++) {
      var inAnswer =
        !q.answer ||
        !q.answer.length ||
        q.answer.indexOf(q.words[i].id) >= 0;
      if (inAnswer) {
        var w = chipWordText(q.words[i].text);
        if (w && /^[A-Za-z]/.test(w)) return true;
      }
    }
    return false;
  }

  function wordBankBubbleHtml(engine, q) {
    if (isListenOnlyWordBank(q)) {
      return (
        '<div class="lc-guide lc-guide-write lc-guide-listen">' +
        mascotHtml(engine, q) +
        '<div class="lc-bubble lc-bubble-source lc-bubble--audio lc-bubble--listen-only">' +
        '<button type="button" class="lc-bubble-speak lc-bubble-speak--solo" aria-label="' +
        t("flow.guidePlayAudio") +
        '"><span class="lc-bubble-speak-icon" aria-hidden="true">🔊</span></button>' +
        '<p class="lc-bubble-audio-hint">' +
        t("flow.listenArrangeHint") +
        "</p></div></div>"
      );
    }
    var text =
      getLearnCourse() === "zh"
        ? global.RNFQuestions && RNFQuestions.tUiField
          ? RNFQuestions.tUiField(q.promptLine)
          : tf(q.promptLine)
        : translatePromptText(q);
    return (
      '<div class="lc-guide lc-guide-write">' +
      mascotHtml(engine, q) +
      '<div class="lc-bubble lc-bubble-source lc-bubble--audio">' +
      '<span class="lc-bubble-line">' +
      text +
      '</span><button type="button" class="lc-bubble-speak" aria-label="' +
      t("flow.guidePlayAudio") +
      '">🔊</button></div></div>'
    );
  }

  function chipWordText(textObj) {
    if (!textObj) return "";
    var course = getLearnCourse();
    if (course === "zh") {
      return global.RNFQuestions && RNFQuestions.tUiField
        ? RNFQuestions.tUiField(textObj)
        : tf(textObj);
    }
    return tf(textObj);
  }

  PracticeEngine.prototype.renderWriteSentence = function (q) {
    var html =
      wordBankBubbleHtml(this, q) +
      '<div class="lc-sentence-area lc-sentence-area--write" id="sentenceArea"></div>' +
      '<div class="lc-word-bank lc-word-bank--write" id="wordBank"></div>';
    this._wordBankQ = q;
    return html;
  };

  function translatePromptText(q) {
    if (!q || !q.promptLine) return "";
    var pl = q.promptLine;
    var course = getLearnCourse();
    if (course === "zh") {
      return (
        tf({ hant: pl.hant, hans: pl.hans, en: pl.hant }) ||
        tf({ hant: pl.hans, hans: pl.hans, en: pl.hans }) ||
        tf(pl)
      );
    }
    if (global.RNFQuestions && RNFQuestions.cueTextForLearnForeign) {
      return RNFQuestions.cueTextForLearnForeign(pl);
    }
    return pl.hans || pl.hant || "";
  }

  function getLearnCourse() {
    try {
      return sessionStorage.getItem("learn_target") || "en";
    } catch (e) {
      return "en";
    }
  }

  function textChoiceCorrectLabel(q) {
    if (!q || !q.options) return "";
    for (var i = 0; i < q.options.length; i++) {
      if (q.options[i].correct) return tf(q.options[i].label);
    }
    return "";
  }

  function quotedFromPrompt(q, useUiPrompt) {
    var prompt = useUiPrompt ? uiTf(q.prompt) : tf(q.prompt);
    if (!prompt) return "";
    return extractQuotedKeyword(prompt);
  }

  function extractQuotedKeyword(text) {
    if (!text) return "";
    var m = text.match(/[「『]([^」』]+)[」』]/);
    if (m) return m[1].trim();
    m = text.match(/['"]([^'"]+)['"]/);
    return m ? m[1].trim() : "";
  }

  function promptLineDisplayText(q) {
    if (!q || !q.promptLine) return "";
    var pl = q.promptLine;
    if (typeof pl === "string") return pl;
    var course = getLearnCourse();
    if (course === "zh") {
      return (
        tf({ hant: pl.hant, hans: pl.hans, en: pl.hant }) ||
        tf({ hant: pl.hans, hans: pl.hans, en: pl.hans }) ||
        tf(pl)
      );
    }
    if (global.RNFQuestions && RNFQuestions.cueTextForLearnForeign) {
      return RNFQuestions.cueTextForLearnForeign(pl);
    }
    return pl.hans || pl.hant || pl.en || "";
  }

  /** 題幹裡夾英文提示（如 意思是「moon」的詞）→ 只朗讀引號內英文 */
  function keyForeignFromQuestion(q) {
    if (!q) return "";
    if (q.speakLine && q.speakLine.en) {
      var enOnly = (q.speakLine.en || "").trim();
      var hant = (q.speakLine.hant || "").trim();
      var hans = (q.speakLine.hans || "").trim();
      if (
        enOnly &&
        /^[A-Za-z0-9]/.test(enOnly) &&
        enOnly === hant &&
        enOnly === hans
      ) {
        return enOnly;
      }
    }
    var disp = "";
    if (q.bubbleLine) {
      disp =
        global.RNFQuestions && RNFQuestions.tUiField
          ? RNFQuestions.tUiField(q.bubbleLine)
          : tf(q.bubbleLine);
    } else if (q.promptLine) {
      disp = promptLineDisplayText(q);
    }
    if (!disp && q.prompt) {
      disp = uiTf(q.prompt) || tf(q.prompt);
    }
    var kw = extractQuotedKeyword(disp);
    if (kw) return kw;
    if (q.promptLine && q.promptLine.en && /^[A-Za-z]/.test(q.promptLine.en)) {
      return q.promptLine.en.trim();
    }
    return "";
  }

  function shouldSpeakKeyForeignOnly(q) {
    if (!q || getLearnCourse() !== "zh") return false;
    if (isTranslateChipQuestion(q)) return true;
    if (q.type === "text_choice" || q.type === "fill_pick") {
      return !!keyForeignFromQuestion(q);
    }
    return false;
  }

  /** 選詞題泡泡：學英語時只顯示中文詞，不從英文題幹抽出 goodbye 等答案 */
  function textChoiceBubbleText(q) {
    if (!q || q.type !== "text_choice") return "";
    if (q.bubbleLine) {
      return global.RNFQuestions && RNFQuestions.tUiField
        ? RNFQuestions.tUiField(q.bubbleLine)
        : tf(q.bubbleLine);
    }
    var course = getLearnCourse();
    if (course !== "zh") {
      if (q.promptLine && global.RNFQuestions && RNFQuestions.cueTextForLearnForeign) {
        return RNFQuestions.cueTextForLearnForeign(q.promptLine);
      }
      if (q.promptLine) return translatePromptText(q);
      return "";
    }
    if (q.promptLine) {
      return global.RNFQuestions && RNFQuestions.tUiField
        ? RNFQuestions.tUiField(q.promptLine)
        : tf(q.promptLine);
    }
    return quotedFromPrompt(q, true);
  }

  function textChoiceSpeakText(q) {
    if (!q || q.type !== "text_choice") return "";
    if (shouldSpeakKeyForeignOnly(q)) {
      var kw = keyForeignFromQuestion(q);
      if (kw) return kw;
    }
    if (q.speakLine && getLearnCourse() !== "zh") {
      return translatePromptText({ promptLine: q.speakLine });
    }
    if (q.speakLine) return tf(q.speakLine);
    return textChoiceBubbleText(q);
  }

  function questionSpeakText(q) {
    if (!q) return "";
    if (shouldSpeakKeyForeignOnly(q)) {
      var key = keyForeignFromQuestion(q);
      if (key) return key;
    }
    if (q.type === "listen_pick" && q.audioText) return tf(q.audioText);
    if (q.type === "text_choice") return textChoiceSpeakText(q);
    if (isTranslateChipQuestion(q)) return translatePromptText(q);
    if (
      q.type === "word_bank" &&
      !isTranslateChipQuestion(q) &&
      (isWriteSentenceQuestion(q) || isListenOnlyWordBank(q))
    ) {
      return wordBankSpeakText(q);
    }
    if (q.type === "translate_choice") return translatePromptText(q);
    if (q.speakLine && getLearnCourse() !== "zh") {
      return translatePromptText({ promptLine: q.speakLine });
    }
    if (q.speakLine) return tf(q.speakLine);
    if (q.promptLine && getLearnCourse() !== "zh") {
      return translatePromptText(q);
    }
    if (q.promptLine) return tf(q.promptLine);
    var prompt = tf(q.prompt);
    if (prompt) {
      var m = prompt.match(/[「『]([^」』]+)[」』]/);
      if (m) return m[1];
      m = prompt.match(/['"]([^'"]+)['"]/);
      if (m) return m[1];
    }
    return "";
  }

  function questionSpeakLang(q) {
    var course = getLearnCourse();
    if (shouldSpeakKeyForeignOnly(q) && keyForeignFromQuestion(q)) {
      return q.speakLang || "en-US";
    }
    if (
      course !== "zh" &&
      q &&
      (q.type === "translate_choice" || isTranslateChipQuestion(q))
    ) {
      return "zh-CN";
    }
    if (q && isListenOnlyWordBank(q)) {
      return q.speakLang || "en-US";
    }
    if (q && q.speakLang) return q.speakLang;
    if (q && q.type === "text_choice" && course !== "zh") {
      if (q.speakLang) return q.speakLang;
      return global.LCApp && LCApp.getChineseSpeechLang
        ? LCApp.getChineseSpeechLang()
        : "zh-CN";
    }
    if (global.LCApp && LCApp.getLearnSpeechLang) {
      return LCApp.getLearnSpeechLang(course);
    }
    return course === "zh" ? "zh-CN" : "en-US";
  }

  PracticeEngine.prototype.speakPromptLine = function (q) {
    if (!q) return;
    var text = questionSpeakText(q);
    if (!text) return;
    var lang = questionSpeakLang(q);
    var course = getLearnCourse();
    if (global.LCApp && LCApp.speakText) {
      LCApp.speakText(text, { lang: lang, course: course });
      return;
    }
    if (!global.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92;
    speechSynthesis.speak(u);
  };

  PracticeEngine.prototype.buildListenPick = function (q) {
    var self = this;
    var bank = this.root.querySelector("#listenBank");
    var slot = this.root.querySelector("#listenSlot");
    if (!bank || !slot || !q.chips) return;
    bank.innerHTML = "";
    slot.innerHTML = "";
    this._bankOrder = [];
    var chips = RNFQuestions.shuffle(q.chips);
    chips.forEach(function (chip, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lc-listen-chip lc-listen-chip--hue-" + (i % 5);
      btn.dataset.chipId = chip.id;
      if (chip.correct) btn.setAttribute("data-correct", "1");
      btn.innerHTML =
        '<span class="lc-listen-chip-key">' +
        (i + 1) +
        '</span><span class="lc-listen-chip-txt">' +
        tf(chip.text) +
        "</span>";
      btn.addEventListener("click", function () {
        if (btn.classList.contains("lc-listen-chip--placed")) return;
        bank.querySelectorAll(".lc-listen-chip").forEach(function (b) {
          b.classList.remove("selected");
        });
        slot.innerHTML = "";
        var placed = btn.cloneNode(true);
        placed.classList.add("lc-listen-chip--placed");
        placed.classList.remove("selected");
        slot.appendChild(placed);
        btn.classList.add("selected");
        self._bankOrder = [chip.id];
        self._selection = btn;
        self.setAction(true);
      });
      bank.appendChild(btn);
    });
  };

  PracticeEngine.prototype.bindListenAudio = function (q) {
    var self = this;
    this.root.querySelectorAll("[data-listen-rate]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var rate = btn.getAttribute("data-listen-rate");
        var text = questionSpeakText(q);
        if (!text) return;
        var lang = questionSpeakLang(q);
        if (global.LCApp && LCApp.speakText) {
          LCApp.speakText(text, {
            lang: lang,
            course: getLearnCourse(),
            rate: rate === "slow" ? 0.72 : 0.92,
          });
          return;
        }
        if (!global.speechSynthesis) return;
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate === "slow" ? 0.72 : 0.92;
        speechSynthesis.speak(u);
      });
    });
  };

  PracticeEngine.prototype.bindTranslateChipPick = function (q) {
    var self = this;
    this.root.querySelectorAll(".lc-opt-btn-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.root.querySelectorAll(".lc-opt-btn-chip").forEach(function (b) {
          b.classList.remove("selected");
        });
        btn.classList.add("selected");
        self._bankOrder = [btn.getAttribute("data-word-id")];
        self.setAction(true);
      });
    });
  };

  PracticeEngine.prototype.bindBubbleSpeak = function (q) {
    var btn = this.root.querySelector(".lc-bubble-speak");
    if (!btn) return;
    var self = this;
    btn.addEventListener("click", function () {
      self.speakPromptLine(q);
    });
  };

  PracticeEngine.prototype.bindQuizSpeak = function (q) {
    var btn = this.root.querySelector(".lc-quiz-speak");
    if (!btn) return;
    var self = this;
    btn.addEventListener("click", function () {
      self.speakPromptLine(q);
    });
  };

  PracticeEngine.prototype.maybeAutoSpeak = function (q) {
    if (!q || !questionSpeakText(q)) return;
    var self = this;
    window.setTimeout(function () {
      self.speakPromptLine(q);
    }, 450);
  };

  PracticeEngine.prototype.bindWriteSentenceSpeak = function (q) {
    this.bindBubbleSpeak(q);
  };

  PracticeEngine.prototype.wireInteractions = function (q) {
    var self = this;
    if (q.type === "listen_pick") {
      this.buildListenPick(q);
      this.bindListenAudio(q);
      return;
    }
    if (q.type === "word_bank") {
      if (isTranslateChipQuestion(q)) {
        this.bindTranslateChipPick(q);
        this.bindWriteSentenceSpeak(q);
        return;
      }
      this.buildWordBank(q);
      if (isWriteSentenceQuestion(q) || isListenOnlyWordBank(q)) {
        this.bindWriteSentenceSpeak(q);
      }
      return;
    }
    if (
      q.type === "text_choice" ||
      q.type === "translate_choice" ||
      isTranslateChipQuestion(q)
    ) {
      this.bindBubbleSpeak(q);
    }
    if (this.root.querySelector(".lc-quiz-speak")) {
      this.bindQuizSpeak(q);
    }
    if (q.type === "match_pairs") {
      this.wireMatchPairs(q);
      return;
    }
    if (q.type === "true_false") {
      this.root.querySelectorAll("[data-tf]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          self.root.querySelectorAll("[data-tf]").forEach(function (b) {
            b.classList.remove("selected");
          });
          btn.classList.add("selected");
          self._selection = btn.getAttribute("data-tf");
          self.setAction(true);
        });
      });
      return;
    }
    var sel =
      q.type === "emoji_pick"
        ? ".lc-pick-card"
        : ".lc-opt-btn[data-choice]";
    this.root.querySelectorAll(sel).forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.root.querySelectorAll(sel).forEach(function (b) {
          b.classList.remove("selected", "correct-pick", "wrong-pick");
        });
        btn.classList.add("selected");
        self._selection = btn;
        self.setAction(true);
      });
    });
  };

  PracticeEngine.prototype.wireMatchPairs = function (q) {
    var self = this;
    var st = this._matchState;
    if (!st) return;

    function updateCheckEnabled() {
      var canFinish =
        st.correctCount >= st.total || st.pairsDone >= st.total;
      self.setAction(canFinish);
    }

    function clearPending() {
      st.pendingLeft = null;
      st.pendingRight = null;
      self.root.querySelectorAll(".lc-match-btn.pending").forEach(function (b) {
        b.classList.remove("pending");
      });
    }

    function maybeFinishRound() {
      if (self.state.checked) return;
      if (st.correctCount < st.total && st.pairsDone < st.total) return;
      window.setTimeout(function () {
        if (!self._matchState || self.state.checked) return;
        if (st.correctCount < st.total && st.pairsDone < st.total) return;
        self.finishMatchPairsRound(q);
      }, 650);
    }

    function lockPair(leftEl, rightEl, correct) {
      st.pairsDone += 1;
      clearPending();
      if (correct) {
        st.correctCount += 1;
        [leftEl, rightEl].forEach(function (el) {
          el.classList.remove("match-glow", "pending", "wrong-pick");
          el.classList.add("matched");
        });
        updateCheckEnabled();
        maybeFinishRound();
        return;
      }
      leftEl.classList.add("wrong-pick");
      rightEl.classList.add("wrong-pick");
      setTimeout(function () {
        if (self.state.checked) return;
        leftEl.classList.remove("wrong-pick");
        rightEl.classList.remove("wrong-pick");
        updateCheckEnabled();
        maybeFinishRound();
      }, 520);
    }

    function tryPair() {
      if (!st.pendingLeft || !st.pendingRight) return;
      var leftEl = st.pendingLeft.el;
      var rightEl = st.pendingRight.el;
      var ok = st.pendingLeft.pairId === st.pendingRight.pairId;
      st.pendingLeft = null;
      st.pendingRight = null;
      if (ok) {
        [leftEl, rightEl].forEach(function (el) {
          el.classList.remove("pending");
          el.classList.add("match-glow");
        });
        setTimeout(function () {
          [leftEl, rightEl].forEach(function (el) {
            el.classList.remove("match-glow");
          });
          lockPair(leftEl, rightEl, true);
        }, 420);
        return;
      }
      leftEl.classList.add("wrong-pick");
      rightEl.classList.add("wrong-pick");
      setTimeout(function () {
        lockPair(leftEl, rightEl, false);
      }, 480);
    }

    this.root.querySelectorAll(".lc-match-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (
          self.state.checked ||
          btn.classList.contains("matched") ||
          btn.classList.contains("match-glow")
        ) {
          return;
        }
        var side = btn.getAttribute("data-side");
        var pairId = btn.getAttribute("data-pair-id");

        if (side === "left") {
          if (st.pendingLeft && st.pendingLeft.el === btn) {
            btn.classList.remove("pending");
            st.pendingLeft = null;
            return;
          }
          self.root.querySelectorAll('.lc-match-btn[data-side="left"].pending').forEach(function (b) {
            b.classList.remove("pending");
          });
          btn.classList.add("pending");
          st.pendingLeft = { pairId: pairId, el: btn };
          if (st.pendingRight) tryPair();
        } else {
          if (st.pendingRight && st.pendingRight.el === btn) {
            btn.classList.remove("pending");
            st.pendingRight = null;
            return;
          }
          self.root.querySelectorAll('.lc-match-btn[data-side="right"].pending').forEach(function (b) {
            b.classList.remove("pending");
          });
          btn.classList.add("pending");
          st.pendingRight = { pairId: pairId, el: btn };
          if (st.pendingLeft) tryPair();
        }
      });
    });
    updateCheckEnabled();
  };

  PracticeEngine.prototype.buildWordBank = function (q) {
    var self = this;
    var bank = this.root.querySelector("#wordBank");
    var area = this.root.querySelector("#sentenceArea");
    if (!bank || !area) return;
    bank.innerHTML = "";
    area.innerHTML = "";
    this._bankOrder = [];
    var words = RNFQuestions.shuffle(q.words);
    var writeStyle = isWriteSentenceQuestion(q);
    words.forEach(function (w) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "lc-word-chip" + (writeStyle ? " lc-word-chip--bank" : "");
      chip.dataset.id = w.id;
      chip.textContent = chipWordText(w.text);
      chip.addEventListener("click", function () {
        if (chip.classList.contains("used")) return;
        chip.classList.add("used");
        var inArea = chip.cloneNode(true);
        inArea.classList.remove("used");
        if (writeStyle) {
          inArea.classList.remove("lc-word-chip--bank");
          inArea.classList.add("lc-word-chip--placed");
        }
        inArea.addEventListener("click", function () {
          inArea.remove();
          chip.classList.remove("used");
          self._bankOrder = self._bankOrder.filter(function (id) {
            return id !== w.id;
          });
          self.setAction(self._bankOrder.length === q.answer.length);
        });
        area.appendChild(inArea);
        self._bankOrder.push(w.id);
        self.setAction(self._bankOrder.length === q.answer.length);
      });
      bank.appendChild(chip);
    });
  };

  PracticeEngine.prototype.finishMatchPairsRound = function (q) {
    if (!q || this.state.checked || !this._matchState) return;
    var st = this._matchState;
    var ok = st.correctCount === st.total;

    this.state.checked = true;
    this.state.answered += 1;
    if (ok) {
      this.state.correct += 1;
      this.state.streak += 1;
      this.state.xp += XP_PER_CORRECT + (this.state.streak >= 3 ? XP_STREAK_BONUS : 0);
      removeMistake(q);
    } else {
      this.state.streak = 0;
      saveMistake(q);
      if (this.state.lives > 0) this.state.lives -= 1;
      saveHearts(this.state.lives);
      if (global.document && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent("lc:heartschange"));
      }
    }

    this.recordResult(q, ok, false);
    this.publishScore(ok);

    this.root.querySelectorAll(".lc-match-btn").forEach(function (b) {
      b.disabled = true;
    });

    if (!ok && this.state.mode === "jump" && this.state.lives <= 0) {
      this.renderJumpTestFail();
      return;
    }

    this.showMatchResultFooter(ok, st.correctCount, st.total);
  };

  PracticeEngine.prototype.showMatchResultFooter = function (ok, correctN, totalN) {
    if (ok) {
      this.showTranslateCorrectFooter(this.current());
      return;
    }
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.remove("lc-lesson-result-correct");
    document.body.classList.add("lc-lesson-result-encourage");
    bar.classList.add("lc-footer-bar--result");

    bar.innerHTML =
      '<div class="lc-lesson-result-bar lc-lesson-result-bar--encourage">' +
      '<div class="lc-lesson-encourage-duo">' +
      '<div class="lc-lesson-encourage-mascot" data-frog-logo aria-hidden="true"></div>' +
      '<div class="lc-lesson-encourage-bubble">' +
      matchEncourageMessage(correctN, totalN) +
      "</div></div>" +
      '<button type="button" class="lc-btn-primary lc-lesson-result-cta lc-lesson-result-cta--green" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount(bar);

    this.btnAction = document.getElementById("btnAction");
    this.btnSkip = null;
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        document.body.classList.remove("lc-lesson-result-encourage");
        self.advance();
      };
    }
  };

  PracticeEngine.prototype.isCorrect = function (q) {
    if (q.type === "match_pairs") {
      if (!this._matchState) return false;
      return this._matchState.correctCount === this._matchState.total;
    }
    if (q.type === "word_bank") {
      if (this._bankOrder.length !== q.answer.length) return false;
      for (var i = 0; i < q.answer.length; i++) {
        if (this._bankOrder[i] !== q.answer[i]) return false;
      }
      return true;
    }
    if (q.type === "true_false") {
      return this._selection === this._tfCorrect;
    }
    if (!this._selection) return false;
    return this._selection.hasAttribute("data-correct");
  };

  PracticeEngine.prototype.checkAnswer = function () {
    var self = this;
    var q = this.current();
    if (!q) return;
    if (q.type === "word_bank") {
      if (this._bankOrder.length !== q.answer.length) {
        alert(t("flow.pickOption"));
        return;
      }
    } else if (q.type === "match_pairs") {
      var mst = this._matchState;
      if (
        !mst ||
        (mst.correctCount < mst.total && mst.pairsDone < mst.total)
      ) {
        alert(t("flow.matchAllFirst"));
        return;
      }
      if (this.state.checked) return;
      this.finishMatchPairsRound(q);
      return;
    } else if (!this._selection) {
      alert(t("flow.pickOption"));
      return;
    }

    var ok = this.isCorrect(q);
    this.state.checked = true;
    this.state.answered += 1;
    if (ok) {
      this.state.correct += 1;
      this.state.streak += 1;
      this.state.xp += XP_PER_CORRECT + (this.state.streak >= 3 ? XP_STREAK_BONUS : 0);
      removeMistake(q);
    } else {
      this.state.streak = 0;
      saveMistake(q);
      if (this.state.lives > 0) this.state.lives -= 1;
      saveHearts(this.state.lives);
      if (global.document && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent("lc:heartschange"));
      }
    }

    this.recordResult(q, ok, false);
    this.publishScore(ok);

    if (!ok && this.state.mode === "jump" && this.state.lives <= 0) {
      this.applyWrongAnswerVisuals(q);
      this.renderJumpTestFail();
      return;
    }

    if (
      !ok &&
      this.state.mode === "jump" &&
      this.state.lives === 1 &&
      (q.type === "translate_choice" || isWriteSentenceQuestion(q))
    ) {
      var self = this;
      this.applyWrongAnswerVisuals(q);
      this.showLastChanceFooter(function () {
        self.finishWrongAnswerFlow(q);
      });
      return;
    }

    if (q.type === "translate_choice") {
      if (this._selection && this._selection.classList) {
        this._selection.classList.add(ok ? "correct-pick" : "wrong-pick");
      }
      if (!ok) {
        this.root.querySelectorAll("[data-correct]").forEach(function (b) {
          b.classList.add("correct-pick");
        });
      }
      this.root.querySelectorAll(".lc-opt-btn-translate").forEach(function (b) {
        b.disabled = true;
      });
      this.showTranslateResultFooter(ok, q);
      return;
    }

    if (
      q.type === "emoji_pick" ||
      q.type === "text_choice" ||
      isListenPickQuestion(q)
    ) {
      if (this._selection && this._selection.classList) {
        this._selection.classList.add(ok ? "correct-pick" : "wrong-pick");
      }
      if (!ok) {
        this.root.querySelectorAll("[data-correct]").forEach(function (b) {
          b.classList.add("correct-pick");
        });
      }
      this.root
        .querySelectorAll(
          ".lc-pick-card, .lc-opt-btn[data-choice], .lc-listen-chip"
        )
        .forEach(function (b) {
          b.disabled = true;
        });
      this.showTranslateResultFooter(ok, q);
      return;
    }

    if (isWriteSentenceQuestion(q)) {
      lockWriteSentenceChips(this.root, ok);
      if (ok) {
        this.showWriteSentenceCorrectFooter();
      } else {
        this.showWriteSentenceWrongFooter(q);
      }
      return;
    }

    if (isTranslateChipQuestion(q)) {
      var chipSel = this.root.querySelector(".lc-opt-btn-chip.selected");
      if (chipSel) chipSel.classList.add(ok ? "correct-pick" : "wrong-pick");
      if (!ok) {
        this.root.querySelectorAll(".lc-opt-btn-chip[data-correct]").forEach(function (b) {
          b.classList.add("correct-pick");
        });
      }
      this.root.querySelectorAll(".lc-opt-btn-chip").forEach(function (b) {
        b.disabled = true;
      });
      this.showTranslateResultFooter(ok, q);
      return;
    }

    if (q.type === "true_false") {
      this.root.querySelectorAll("[data-tf]").forEach(function (b) {
        b.disabled = true;
        if (b.getAttribute("data-tf") === self._tfCorrect) {
          b.classList.add("correct-pick");
        } else if (b.classList.contains("selected")) {
          b.classList.add("wrong-pick");
        }
      });
      this.showTrueFalseResultFooter(ok, q);
      return;
    }

    var fb = this.root.querySelector("#engineFeedback");
    var icon = this.root.querySelector("#engineFbIcon");
    var title = this.root.querySelector("#engineFbTitle");
    if (fb) {
      fb.classList.add("show", ok ? "ok" : "bad");
      if (icon) icon.textContent = ok ? "✓" : "✗";
      if (title) title.textContent = ok ? t("flow.correctFbShort") : t("flow.wrongTry");
    }

    if (this._selection && this._selection.classList) {
      this._selection.classList.add(ok ? "correct-pick" : "wrong-pick");
    }
    if (!ok && q.type !== "word_bank" && q.type !== "match_pairs") {
      this.root.querySelectorAll("[data-correct]").forEach(function (b) {
        b.classList.add("correct-pick");
      });
    }

    this.setAction(true, t("flow.continue"));
  };

  PracticeEngine.prototype.advance = function () {
    if (this.state.mode === "jump" && this.state.lives <= 0) {
      this.renderJumpTestFail();
      return;
    }
    this.resetLessonFooter();
    this.state.index += 1;
    if (this.state.index >= this.state.queue.length) {
      this.renderComplete();
    } else {
      this.renderCurrent();
    }
  };

  PracticeEngine.prototype.skipQuestion = function () {
    var q = this.current();
    if (q) {
      saveMistake(q);
      this.recordResult(q, false, true);
    }
    this.state.answered += 1;
    this.state.streak = 0;
    this.publishScore(false);
    this.advance();
  };

  PracticeEngine.prototype.renderGradeReport = function (report) {
    var self = this;
    var data = report || {
      correct: this.state.correct,
      answered: this.state.answered,
      total: this.state.queue.length,
      xp: this.state.xp,
      results: this.state.results,
    };
    var results = data.results || [];
    var acc =
      data.answered > 0
        ? Math.round((data.correct / data.answered) * 100)
        : 0;

    var tiles = "";
    results.forEach(function (r, i) {
      var cls = r.correct ? "ok" : "bad";
      var icon = r.correct ? "✓" : "✗";
      if (r.skipped) icon = "—";
      tiles +=
        '<button type="button" class="lc-grade-tile ' +
        cls +
        '" data-grade-idx="' +
        i +
        '">' +
        '<span class="lc-grade-mark" aria-hidden="true">' +
        icon +
        "</span>" +
        '<span class="lc-grade-tile-num">' +
        r.index +
        "</span>" +
        '<span class="lc-grade-tile-txt">' +
        (r.title || "") +
        "</span></button>";
    });

    this.root.innerHTML =
      '<div class="lc-grade-report">' +
      '<button type="button" class="lc-grade-close" id="gradeClose" aria-label="Close">✕</button>' +
      "<h2 class=\"lc-grade-title\">" +
      t("flow.gradeTitle") +
      "</h2>" +
      "<p class=\"lc-grade-hint\">" +
      t("flow.gradeHint") +
      "</p>" +
      '<p class="lc-grade-summary">' +
      t("flow.gradeSummary", {
        correct: data.correct,
        total: data.total,
        acc: acc,
      }) +
      "</p>" +
      '<div class="lc-grade-grid">' +
      tiles +
      "</div>" +
      '<div class="lc-grade-detail" id="gradeDetail" hidden></div>' +
      '<div class="lc-complete-actions">' +
      '<button type="button" class="lc-btn-primary lc-btn-block" id="gradeBackComplete">' +
      t("flow.gradeBackSummary") +
      "</button>" +
      '<a class="lc-btn-ghost lc-btn-block" href="lesson.html">' +
      t("flow.continuePractice") +
      "</a>" +
      "</div></div>";

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(false);

    var closeBtn = document.getElementById("gradeClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        if (!self._fromStorage && self.state.queue && self.state.queue.length) {
          self.renderComplete();
        } else {
          location.href = "learn.html";
        }
      });
    }
    var backBtn = document.getElementById("gradeBackComplete");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (!self._fromStorage && self.state.queue && self.state.queue.length) {
          self.renderComplete();
        } else {
          location.href = "lesson.html";
        }
      });
    }

    this.root.querySelectorAll("[data-grade-idx]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-grade-idx"), 10);
        var r = results[i];
        var detail = document.getElementById("gradeDetail");
        if (!detail || !r) return;
        detail.hidden = false;
        detail.innerHTML =
          '<div class="lc-grade-detail-card ' +
          (r.correct ? "ok" : "bad") +
          '">' +
          "<h3>" +
          t("flow.gradeDetail", { n: r.index }) +
          "</h3>" +
          "<p class=\"lc-grade-detail-prompt\">" +
          (r.fullPrompt || r.title) +
          "</p>" +
          "<p class=\"lc-grade-detail-status\">" +
          (r.skipped
            ? t("flow.gradeSkipped")
            : r.correct
              ? t("flow.gradeCorrect")
              : t("flow.gradeWrong")) +
          "</p></div>";
        detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  };

  PracticeEngine.prototype.renderUnlockScore = function () {
    var self = this;
    var total = this.state.queue.length;
    var correct = this.state.correct;
    var tier = computeScoreTier(correct, total);
    var lang = learnLangLabel();
    var percent = total ? Math.round((correct / total) * 100) : 0;
    saveSessionReport(this.state);

    this.root.innerHTML =
      '<div class="lc-unlock-screen">' +
      '<div class="lc-unlock-stage">' +
      '<div class="lc-unlock-pedestal" aria-hidden="true"></div>' +
      '<div class="lc-unlock-frog" data-frog-logo aria-hidden="true"></div>' +
      "</div>" +
      '<div class="lc-unlock-lang">' +
      lang +
      "</div>" +
      '<div class="lc-unlock-score-num" aria-hidden="true">' +
      tier +
      "</div>" +
      '<p class="lc-unlock-tier-lbl">' +
      t("flow.scoreTierLabel", { tier: tier, max: 5 }) +
      "</p>" +
      '<p class="lc-unlock-session">' +
      t("flow.scoreSessionResult", {
        correct: correct,
        total: total,
        percent: percent,
      }) +
      "</p>" +
      "<p class=\"lc-unlock-msg\">" +
      t("flow.scoreUnlocked", { lang: lang }) +
      "</p></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        try {
          localStorage.setItem(unlockStorageKey(), String(tier));
        } catch (e) {}
        self._unlockTier = tier;
        try {
          if (!localStorage.getItem(explainStorageKey())) {
            self.renderScoreExplain(tier);
            return;
          }
        } catch (e2) {}
        proceedAfterStreak(self);
      };
    }
    this.onProgress(100);
    this.publishScore(false);
  };

  PracticeEngine.prototype.renderScoreExplain = function (tier) {
    var self = this;
    var s = this.state;
    var lang = learnLangLabel();
    var tierNum = tier || 1;
    var nextTier = Math.min(5, tierNum + 1);
    var acc = s.queue.length ? Math.round((s.correct / s.queue.length) * 100) : 0;
    var barPct = Math.min(42, Math.max(18, Math.round(acc * 0.4)));

    this.root.innerHTML =
      '<div class="lc-score-explain">' +
      '<div class="lc-score-explain-head">' +
      '<span class="lc-score-explain-icon" data-frog-logo aria-hidden="true"></span>' +
      '<span class="lc-score-explain-tier">' +
      tierNum +
      "</span></div>" +
      '<div class="lc-score-ladder">' +
      '<span class="lc-ladder-label">' +
      tierNum +
      "</span>" +
      '<div class="lc-ladder-track">' +
      '<div class="lc-ladder-fill" style="width:' +
      barPct +
      '%"></div></div>' +
      '<span class="lc-ladder-label">' +
      nextTier +
      "</span></div>" +
      "<p class=\"lc-score-explain-text\">" +
      t("flow.scoreExplain", { lang: lang }) +
      "</p></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        try {
          localStorage.setItem(explainStorageKey(), "1");
        } catch (e) {}
        proceedAfterStreak(self);
      };
    }
    this.onProgress(100);
  };

  PracticeEngine.prototype.renderJumpTestFail = function () {
    var self = this;
    var part = this._jumpPart || getJumpTestPart();
    var gemNote = "";
    if (global.RNFPathProgress && RNFPathProgress.onJumpFail) {
      var failGems = RNFPathProgress.onJumpFail();
      gemNote =
        '<p class="lc-jump-fail-gems' +
        (failGems.saved ? " saved" : "") +
        '">' +
        t(failGems.rewardKey || "flow.pathGemJumpFail", {
          n: Math.abs(failGems.gems || 3),
        }) +
        "</p>";
    }

    saveSessionReport(this.state);
    this.resetLessonFooter();
    document.body.classList.add("lc-jump-fail-page");
    document.body.classList.remove(
      "lc-lesson-result-wrong",
      "lc-lesson-result-correct",
      "lc-lesson-result-encourage",
      "lc-lesson-last-chance",
      "lc-streak-unit-page"
    );

    this.root.innerHTML =
      '<div class="lc-jump-fail-screen">' +
      '<div class="lc-jump-fail-stage" aria-hidden="true">' +
      '<div class="lc-jump-fail-ground"></div>' +
      '<div class="lc-jump-fail-frog" data-frog-logo></div>' +
      "</div>" +
      '<p class="lc-jump-fail-msg">' +
      jumpTestFailMsgText(part) +
      "</p>" +
      gemNote +
      "</div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    this.showStreakUnitFooter(
      function () {
        document.body.classList.remove("lc-jump-fail-page", "lc-streak-unit-page");
        var bar = self._footerBar || document.querySelector(".lc-footer-bar");
        if (bar) bar.classList.remove("lc-footer-bar--streak-unit");
        self.resetLessonFooter();
        location.href = "learn.html";
      },
      function () {
        location.href = "lesson.html?view=grade";
      }
    );
    this.onProgress(100);
    this.publishScore(false);
  };

  PracticeEngine.prototype.showStreakUnitFooter = function (onContinue, onReview) {
    var self = this;
    var bar = this._footerBar || document.querySelector(".lc-footer-bar");
    if (!bar) return;

    document.body.classList.add("lc-streak-unit-page");
    document.body.classList.remove(
      "lc-lesson-result-wrong",
      "lc-lesson-result-correct",
      "lc-lesson-result-encourage",
      "lc-lesson-last-chance"
    );
    bar.classList.add("lc-footer-bar--streak-unit");

    bar.innerHTML =
      '<div class="lc-streak-unit-footer">' +
      '<button type="button" class="lc-streak-unit-review" id="btnStreakReview">' +
      t("flow.reviewThisUnit") +
      "</button>" +
      '<button type="button" class="lc-btn-primary lc-streak-unit-continue" id="btnAction">' +
      t("flow.continue") +
      "</button></div>";

    this.btnSkip = null;
    this.btnAction = document.getElementById("btnAction");
    var reviewBtn = document.getElementById("btnStreakReview");
    if (reviewBtn) {
      reviewBtn.onclick = function () {
        if (typeof onReview === "function") onReview();
        else location.href = "lesson.html?view=grade";
      };
    }
    if (this.btnAction) {
      this.btnAction.disabled = false;
      this.btnAction.onclick = function () {
        if (typeof onContinue === "function") onContinue();
      };
    }
  };

  PracticeEngine.prototype.renderStreakCelebrate = function (count) {
    var self = this;
    var streak = count || 1;
    var tomorrow = streak + 1;
    var days = streakWeekRow();
    var dayHtml = "";
    days.forEach(function (d) {
      var dotInner = "";
      if (d.state === "done") dotInner = "✓";
      dayHtml +=
        '<div class="lc-streak-day' +
        (d.highlight ? " highlight" : "") +
        '">' +
        '<span class="lc-streak-day-lbl">' +
        d.label +
        "</span>" +
        '<span class="lc-streak-dot lc-streak-dot--' +
        d.state +
        '">' +
        dotInner +
        "</span></div>";
    });

    this.root.innerHTML =
      '<div class="lc-streak-screen lc-streak-screen--unit">' +
      '<h1 class="lc-streak-unit-headline">' +
      t("flow.streakTomorrowTitle", { n: tomorrow }) +
      "</h1>" +
      '<div class="lc-streak-campfire" aria-hidden="true">' +
      '<div class="lc-streak-campfire-ground"></div>' +
      '<div class="lc-streak-campfire-figures">' +
      '<span class="lc-streak-campfire-frog" data-frog-logo></span>' +
      '<div class="lc-streak-campfire-fire">' +
      '<span class="lc-streak-campfire-log lc-streak-campfire-log--l"></span>' +
      '<span class="lc-streak-campfire-log lc-streak-campfire-log--r"></span>' +
      '<span class="lc-streak-campfire-flame"></span>' +
      "</div></div></div>" +
      '<div class="lc-streak-card">' +
      '<div class="lc-streak-days">' +
      dayHtml +
      "</div>" +
      '<p class="lc-streak-tip">' +
      t("flow.streakWarmTip") +
      "</p></div></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    this.showStreakUnitFooter(
      function () {
        document.body.classList.remove("lc-streak-unit-page");
        var bar = self._footerBar || document.querySelector(".lc-footer-bar");
        if (bar) bar.classList.remove("lc-footer-bar--streak-unit");
        self.resetLessonFooter();
        try {
          localStorage.setItem(streakUiKey(), "1");
        } catch (e) {}
        proceedAfterStreak(self);
      },
      function () {
        location.href = "lesson.html?view=grade";
      }
    );
    this.onProgress(100);
  };

  PracticeEngine.prototype.renderStreakGoals = function () {
    var self = this;
    var selected = 7;
    var rows = "";
    STREAK_MILESTONES.forEach(function (item) {
      rows +=
        '<button type="button" class="lc-goal-row' +
        (item.days === selected ? " selected" : "") +
        '" data-days="' +
        item.days +
        '">' +
        '<span class="lc-goal-days">' +
        t("flow." + item.m) +
        "</span>" +
        '<span class="lc-goal-rank">' +
        t("flow." + item.r) +
        "</span></button>";
    });

    this.root.innerHTML =
      '<div class="lc-streak-goals">' +
      '<div class="lc-goal-bubble">' +
      streakGoalBubbleHtml() +
      "</div>" +
      '<div class="lc-goal-hero" aria-hidden="true">' +
      '<div class="lc-goal-calendar">' +
      '<span class="lc-goal-cal-num">' +
      selected +
      "</span>" +
      '<span class="lc-goal-cal-flame">🔥</span>' +
      "</div>" +
      '<div class="lc-goal-frog-wrap" data-frog-logo></div>' +
      "</div>" +
      '<div class="lc-goal-list">' +
      rows +
      "</div></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    this.root.querySelectorAll(".lc-goal-row").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selected = parseInt(btn.getAttribute("data-days"), 10) || 7;
        updateStreakGoalPick(self, selected);
      });
    });

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        try {
          localStorage.setItem(streakGoalsKey(), String(selected));
        } catch (e) {}
        proceedToFinish(self);
      };
    }
    this.onProgress(100);
  };

  PracticeEngine.prototype.animateDailyQuestFill = function (start, end, max) {
    var fill = this.root.querySelector(".lc-daily-quest-fill");
    var prog = this.root.querySelector(".lc-daily-quest-progress");
    if (!fill || !prog || !max) return;

    var from = Math.max(0, Math.min(start, max));
    var to = Math.max(from, Math.min(end, max));
    var duration = 1500;
    var t0 = null;

    function easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    function frame(ts) {
      if (!t0) t0 = ts;
      var elapsed = ts - t0;
      var p = Math.min(1, elapsed / duration);
      var val = Math.round(from + (to - from) * easeOutCubic(p));
      var pct = (val / max) * 100;
      fill.style.width = pct + "%";
      prog.textContent = val + " / " + max;
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        fill.style.width = (to / max) * 100 + "%";
        prog.textContent = to + " / " + max;
        fill.classList.add("lc-daily-quest-fill--done");
      }
    }

    requestAnimationFrame(frame);
  };

  PracticeEngine.prototype.renderDailyQuestComplete = function (current, goal, sessionXp) {
    var self = this;
    var max = goal || DAILY_XP_GOAL;
    var end = Math.min(current != null ? current : max, max);
    var gained = sessionXp || 0;
    var start = Math.max(0, end - gained);

    this.root.innerHTML =
      '<div class="lc-daily-done">' +
      '<h2 class="lc-daily-done-title">' +
      t("flow.dailyLessonDone") +
      "</h2>" +
      '<div class="lc-daily-quest-card">' +
      '<div class="lc-daily-quest-head">' +
      '<span class="lc-daily-quest-bolt" aria-hidden="true">⚡</span>' +
      '<span class="lc-daily-quest-label">' +
      t("flow.dailyXpTask", { n: max }) +
      "</span></div>" +
      '<div class="lc-daily-quest-track-wrap">' +
      '<div class="lc-daily-quest-track">' +
      '<div class="lc-daily-quest-fill lc-daily-quest-fill--animate" style="width:0%"></div>' +
      '<span class="lc-daily-quest-progress">' +
      start +
      " / " +
      max +
      "</span></div>" +
      '<span class="lc-daily-quest-chest" aria-hidden="true"></span>' +
      "</div></div></div>";

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.disabled = true;
      this.btnAction.classList.add("lc-btn--waiting");
      setTimeout(function () {
        if (self.btnAction) {
          self.btnAction.disabled = false;
          self.btnAction.classList.remove("lc-btn--waiting");
        }
      }, 1550);
      this.btnAction.onclick = function () {
        self.renderGemReward(DAILY_GEM_REWARD);
      };
    }
    this.onProgress(100);

    var runAnim = function () {
      self.animateDailyQuestFill(start, end, max);
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(runAnim);
    } else {
      setTimeout(runAnim, 50);
    }
  };

  PracticeEngine.prototype.renderPathGemReward = function (amount, subKey, onContinue) {
    var self = this;
    var n = amount || 0;
    var gems = "";
    for (var i = 0; i < Math.min(n, 6); i++) {
      gems += '<span class="lc-gem-piece"></span>';
    }
    var sub = subKey ? t(subKey) : t("flow.pathGemDefaultSub");

    this.root.innerHTML =
      '<div class="lc-gem-reward lc-gem-reward--path">' +
      '<div class="lc-gem-reward-stage" aria-hidden="true">' +
      '<div class="lc-gem-sparkles"><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="lc-gem-chest-open">' +
      '<div class="lc-gem-chest-lid"></div>' +
      '<div class="lc-gem-chest-body">' +
      gems +
      "</div></div>" +
      '<div class="lc-gem-shadow"></div></div>' +
      '<h2 class="lc-gem-reward-title">' +
      t("flow.gemEarned", { n: n }) +
      "</h2>" +
      '<p class="lc-gem-reward-sub">' +
      sub +
      "</p></div>";

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        if (typeof onContinue === "function") onContinue();
      };
    }
    this.onProgress(100);
    if (global.document && document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent("lc:heartschange"));
    }
  };

  PracticeEngine.prototype.renderDrillFail = function (pathResult) {
    var self = this;
    this.resetLessonFooter();
    this.root.innerHTML =
      '<div class="lc-complete lc-drill-fail">' +
      '<div class="lc-complete-hero">🌧️😅</div>' +
      '<h2 class="lc-complete-title">' +
      t(pathResult.rewardKey || "flow.pathDrillFail") +
      "</h2>" +
      '<p class="lc-complete-sub">' +
      t("flow.pathDrillFailSub") +
      "</p>" +
      '<a class="lc-btn-primary lc-btn-block" href="learn.html">' +
      t("flow.backToLearnHub") +
      "</a></div>";
    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(false);
    this.onProgress(100);
  };

  PracticeEngine.prototype.renderGemReward = function (amount) {
    var self = this;
    var n = amount || DAILY_GEM_REWARD;
    var gems = "";
    for (var i = 0; i < Math.min(n, 6); i++) {
      gems += '<span class="lc-gem-piece"></span>';
    }

    this.root.innerHTML =
      '<div class="lc-gem-reward">' +
      '<div class="lc-gem-reward-stage" aria-hidden="true">' +
      '<div class="lc-gem-sparkles"><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="lc-gem-chest-open">' +
      '<div class="lc-gem-chest-lid"></div>' +
      '<div class="lc-gem-chest-body">' +
      gems +
      "</div></div>" +
      '<div class="lc-gem-shadow"></div></div>' +
      '<h2 class="lc-gem-reward-title">' +
      t("flow.gemEarned", { n: n }) +
      "</h2>" +
      '<p class="lc-gem-reward-sub">' +
      t("flow.gemDailySub") +
      "</p></div>";

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        var data = loadDailyQuest();
        data.celebrated = true;
        saveDailyQuest(data);
        addGems(n);
        proceedAfterRewards(self);
      };
    }
    this.onProgress(100);
  };

  PracticeEngine.prototype.renderHeartReward = function (count) {
    var self = this;
    var n = count || MAX_HEARTS;
    var hearts = "";
    for (var i = 0; i < MAX_HEARTS; i++) {
      hearts +=
        '<span class="lc-heart-icon' + (i < n ? " full" : " empty") + '"></span>';
    }

    this.root.innerHTML =
      '<div class="lc-heart-reward">' +
      '<div class="lc-heart-row" aria-hidden="true">' +
      hearts +
      "</div>" +
      '<h2 class="lc-heart-reward-title">' +
      t("flow.heartEarned") +
      "</h2>" +
      '<p class="lc-heart-reward-sub">' +
      t("flow.heartNeed") +
      "</p></div>";

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(true, t("flow.continue"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        proceedToComplete(self);
      };
    }
    this.onProgress(100);
  };

  PracticeEngine.prototype.renderProfilePrompt = function () {
    var self = this;

    this.root.innerHTML =
      '<div class="lc-profile-prompt">' +
      '<div class="lc-profile-hero" aria-hidden="true">' +
      '<div class="lc-profile-confetti"><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="lc-profile-stage">' +
      '<div class="lc-profile-frog" data-frog-logo></div>' +
      '<div class="lc-profile-phone">' +
      '<span class="lc-profile-phone-screen">' +
      '<span class="lc-profile-dot d1"></span>' +
      '<span class="lc-profile-dot d2"></span>' +
      '<span class="lc-profile-dot d3"></span>' +
      "</span></div></div></div>" +
      '<h2 class="lc-profile-title">' +
      t("flow.profileCreateTitle") +
      "</h2>" +
      '<p class="lc-profile-desc">' +
      t("flow.profileCreateDesc") +
      "</p></div>";

    if (global.RNFFrogLogo) RNFFrogLogo.mount();

    if (this.btnSkip) {
      this.btnSkip.classList.remove("lc-hidden");
      this.btnSkip.textContent = t("flow.profileLater");
      this.btnSkip.onclick = function () {
        deferProfilePrompt();
        proceedToComplete(self);
      };
    }
    this.setAction(true, t("flow.profileCreate"));
    if (this.btnAction) {
      this.btnAction.onclick = function () {
        try {
          sessionStorage.setItem("rnf_profile_return", "lesson.html");
          sessionStorage.setItem("rnf_setup_flow", "profile");
        } catch (e) {}
        location.href = "setup.html?flow=profile";
      };
    }
    this.onProgress(100);
  };

  function saveLessonFinishForHub(state, acc) {
    try {
      sessionStorage.setItem(
        "rnf_lesson_just_finished",
        JSON.stringify({
          correct: state.correct,
          answered: state.answered,
          total: state.queue ? state.queue.length : 0,
          xp: state.xp,
          acc: acc,
          ts: Date.now(),
        })
      );
    } catch (e) {}
  }

  PracticeEngine.prototype.renderCompleteSummary = function () {
    var s = this.state;
    var acc =
      s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0;
    var mistakes = loadMistakes();
    var self = this;

    saveLessonFinishForHub(s, acc);

    this.root.innerHTML =
      '<div class="lc-complete">' +
      '<div class="lc-complete-hero">🌧️🐸✨</div>' +
      '<h2 class="lc-complete-title">' +
      t("flow.unitComplete") +
      "</h2>" +
      '<p class="lc-complete-sub">' +
      (acc >= 80 ? t("flow.greatJob") : t("flow.keepGoing")) +
      "</p>" +
      '<div class="lc-stat-grid lc-stat-grid--complete">' +
      '<div class="lc-stat-card">' +
      '<span class="lc-stat-val">' +
      '<span class="lc-stat-num">' +
      s.correct +
      "</span></span>" +
      '<span class="lc-stat-lbl">' +
      t("flow.correctCount") +
      "</span></div>" +
      '<div class="lc-stat-card">' +
      '<span class="lc-stat-val">' +
      '<span class="lc-stat-num">' +
      acc +
      '</span><span class="lc-stat-unit">%</span></span>' +
      '<span class="lc-stat-lbl">' +
      t("flow.accuracy") +
      "</span></div>" +
      '<div class="lc-stat-card lc-stat-xp">' +
      '<span class="lc-stat-val">' +
      '<span class="lc-stat-unit">+</span>' +
      '<span class="lc-stat-num">' +
      s.xp +
      "</span></span>" +
      '<span class="lc-stat-lbl">' +
      t("flow.xpBonus") +
      "</span></div>" +
      "</div>" +
      '<div class="lc-complete-actions">' +
      '<a class="lc-btn-primary lc-btn-block lc-btn-learn-hub" href="learn.html">' +
      t("flow.backToLearnHub") +
      "</a>" +
      '<a class="lc-btn-primary lc-btn-block" href="lesson.html">' +
      t("flow.continuePractice") +
      "</a>" +
      (mistakes.length
        ? '<a class="lc-btn-ghost lc-btn-block lc-btn-review-mistakes" href="lesson.html?mode=review" title="' +
          t("flow.reviewMistakesHint") +
          '">' +
          t("flow.reviewMistakes") +
          "</a>"
        : "") +
      '<a class="lc-btn-ghost lc-btn-block" href="home.html">' +
      t("flow.backHome") +
      "</a>" +
      "</div></div>";

    if (this.btnSkip) this.btnSkip.classList.add("lc-hidden");
    this.setAction(false);
    this.onProgress(100);
    this.publishScore(false);
    this._lastCompleteHtml = true;

    if (this.btnAction) {
      this.btnAction.onclick = null;
    }
  };

  PracticeEngine.prototype.renderComplete = function () {
    var self = this;
    var s = this.state;
    var acc =
      s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0;

    this.resetLessonFooter();
    saveSessionReport(s);

    if (s.mode === "jump") {
      var jumpResult =
        global.RNFPathProgress && RNFPathProgress.onLessonComplete
          ? RNFPathProgress.onLessonComplete({
              mode: "jump",
              success: true,
              acc: acc,
            })
          : null;
      if (jumpResult && jumpResult.success && jumpResult.gems > 0) {
        this.renderPathGemReward(jumpResult.gems, jumpResult.rewardKey, function () {
          location.href = "learn.html";
        });
        return;
      }
      location.href = "learn.html";
      return;
    }

    if (global.LCApp && LCApp.incrementUnitsCompleted) {
      LCApp.incrementUnitsCompleted();
    }

    var pathResult = null;
    if (global.RNFPathProgress && s.mode !== "review") {
      pathResult = RNFPathProgress.onLessonComplete({
        mode: s.mode,
        acc: acc,
        success: true,
      });
    }

    if (pathResult && pathResult.passed === false) {
      this.renderDrillFail(pathResult);
      return;
    }

    function afterPathReward() {
      try {
        if (!localStorage.getItem(unlockStorageKey())) {
          self.renderUnlockScore();
          return;
        }
      } catch (e) {}
      finishSessionFlow(self);
    }

    if (pathResult && pathResult.gems > 0) {
      this.renderPathGemReward(pathResult.gems, pathResult.rewardKey, afterPathReward);
      return;
    }

    afterPathReward();
  };

  PracticeEngine.renderGradeFromStorage = function (root) {
    var data = loadLastSession();
    if (!data || !data.results || !data.results.length) {
      root.innerHTML =
        '<div class="lc-complete"><p class="lc-quiz-q">' +
        t("flow.gradeEmpty") +
        '</p><a class="lc-btn-primary lc-btn-block" href="lesson.html">' +
        t("flow.continuePractice") +
        "</a></div>";
      return;
    }
    var stub = {
      root: root,
      state: data,
      btnSkip: null,
      btnAction: null,
      _fromStorage: true,
    };
    PracticeEngine.prototype.renderGradeReport.call(stub, data);
  };

  global.RNFPractice = {
    PracticeEngine: PracticeEngine,
    loadMistakes: loadMistakes,
    loadLastSession: loadLastSession,
    renderGradeFromStorage: PracticeEngine.renderGradeFromStorage,
    SESSION_SIZE: SESSION_SIZE,
  };
})(window);

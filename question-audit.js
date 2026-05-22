/**
 * 題庫品質檢查（瀏覽器：先載入 questions.js / question-generator.js）
 */
(function (global) {
  function norm(s) {
    return (s || "").replace(/^🔊\s*/, "").trim().toLowerCase();
  }

  function labelText(label) {
    if (!label) return "";
    return label.en || label.hans || label.hant || "";
  }

  function countCorrectOptions(q) {
    if (!q || !q.options) return -1;
    var n = 0;
    q.options.forEach(function (o) {
      if (o.correct) n += 1;
    });
    return n;
  }

  function validateQuestion(q) {
    var issues = [];
    if (!q || !q.id) {
      issues.push("missing_id");
      return issues;
    }

    var choiceTypes = {
      text_choice: 1,
      translate_choice: 1,
      emoji_pick: 1,
      fill_pick: 1,
      listen_pick: 1,
    };
    if (choiceTypes[q.type]) {
      var n = countCorrectOptions(q);
      if (n !== 1) issues.push("need_one_correct_option:" + n);
    }

    if (q.type === "emoji_pick") {
      var seenEmoji = {};
      (q.options || []).forEach(function (o) {
        var em = o.emoji || "";
        if (!em) return;
        if (seenEmoji[em]) issues.push("duplicate_emoji:" + em);
        seenEmoji[em] = true;
      });
    }

    if (q.type === "true_false" && q.correct !== true && q.correct !== false) {
      issues.push("true_false_missing_correct");
    }

    if (q.type === "word_bank") {
      if (!q.words || !q.words.length) issues.push("word_bank_no_words");
      if (!q.answer || !q.answer.length) issues.push("word_bank_no_answer");
      var ids = {};
      (q.words || []).forEach(function (w) {
        if (w.id) ids[w.id] = true;
      });
      (q.answer || []).forEach(function (aid) {
        if (!ids[aid]) issues.push("answer_id_missing:" + aid);
      });
      var correctWords = (q.words || []).filter(function (w) {
        return (
          q.answer &&
          q.answer.indexOf(w.id) >= 0 &&
          !w.distractor
        );
      });
      if (correctWords.length !== q.answer.length) {
        issues.push("answer_distractor_overlap");
      }
    }

    if (q.type === "text_choice" || q.type === "translate_choice") {
      var correct = "";
      (q.options || []).forEach(function (o) {
        if (o.correct) correct = norm(labelText(o.label));
      });
      if (correct && q.promptLine) {
        var pl = norm(q.promptLine.en || q.promptLine.hans || q.promptLine.hant);
        if (pl && pl === correct) issues.push("spoiler_promptLine_equals_answer");
      }
      var seenOpt = {};
      (q.options || []).forEach(function (o) {
        var key = norm(labelText(o.label));
        if (!key) return;
        if (seenOpt[key]) issues.push("duplicate_option:" + key);
        seenOpt[key] = true;
      });
    }

    if (q.type === "match_pairs" && q.pairs && global.RNFQuestions) {
      var course =
        (q.courses && q.courses[0]) || (q.course) || "en";
      var seenL = {};
      var seenR = {};
      q.pairs.forEach(function (p) {
        var lk = norm(RNFQuestions.matchSideDisplayText(p, course, "left"));
        var rk = norm(RNFQuestions.matchSideDisplayText(p, course, "right"));
        if (lk && seenL[lk]) issues.push("duplicate_match_left:" + lk);
        if (rk && seenR[rk]) issues.push("duplicate_match_right:" + rk);
        if (lk) seenL[lk] = true;
        if (rk) seenR[rk] = true;
      });
      if (q.pairs.length < 3) issues.push("match_too_few_pairs");
    }

    if (global.RNFQuestions && RNFQuestions.isCantoneseQuestion) {
      if (RNFQuestions.isCantoneseQuestion(q) && q.courses && q.courses.indexOf("zh") < 0) {
        issues.push("cantonese_outside_zh_course");
      }
    }

    if (
      q.type === "word_bank" &&
      q.variant === "translate_chip" &&
      global.RNFQuestions
    ) {
      if (q.courses && q.courses.indexOf("en") >= 0 && RNFQuestions.isMisdirectedEnChipQuestion) {
        if (RNFQuestions.isMisdirectedEnChipQuestion(q)) {
          issues.push("en_chip_chinese_options");
        }
      }
      if (q.courses && q.courses.indexOf("zh") >= 0 && RNFQuestions.isMisdirectedZhChipQuestion) {
        if (RNFQuestions.isMisdirectedZhChipQuestion(q)) {
          issues.push("zh_chip_wrong_language");
        }
      }
    }

    if (global.RNFQuestions && RNFQuestions.validateQuestionIntegrity) {
      issues = issues.concat(RNFQuestions.validateQuestionIntegrity(q));
    }

    return issues;
  }

  function auditBank(bank) {
    var report = [];
    (bank || []).forEach(function (q) {
      var issues = validateQuestion(q);
      if (issues.length) report.push({ id: q.id, type: q.type, issues: issues });
    });
    return report;
  }

  function runAudit() {
    if (!global.RNFQuestions || !RNFQuestions.getFullBank) {
      console.warn("[audit] RNFQuestions not loaded");
      return [];
    }
    var bank = RNFQuestions.getFullBank();
    var report = auditBank(bank);
    if (report.length) {
      console.warn("[audit] " + report.length + " question(s) with issues:", report);
    } else {
      console.log("[audit] OK — " + bank.length + " questions");
    }
    return report;
  }

  global.RNFQuestionAudit = {
    validateQuestion: validateQuestion,
    auditBank: auditBank,
    runAudit: runAudit,
  };
})(typeof window !== "undefined" ? window : global);

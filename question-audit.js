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
    }

    if (global.RNFQuestions && RNFQuestions.isCantoneseQuestion) {
      if (RNFQuestions.isCantoneseQuestion(q) && q.courses && q.courses.indexOf("zh") < 0) {
        issues.push("cantonese_outside_zh_course");
      }
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

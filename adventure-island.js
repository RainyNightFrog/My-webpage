/**
 * 冒險島 — unlock after answering the first 10 practice questions.
 */
(function (global) {
  var UNLOCK_KEY = "rnf_island_unlocked";
  var ANSWERED_KEY = "rnf_island_questions_answered";
  var UNLOCK_AT = 10;

  function readAnsweredCount() {
    try {
      return parseInt(localStorage.getItem(ANSWERED_KEY) || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function writeAnsweredCount(n) {
    try {
      localStorage.setItem(ANSWERED_KEY, String(Math.max(0, n)));
    } catch (e) {}
  }

  function setUnlocked() {
    var wasUnlocked = false;
    try {
      wasUnlocked = localStorage.getItem(UNLOCK_KEY) === "1";
      localStorage.setItem(UNLOCK_KEY, "1");
      if (readAnsweredCount() < UNLOCK_AT) {
        writeAnsweredCount(UNLOCK_AT);
      }
    } catch (e) {}
    if (!wasUnlocked && global.document && document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent("rnf:island-unlocked"));
    }
  }

  function hasLegacyProgress() {
    try {
      if (parseInt(localStorage.getItem("rnf_units_done") || "0", 10) >= 1) {
        return true;
      }
      if (localStorage.getItem(UNLOCK_KEY) === "1") {
        return true;
      }
    } catch (e) {}
    return false;
  }

  function isUnlocked() {
    if (hasLegacyProgress()) {
      setUnlocked();
      return true;
    }
    return readAnsweredCount() >= UNLOCK_AT;
  }

  function remainingToUnlock() {
    return Math.max(0, UNLOCK_AT - readAnsweredCount());
  }

  function recordAnswer() {
    if (isUnlocked()) return true;
    var next = readAnsweredCount() + 1;
    writeAnsweredCount(next);
    if (next >= UNLOCK_AT) {
      setUnlocked();
      return true;
    }
    return false;
  }

  function getLockedRedirect() {
    if (readAnsweredCount() > 0) {
      return "lesson.html";
    }
    return "languages.html";
  }

  function guardLearnPage() {
    if (isUnlocked()) return true;
    location.replace(getLockedRedirect());
    return false;
  }

  global.RNFAdventureIsland = {
    UNLOCK_AT: UNLOCK_AT,
    isUnlocked: isUnlocked,
    setUnlocked: setUnlocked,
    recordAnswer: recordAnswer,
    remainingToUnlock: remainingToUnlock,
    getAnsweredCount: readAnsweredCount,
    getLockedRedirect: getLockedRedirect,
    guardLearnPage: guardLearnPage,
  };
})(typeof window !== "undefined" ? window : this);

/**
 * Onboarding: course flow (Duolingo-style) or profile flow (after lesson).
 */
(function (global) {
  var COURSE_STEPS = [
    "stepSource",
    "stepWhy",
    "stepLevel",
    "stepBenefits",
    "stepDaily",
    "stepPath",
    "stepMotiv",
    "stepLoading",
  ];
  var PROFILE_STEPS = ["stepAge", "stepSignup"];

  var AUTO_CONTINUE = {
    stepBenefits: true,
    stepMotiv: true,
    stepLoading: true,
  };

  function getFlow() {
    try {
      var q = new URLSearchParams(location.search).get("flow");
      if (q === "profile" || q === "course") return q;
      return sessionStorage.getItem("rnf_setup_flow") || "course";
    } catch (e) {
      return "course";
    }
  }

  function onboardKey(suffix) {
    var target = "en";
    try {
      target = sessionStorage.getItem("learn_target") || "en";
    } catch (e2) {}
    return "rnf_onboard_" + target + "_" + suffix;
  }

  function saveOnboard(field, value) {
    try {
      localStorage.setItem(onboardKey(field), String(value));
    } catch (e) {}
  }

  function initSetupPage() {
    if (!global.AppI18n || !global.LCApp) return;

    var flow = getFlow();
    var stepIds = flow === "profile" ? PROFILE_STEPS : COURSE_STEPS;
    var stepIndex = 0;
    var picks = {};
    var loadingTimer = null;

    var btnContinue = document.getElementById("btnContinue");
    var btnSkip = document.getElementById("btnSkip");
    var footer = document.querySelector(".lc-footer-bar");
    var logo = document.querySelector(".lc-header .lc-logo");

    if (logo && flow === "course") {
      logo.setAttribute("href", "languages.html");
    }

    function progressPct() {
      return 10 + ((stepIndex + 1) / stepIds.length) * 85;
    }

    function stepNeedsPick(id) {
      return (
        id !== "stepBenefits" &&
        id !== "stepMotiv" &&
        id !== "stepLoading" &&
        id !== "stepAge" &&
        id !== "stepSignup"
      );
    }

    function updateFooter() {
      var id = stepIds[stepIndex];
      if (!footer || !btnContinue) return;

      if (id === "stepLoading") {
        footer.style.display = "none";
        return;
      }
      footer.style.display = id === "stepSignup" ? "none" : "flex";

      if (id === "stepAge") {
        btnContinue.textContent = AppI18n.t("flow.profileNext");
        btnContinue.disabled = !isAgeValid();
        if (btnSkip) btnSkip.style.visibility = "hidden";
        return;
      }

      btnContinue.textContent = AppI18n.t("flow.continue");
      if (btnSkip) btnSkip.style.visibility = AUTO_CONTINUE[id] ? "hidden" : "";

      if (AUTO_CONTINUE[id]) {
        btnContinue.disabled = false;
        document.querySelectorAll(".lc-step-continue").forEach(function (b) {
          b.disabled = false;
        });
      } else {
        document.querySelectorAll(".lc-step-continue").forEach(function (b) {
          b.disabled = true;
        });
        btnContinue.disabled = !picks[id];
      }
    }

    function showStep(idx) {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }

      stepIndex = idx;
      stepIds.forEach(function (sid, i) {
        var el = document.getElementById(sid);
        if (el) el.classList.toggle("active", i === idx);
      });

      LCApp.setProgress(progressPct());
      AppI18n.applyPage("setup");
      renderAgePrivacy();
      updateFooter();

      var id = stepIds[stepIndex];
      if (id === "stepMotiv") {
        renderMotivPitch();
      }
      if (id === "stepLoading") {
        loadingTimer = setTimeout(finishCourse, 2400);
      }
    }

    function advance() {
      if (stepIndex < stepIds.length - 1) {
        showStep(stepIndex + 1);
      } else if (flow === "profile") {
        finishProfile();
      } else {
        finishCourse();
      }
    }

    function finishCourse() {
      try {
        localStorage.setItem("rnf_onboard_done", "1");
      } catch (e) {}

      var path = picks.stepPath || "basics";
      saveOnboard("path", path);
      if (picks.stepLevel != null) saveOnboard("level", picks.stepLevel);
      if (picks.stepDaily) saveOnboard("daily", picks.stepDaily);
      if (picks.stepWhy) saveOnboard("why", picks.stepWhy);
      if (picks.stepSource) saveOnboard("source", picks.stepSource);

      try {
        sessionStorage.removeItem("rnf_setup_flow");
      } catch (e2) {}

      if (path === "test") {
        location.href = "lesson.html?mode=jump";
        return;
      }
      location.href = "lesson.html";
    }

    function finishProfile() {
      try {
        localStorage.setItem("rnf_profile_created", "1");
        localStorage.removeItem("rnf_profile_prompt");
        if (!localStorage.getItem("rnf_profile_joined")) {
          localStorage.setItem("rnf_profile_joined", new Date().toISOString());
        }
        var age = parseInt(document.getElementById("ageInput").value, 10);
        if (!isNaN(age)) localStorage.setItem("rnf_profile_age", String(age));
        saveProfileDraft();
      } catch (e) {}
      var back = "learn.html";
      try {
        back = sessionStorage.getItem("rnf_profile_return") || back;
        sessionStorage.removeItem("rnf_profile_return");
        sessionStorage.removeItem("rnf_setup_flow");
      } catch (e2) {}
      location.href = back;
    }

    function renderMotivPitch() {
      var el = document.getElementById("motivPitchText");
      if (el && AppI18n.pickMotivPitch) {
        el.textContent = AppI18n.pickMotivPitch();
      }
    }

    function renderAgePrivacy() {
      var el = document.getElementById("agePrivacy");
      if (!el) return;
      el.innerHTML =
        AppI18n.t("flow.agePrivacyBefore") +
        '<a class="lc-age-link" href="home.html">' +
        AppI18n.t("flow.privacyPolicy") +
        "</a>" +
        AppI18n.t("flow.agePrivacyAfter");
    }

    function isAgeValid() {
      var v = parseInt(document.getElementById("ageInput").value, 10);
      return !isNaN(v) && v >= 5 && v <= 120;
    }

    function isSignupValid() {
      var email = document.getElementById("profileEmail").value.trim();
      var pass = document.getElementById("profilePassword").value;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && pass.length >= 6;
    }

    function saveProfileDraft() {
      try {
        localStorage.setItem(
          "rnf_profile",
          JSON.stringify({
            name: document.getElementById("profileName").value.trim(),
            email: document.getElementById("profileEmail").value.trim(),
          })
        );
      } catch (e) {}
    }

    function bindAutoContinueSteps() {
      document.querySelectorAll(".lc-step-continue").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var step = btn.closest(".lc-step");
          if (!step || !step.classList.contains("active")) return;
          advance();
        });
      });

      ["stepBenefits", "stepMotiv"].forEach(function (sid) {
        var stepEl = document.getElementById(sid);
        if (!stepEl) return;

        stepEl.querySelectorAll(".lc-benefit-row").forEach(function (row) {
          row.setAttribute("role", "button");
          row.setAttribute("tabindex", "0");
          row.addEventListener("click", function () {
            if (!stepEl.classList.contains("active")) return;
            advance();
          });
          row.addEventListener("keydown", function (ev) {
            if (ev.key !== "Enter" && ev.key !== " ") return;
            ev.preventDefault();
            if (!stepEl.classList.contains("active")) return;
            advance();
          });
        });

        var motiv = stepEl.querySelector(".lc-motiv-stage");
        if (motiv) {
          motiv.addEventListener("click", function () {
            if (!stepEl.classList.contains("active")) return;
            advance();
          });
        }
      });
    }

    function bindPickers() {
      document.querySelectorAll("[data-onboard-step]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var sid = btn.getAttribute("data-onboard-step");
          var val =
            btn.getAttribute("data-value") ||
            btn.getAttribute("data-level") ||
            btn.getAttribute("data-path") ||
            btn.getAttribute("data-daily") ||
            "1";

          document
            .querySelectorAll('[data-onboard-step="' + sid + '"]')
            .forEach(function (b) {
              b.classList.remove("selected");
            });
          btn.classList.add("selected");
          picks[sid] = val;
          if (sid === "stepLevel") saveOnboard("level", val);
          updateFooter();
        });
      });
    }

    function bindProfile() {
      var ageInput = document.getElementById("ageInput");
      if (ageInput) {
        ageInput.addEventListener("input", function () {
          if (stepIds[stepIndex] === "stepAge") updateFooter();
        });
      }

      ["profileEmail", "profilePassword", "profileName"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener("input", updateSignupButton);
      });

      var form = document.getElementById("signupForm");
      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          if (!isSignupValid()) return;
          saveProfileDraft();
          finishProfile();
        });
      }

      function updateSignupButton() {
        var btn = document.getElementById("btnCreateAccount");
        if (btn) btn.disabled = !isSignupValid();
      }
      global._rnfUpdateSignup = updateSignupButton;

      function skipAge() {
        showStep(stepIds.indexOf("stepSignup"));
      }
      function skipSignup() {
        finishProfile();
      }

      var g = document.getElementById("btnGoogle");
      var f = document.getElementById("btnFacebook");
      var sg = document.getElementById("btnSignupGoogle");
      var sf = document.getElementById("btnSignupFacebook");
      if (g) g.addEventListener("click", skipAge);
      if (f) f.addEventListener("click", skipAge);
      if (sg) sg.addEventListener("click", skipSignup);
      if (sf) sf.addEventListener("click", skipSignup);

      var eye = document.getElementById("btnTogglePass");
      if (eye) {
        eye.addEventListener("click", function () {
          var inp = document.getElementById("profilePassword");
          var on = inp.type === "text";
          inp.type = on ? "password" : "text";
          eye.setAttribute(
            "aria-label",
            AppI18n.t(on ? "flow.signupHidePass" : "flow.signupShowPass")
          );
        });
      }
    }

    if (btnContinue) {
      btnContinue.addEventListener("click", advance);
    }
    if (btnSkip) {
      btnSkip.addEventListener("click", advance);
    }

    document.addEventListener("lc:langchange", function () {
      AppI18n.applyPage("setup");
      renderAgePrivacy();
      updateFooter();
      if (stepIds[stepIndex] === "stepMotiv") {
        renderMotivPitch();
      }
    });

    bindPickers();
    bindAutoContinueSteps();
    bindProfile();
    renderAgePrivacy();
    showStep(0);
  }

  global.RNFSetup = { init: initSetupPage, getFlow: getFlow };
})(window);

/**
 * Login / Register page — Rainy Night Frog
 */
(function (global) {
  function t(path, vars) {
    return global.AppI18n ? AppI18n.t(path, vars) : path;
  }

  function getMode() {
    try {
      var m = new URLSearchParams(location.search).get("mode");
      if (m === "register") return "register";
      return "login";
    } catch (e) {
      return "login";
    }
  }

  function showError(msg) {
    var el = document.getElementById("authError");
    if (!el) return;
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = msg;
  }

  function reasonText(reason) {
    var map = {
      email: "flow.authErrEmail",
      password: "flow.authErrPassword",
      exists: "flow.authErrExists",
      notfound: "flow.authErrNotFound",
      wrongpass: "flow.authErrWrongPass",
    };
    if (reason === "password" && getMode() === "login") {
      return t("flow.authErrWrongPass");
    }
    return t(map[reason] || "flow.authErrGeneric");
  }

  function setMode(mode) {
    var loginPanel = document.getElementById("authLoginPanel");
    var regPanel = document.getElementById("authRegisterPanel");
    var title = document.getElementById("authTitle");
    if (mode === "register") {
      if (loginPanel) loginPanel.hidden = true;
      if (regPanel) regPanel.hidden = false;
      if (title) title.textContent = t("flow.authRegisterTitle");
      document.title = t("flow.authRegisterTitle") + " — Rainy Night Frog";
    } else {
      if (loginPanel) loginPanel.hidden = false;
      if (regPanel) regPanel.hidden = true;
      if (title) title.textContent = t("flow.authLoginTitle");
      document.title = t("flow.authLoginTitle") + " — Rainy Night Frog";
    }
    showError("");
  }

  function getReturnUrl() {
    try {
      return (
        new URLSearchParams(location.search).get("return") ||
        sessionStorage.getItem("rnf_auth_return") ||
        "learn.html"
      );
    } catch (e) {
      return "learn.html";
    }
  }

  function goAfterAuth() {
    var url = getReturnUrl();
    try {
      sessionStorage.removeItem("rnf_auth_return");
    } catch (e) {}
    location.href = url;
  }

  function bindTogglePass(btnId, inputId) {
    var btn = document.getElementById(btnId);
    var inp = document.getElementById(inputId);
    if (!btn || !inp) return;
    btn.addEventListener("click", function () {
      var show = inp.type === "password";
      inp.type = show ? "text" : "password";
      btn.setAttribute(
        "aria-label",
        t(show ? "flow.signupHidePass" : "flow.signupShowPass")
      );
    });
  }

  function init() {
    if (!global.RNFPlayerAuth) return;

    var mode = getMode();
    setMode(mode);

    if (RNFPlayerAuth.isLoggedIn()) {
      var user = RNFPlayerAuth.getCurrentUser();
      var box = document.getElementById("authLoggedIn");
      if (box) {
        box.hidden = false;
        document.getElementById("authFormsWrap").hidden = true;
        var nameEl = document.getElementById("authLoggedInName");
        if (nameEl) {
          nameEl.textContent = t("flow.authWelcomeBack", {
            name: user.name || user.email,
          });
        }
      }
    }

    document.querySelectorAll("[data-auth-mode]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var m = link.getAttribute("data-auth-mode");
        setMode(m);
        history.replaceState(null, "", "auth.html?mode=" + m);
      });
    });

    var loginForm = document.getElementById("authLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showError("");
        var email = document.getElementById("authLoginEmail").value;
        var pass = document.getElementById("authLoginPassword").value;
        RNFPlayerAuth.login(email, pass).then(function (res) {
          if (res.ok) goAfterAuth();
          else if (res.reason === "password") showError(t("flow.authErrWrongPass"));
          else showError(reasonText(res.reason));
        });
      });
    }

    var regForm = document.getElementById("authRegisterForm");
    if (regForm) {
      regForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showError("");
        RNFPlayerAuth.register({
          name: document.getElementById("authRegName").value,
          email: document.getElementById("authRegEmail").value,
          password: document.getElementById("authRegPassword").value,
        }).then(function (res) {
          if (res.ok) goAfterAuth();
          else showError(reasonText(res.reason));
        });
      });
    }

    var logoutBtn = document.getElementById("authLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        RNFPlayerAuth.logout();
        location.reload();
      });
    }

    var contBtn = document.getElementById("authContinueBtn");
    if (contBtn) {
      contBtn.addEventListener("click", goAfterAuth);
    }

    bindTogglePass("authLoginEye", "authLoginPassword");
    bindTogglePass("authRegEye", "authRegPassword");
  }

  global.RNFAuthPage = { init: init };
})(window);

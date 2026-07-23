export function initAuth() {
  const authScreen = document.getElementById("auth-screen");
  const onboardingScreen = document.getElementById("onboarding-screen");
  const mainApp = document.getElementById("main-app");
  const authTitle = document.getElementById("auth-title");
  const authSubmit = document.getElementById("auth-submit");
  const authToggleLink = document.getElementById("auth-toggle-link");
  const authToggleText = document.getElementById("auth-toggle-text");
  const authForm = document.getElementById("auth-form");
  const onboardingForm = document.getElementById("onboarding-form");
  const authError = document.getElementById("auth-error");

  if (!authScreen || !authForm) return;

  let isLoginMode = true;

  const showScreen = (screen) => {
    [authScreen, onboardingScreen, mainApp].forEach((s) => {
      if (s) s.classList.remove("active");
    });
    if (screen) screen.classList.add("active");
  };

  const showError = (msg) => {
    if (authError) {
      authError.textContent = msg;
      authError.style.display = "block";
    }
  };

  const hideError = () => {
    if (authError) {
      authError.textContent = "";
      authError.style.display = "none";
    }
  };

  const checkAuthState = () => {
    const token = localStorage.getItem("auth_token");
    const onboardingDone = localStorage.getItem("onboarding_completed");
    if (!token) {
      showScreen(authScreen);
    } else if (!onboardingDone) {
      showScreen(onboardingScreen);
    } else {
      showScreen(mainApp);
    }
  };

  if (authToggleLink) {
    authToggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      hideError();
      isLoginMode = !isLoginMode;
      if (authTitle)
        authTitle.textContent = isLoginMode ? "Вход" : "Регистрация";
      if (authSubmit)
        authSubmit.textContent = isLoginMode ? "Войти" : "Создать аккаунт";
      authToggleLink.textContent = isLoginMode ? "Зарегистрироваться" : "Войти";
      if (authToggleText && authToggleText.firstChild) {
        authToggleText.firstChild.textContent = isLoginMode
          ? "Нет аккаунта? "
          : "Уже есть аккаунт? ";
      }
    });
  }

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value;
    const password = passwordInput.value;
    if (!email || !password) return;

    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");

    if (isLoginMode) {
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!user) {
        showError("Аккаунт не найден.\nПожалуйста, зарегистрируйтесь.");
        return;
      }
      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("current_user_email", email);
      const onboardingDone = localStorage.getItem("onboarding_completed");
      if (onboardingDone) {
        showScreen(mainApp);
      } else {
        showScreen(onboardingScreen);
      }
    } else {
      if (users.find((u) => u.email === email)) {
        showError("Пользователь с таким email уже существует.");
        return;
      }
      users.push({ email, password });
      localStorage.setItem("registered_users", JSON.stringify(users));
      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("current_user_email", email);
      showScreen(onboardingScreen);
    }
  });

  if (onboardingForm) {
    onboardingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentWeightInput = document.getElementById("current-weight");
      const targetWeightInput = document.getElementById("target-weight");
      if (!currentWeightInput || !targetWeightInput) return;

      const currentWeight = currentWeightInput.value;
      const targetWeight = targetWeightInput.value;
      if (!currentWeight || !targetWeight) return;

      localStorage.setItem("user_weight", currentWeight);
      localStorage.setItem("user_target_weight", targetWeight);
      localStorage.setItem("onboarding_completed", "true");
      showScreen(mainApp);
    });
  }

  checkAuthState();
}

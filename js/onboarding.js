const pickersReset = {};

export function initOnboarding() {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const btnStep1 = document.getElementById("btn-step-1");
  const btnStep2 = document.getElementById("btn-step-2");

  if (!step1 || !step2 || !btnStep1 || !btnStep2) return;

  let currentWeight = 50;
  let targetWeight = 47;

  const createPicker = (
    containerId,
    displayId,
    min,
    max,
    defaultVal,
    callback,
  ) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const list = container.querySelector(".picker-list");
    const display = document.getElementById(displayId);
    if (!list || !display) return;

    let selectedVal = defaultVal;
    let scrollTimeout;

    // Очищаем список перед заполнением (на случай повторного вызова)
    list.innerHTML = "";

    for (let i = min; i <= max; i++) {
      const item = document.createElement("div");
      item.className = "picker-item";
      item.textContent = i;
      item.dataset.value = i;
      list.appendChild(item);
    }

    const updateSelection = (isInit = false) => {
      const items = list.querySelectorAll(".picker-item");
      if (items.length === 0) return;

      const center = list.scrollTop + list.clientHeight / 2;
      let closest = null;
      let minDiff = Infinity;

      items.forEach((item) => {
        const itemCenter = item.offsetTop + item.clientHeight / 2;
        const diff = Math.abs(center - itemCenter);
        item.classList.remove("selected");
        if (diff < minDiff) {
          minDiff = diff;
          closest = item;
        }
      });

      if (closest) {
        closest.classList.add("selected");
        const val = parseInt(closest.dataset.value);
        if (val !== selectedVal || isInit) {
          selectedVal = val;
          display.textContent = val;
          callback(val);
        }
      }
    };

    list.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => updateSelection(false), 50);
    });

    // Функция для точного позиционирования (вызывается при старте и смене экранов)
    const resetPosition = () => {
      const defaultItem = list.querySelector(`[data-value="${defaultVal}"]`);
      if (defaultItem) {
        list.scrollTop =
          defaultItem.offsetTop -
          list.clientHeight / 2 +
          defaultItem.clientHeight / 2;
        setTimeout(() => updateSelection(true), 50);
      }
    };

    // Сохраняем метод сброса для вызова снаружи
    pickersReset[containerId] = resetPosition;

    // Первичная попытка инициализации
    setTimeout(resetPosition, 50);
  };

  // Инициализируем оба пикера
  createPicker(
    "picker-current",
    "current-weight-val",
    30,
    150,
    50,
    (val) => (currentWeight = val),
  );
  createPicker(
    "picker-target",
    "target-weight-val",
    30,
    150,
    47,
    (val) => (targetWeight = val),
  );

  // Переход на Шаг 2
  btnStep1.addEventListener("click", () => {
    step1.classList.remove("active");
    step1.classList.add("prev");
    step2.classList.add("active");

    // ВАЖНО: Как только Шаг 2 стал активным и видимым,
    // принудительно центрируем второй пикер
    setTimeout(() => {
      if (pickersReset["picker-target"]) {
        pickersReset["picker-target"]();
      }
    }, 400); // 400ms — время окончания CSS-анимации перехода слайдов
  });

  btnStep2.addEventListener("click", () => {
    localStorage.setItem("user_weight", currentWeight);
    localStorage.setItem("user_target_weight", targetWeight);
    localStorage.setItem("onboarding_completed", "true");

    const authScreen = document.getElementById("auth-screen");
    const onboardingScreen = document.getElementById("onboarding-screen");
    const mainApp = document.getElementById("main-app");

    if (authScreen) authScreen.classList.remove("active");
    if (onboardingScreen) onboardingScreen.classList.remove("active");
    if (mainApp) mainApp.classList.add("active");
  });
}

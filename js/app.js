import { State } from "./state.js";
import { Render } from "./render.js";
import { Settings } from "./settings.js";
import { Router } from "./router.js";

class App {
  constructor() {
    this.state = new State();
    this.render = new Render(this);
    this.settings = new Settings(this.state, this);
    this.menu = null;
    this.currentDayIndex = 0;
    this.timerId = null;
    this.menuInitialized = false;

    // Инициализация роутера
    this.router = new Router(
      {
        "/": () => this.showScreen("menu"),
        "/menu": () => this.showScreen("menu"),
        "/settings": () => this.showScreen("settings"),
      },
      "/menu",
    );

    this.init();
  }

  async init() {
    this.state.setTheme(this.state.getTheme());
    this.updateThemeLabel();

    // Загрузка меню
    this.menu = this.state.getMenu();

    // Если меню есть, инициализируем его один раз
    if (this.menu) {
      this.initMenu();
    }

    // Инициализация роутера (определение маршрута из URL и показ экрана)
    this.router.init();

    this.bindTabs();
  }

  initMenu() {
    if (this.menuInitialized) return;

    const daysCount = this.menu.days.length;
    const version = this.menu.schema_version || "?";
    document.getElementById("menuStatus").textContent =
      `• загружено (${daysCount} дней, v${version})`;

    this.currentDayIndex = this.getTodayIndex();
    this.renderDaysNav();
    this.renderMeals();
    this.startCurrentMealTimer();

    this.menuInitialized = true;
  }

  bindTabs() {
    document
      .getElementById("tabMenu")
      .addEventListener("click", () => this.router.navigate("/menu"));
    document
      .getElementById("tabSettings")
      .addEventListener("click", () => this.router.navigate("/settings"));
  }

  showScreen(screen) {
    // Обновление состояния табов
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));

    const activeTab = screen === "settings" ? "settings" : "menu";
    document
      .querySelector(`.tab-btn[data-tab="${activeTab}"]`)
      ?.classList.add("active");

    // Скрытие всех экранов и empty state
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById("emptyState").style.display = "none";

    if (screen === "menu") {
      if (this.menu) {
        document.getElementById("menuScreen").classList.add("active");
      } else {
        document.getElementById("emptyState").style.display = "flex";
        document.getElementById("menuStatus").textContent = "• не загружено";
      }
    } else if (screen === "settings") {
      document.getElementById("settingsScreen").classList.add("active");
    }
  }

  onMenuImported() {
    this.stopCurrentMealTimer();
    this.menu = this.state.getMenu();
    this.menuInitialized = false;

    // Инициализация нового меню
    this.initMenu();

    // Переключение на экран меню
    this.showScreen("menu");
    this.router.navigate("/menu");
  }

  onAllCleared() {
    this.stopCurrentMealTimer();
    this.menu = null;
    this.menuInitialized = false;

    // Переключение на экран меню (покажется empty state)
    this.showScreen("menu");
    this.router.navigate("/menu");
  }

  updateThemeLabel() {
    const theme = this.state.getTheme();
    const label = document.getElementById("themeLabel");
    if (label) {
      label.textContent = theme === "dark" ? "Светлая тема" : "Темная тема";
    }
  }

  onThemeToggled() {
    this.updateThemeLabel();
  }

  getTodayIndex() {
    const d = new Date().getDay();
    const idx = d === 0 ? 6 : d - 1;
    if (!this.menu) return 0;
    return idx < this.menu.days.length ? idx : 0;
  }

  renderDaysNav() {
    const nav = document.getElementById("daysNav");
    nav.innerHTML = "";
    this.menu.days.forEach((day, index) => {
      const btn = document.createElement("button");
      btn.className = `day-btn ${index === this.currentDayIndex ? "active" : ""}`;
      btn.textContent = day.name;
      btn.onclick = () => {
        this.currentDayIndex = index;
        document
          .querySelectorAll(".day-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("dayTitleDisplay").textContent = day.name;
        this.renderMeals();
      };
      nav.appendChild(btn);
    });
    document.getElementById("dayTitleDisplay").textContent =
      this.menu.days[this.currentDayIndex]?.name || "";
  }

  renderMeals() {
    const day = this.menu.days[this.currentDayIndex];
    if (!day) return;
    const container = document.getElementById("mealsContainer");
    container.innerHTML = "";
    day.meals.forEach((meal) => {
      const card = this.render.createMealCard(day.id, meal, this.state);
      container.appendChild(card);
    });
    this.highlightCurrentMeal();
  }

  highlightCurrentMeal() {
    document
      .querySelectorAll(".meal-card")
      .forEach((c) => c.classList.remove("current"));
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const day = this.menu.days[this.currentDayIndex];
    if (!day) return;

    let currentMealId = null;
    for (let i = 0; i < day.meals.length; i++) {
      const [h, m] = day.meals[i].time.split(":").map(Number);
      const mealMinutes = h * 60 + m;
      const nextMealMinutes =
        i + 1 < day.meals.length
          ? (() => {
              const [h2, m2] = day.meals[i + 1].time.split(":").map(Number);
              return h2 * 60 + m2;
            })()
          : 24 * 60;
      if (nowMinutes >= mealMinutes && nowMinutes < nextMealMinutes) {
        currentMealId = day.meals[i].id;
        break;
      }
    }
    if (currentMealId) {
      const el = document.getElementById(`card_${currentMealId}`);
      if (el) el.classList.add("current");
    }
  }

  openRecipe(meal) {
    this.render.showRecipeModal(meal);
  }

  closeRecipe() {
    this.render.hideRecipeModal();
  }

  startCurrentMealTimer() {
    this.stopCurrentMealTimer();
    this.timerId = setInterval(() => this.highlightCurrentMeal(), 60000);
  }

  stopCurrentMealTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new App());

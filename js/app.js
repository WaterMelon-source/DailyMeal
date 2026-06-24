import { State } from "./state.js";
import { Render } from "./render.js";
import { Settings } from "./settings.js";

class App {
  constructor() {
    this.state = new State();
    this.render = new Render();
    this.settings = new Settings(this.state, this);
    this.menu = null;
    this.currentDayIndex = 0;
    this.timerId = null;
    this.init();
  }

  async init() {
    this.menu = this.state.getMenu();
    if (!this.menu) {
      this.showEmptyState();
    } else {
      this.showMenu();
    }
  }

  showEmptyState() {
    document.getElementById("emptyState").style.display = "flex";
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("daysNav").style.display = "none";
    document.getElementById("menuStatus").textContent = "Меню: не загружено";
  }

  showMenu() {
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("daysNav").style.display = "flex";

    const daysCount = this.menu.days.length;
    const version = this.menu.schema_version || "?";
    document.getElementById("menuStatus").textContent =
      `Меню: загружено (${daysCount} дней, v${version})`;

    this.currentDayIndex = this.getTodayIndex();
    this.renderDaysNav();
    this.renderMeals();
    this.startCurrentMealTimer();
  }

  // Вызывается из Settings после импорта меню
  onMenuImported() {
    this.stopCurrentMealTimer();
    this.menu = this.state.getMenu();
    this.showMenu();
  }

  // Вызывается из Settings после удаления всего
  onAllCleared() {
    this.stopCurrentMealTimer();
    this.menu = null;
    this.showEmptyState();
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

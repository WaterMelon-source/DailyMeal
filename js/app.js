import { State } from './state.js';
import { Render } from './render.js';
import { Settings } from './settings.js';

class App {
  constructor() {
    this.state = new State();
    this.render = new Render();
    this.settings = new Settings(this.state);
    this.menu = null;
    this.currentDayIndex = this.getTodayIndex();
    this.init();
  }

  async init() {
    await this.loadMenu();
    this.renderDaysNav();
    this.renderMeals();
    this.startCurrentMealTimer();
  }

  getTodayIndex() {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }

  async loadMenu() {
    try {
      const res = await fetch('./menu.json');
      if (!res.ok) throw new Error('Menu not found');
      this.menu = await res.json();
      document.getElementById('menuVersion').textContent = `Меню: v${this.menu.schema_version}`;
    } catch (e) {
      console.error('Failed to load menu:', e);
      this.menu = { days: [] };
    }
  }

  renderDaysNav() {
    const nav = document.getElementById('daysNav');
    nav.innerHTML = '';
    this.menu.days.forEach((day, index) => {
      const btn = document.createElement('button');
      btn.className = `day-btn ${index === this.currentDayIndex ? 'active' : ''}`;
      btn.textContent = day.name;
      btn.onclick = () => {
        this.currentDayIndex = index;
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('dayTitleDisplay').textContent = day.name;
        this.renderMeals();
      };
      nav.appendChild(btn);
    });
    document.getElementById('dayTitleDisplay').textContent = this.menu.days[this.currentDayIndex]?.name || '';
  }

  renderMeals() {
    const day = this.menu.days[this.currentDayIndex];
    if (!day) return;
    const container = document.getElementById('mealsContainer');
    container.innerHTML = '';
    day.meals.forEach(meal => {
      const card = this.render.createMealCard(day.id, meal, this.state);
      container.appendChild(card);
    });
    this.highlightCurrentMeal();
  }

  highlightCurrentMeal() {
    document.querySelectorAll('.meal-card').forEach(c => c.classList.remove('current'));
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const day = this.menu.days[this.currentDayIndex];
    if (!day) return;

    let currentMealId = null;
    for (let i = 0; i < day.meals.length; i++) {
      const [h, m] = day.meals[i].time.split(':').map(Number);
      const mealMinutes = h * 60 + m;
      const nextMealMinutes = i + 1 < day.meals.length
        ? (() => { const [h2, m2] = day.meals[i+1].time.split(':').map(Number); return h2*60+m2; })()
        : 24 * 60;
      if (nowMinutes >= mealMinutes && nowMinutes < nextMealMinutes) {
        currentMealId = day.meals[i].id;
        break;
      }
    }
    if (currentMealId) {
      const el = document.getElementById(`card_${currentMealId}`);
      if (el) el.classList.add('current');
    }
  }

  startCurrentMealTimer() {
    setInterval(() => this.highlightCurrentMeal(), 60000);
  }
}

document.addEventListener('DOMContentLoaded', () => new App());
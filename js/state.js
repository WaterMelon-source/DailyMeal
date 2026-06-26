export class State {
  constructor() {
    this.storagePrefix = "chefmenu";
    this.menuKey = `${this.storagePrefix}_menu`;
    this.themeKey = `${this.storagePrefix}_theme`;
  }

  // === ТЕМА ===
  getTheme() {
    return localStorage.getItem(this.themeKey) || "dark";
  }

  setTheme(theme) {
    localStorage.setItem(this.themeKey, theme);
    document.body.setAttribute("data-theme", theme);
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === "dark" ? "light" : "dark";
    this.setTheme(next);
    return next;
  }

  // === ПРОГРЕСС ===
  getProgressKey(dayId, mealId) {
    return `${this.storagePrefix}_${dayId}_${mealId}`;
  }

  isEaten(dayId, mealId) {
    return localStorage.getItem(this.getProgressKey(dayId, mealId)) === "true";
  }

  setEaten(dayId, mealId, value) {
    localStorage.setItem(
      this.getProgressKey(dayId, mealId),
      value ? "true" : "false",
    );
  }

  toggleEaten(dayId, mealId) {
    const current = this.isEaten(dayId, mealId);
    this.setEaten(dayId, mealId, !current);
    return !current;
  }

  getAllProgress() {
    const result = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        key.startsWith(this.storagePrefix + "_") &&
        key !== this.menuKey &&
        key !== this.themeKey
      ) {
        result[key] = localStorage.getItem(key);
      }
    }
    return result;
  }

  importProgress(data) {
    if (!data || typeof data !== "object")
      throw new Error("Invalid progress data");
    Object.entries(data).forEach(([key, value]) => {
      if (
        key.startsWith(this.storagePrefix + "_") &&
        key !== this.menuKey &&
        key !== this.themeKey
      ) {
        localStorage.setItem(key, value);
      }
    });
  }

  exportProgressToFile() {
    const payload = {
      type: "progress",
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      progress: this.getAllProgress(),
    };
    this.downloadJson(payload, `chef-menu-progress-${this.dateStamp()}.json`);
  }

  importProgressFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.progress) {
            this.importProgress(data.progress);
            resolve();
          } else {
            reject(new Error("Неверный формат файла прогресса"));
          }
        } catch (err) {
          reject(new Error("Ошибка чтения файла: " + err.message));
        }
      };
      reader.onerror = () => reject(new Error("Ошибка чтения файла"));
      reader.readAsText(file);
    });
  }

  // === МЕНЮ ===
  getMenu() {
    const raw = localStorage.getItem(this.menuKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setMenu(menu) {
    if (!menu || !menu.days) throw new Error("Неверная структура меню");
    localStorage.setItem(this.menuKey, JSON.stringify(menu));
  }

  hasMenu() {
    return this.getMenu() !== null;
  }

  exportMenuToFile() {
    const menu = this.getMenu();
    if (!menu) throw new Error("Меню не загружено");
    this.downloadJson(menu, `chef-menu-${this.dateStamp()}.json`);
  }

  importMenuFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const menu = JSON.parse(e.target.result);
          if (!menu.days || !Array.isArray(menu.days)) {
            reject(new Error("Неверная структура меню: отсутствует поле days"));
            return;
          }
          this.setMenu(menu);
          resolve(menu);
        } catch (err) {
          reject(new Error("Ошибка чтения файла: " + err.message));
        }
      };
      reader.onerror = () => reject(new Error("Ошибка чтения файла"));
      reader.readAsText(file);
    });
  }

  // === ОБЩЕЕ ===
  clearAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix + "_")) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }

  downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  dateStamp() {
    return new Date().toISOString().slice(0, 10);
  }
}

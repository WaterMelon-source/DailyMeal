export class State {
  constructor() {
    this.storagePrefix = 'chefmenu';
  }

  getKey(dayId, mealId) {
    return `${this.storagePrefix}_${dayId}_${mealId}`;
  }

  isEaten(dayId, mealId) {
    return localStorage.getItem(this.getKey(dayId, mealId)) === 'true';
  }

  setEaten(dayId, mealId, value) {
    localStorage.setItem(this.getKey(dayId, mealId), value ? 'true' : 'false');
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
      if (key.startsWith(this.storagePrefix + '_')) {
        result[key] = localStorage.getItem(key);
      }
    }
    return result;
  }

  importProgress(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid data');
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(this.storagePrefix + '_')) {
        localStorage.setItem(key, value);
      }
    });
  }

  clearAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.storagePrefix + '_')) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
  }

  exportToFile() {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      progress: this.getAllProgress()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `chef-menu-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.progress) {
            this.importProgress(data.progress);
            resolve();
          } else {
            reject(new Error('Неверный формат файла'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  }
}
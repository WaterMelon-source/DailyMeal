export class Settings {
  constructor(state) {
    this.state = state;
    this.modal = document.getElementById('settingsModal');
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('settingsBtn').addEventListener('click', () => this.open());
    document.getElementById('modalClose').addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      this.state.exportToFile();
    });

    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importFileInput').click();
    });

    document.getElementById('importFileInput').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await this.state.importFromFile(file);
        alert('Прогресс успешно загружен!');
        window.location.reload();
      } catch (err) {
        alert('Ошибка импорта: ' + err.message);
      }
      e.target.value = '';
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
      if (confirm('Удалить весь прогресс? Это действие нельзя отменить.')) {
        this.state.clearAll();
        window.location.reload();
      }
    });
  }

  open() { this.modal.classList.add('open'); }
  close() { this.modal.classList.remove('open'); }
}
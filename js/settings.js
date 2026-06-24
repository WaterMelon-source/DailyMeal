export class Settings {
  constructor(state, app) {
    this.state = state;
    this.app = app;
    this.modal = document.getElementById("settingsModal");
    this.bindEvents();
  }

  bindEvents() {
    // Открытие/закрытие модалки
    document
      .getElementById("settingsBtn")
      .addEventListener("click", () => this.open());
    document
      .getElementById("modalClose")
      .addEventListener("click", () => this.close());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });

    // === МЕНЮ ===
    document.getElementById("importMenuBtn").addEventListener("click", () => {
      document.getElementById("importMenuFileInput").click();
    });

    document.getElementById("emptyImportBtn").addEventListener("click", () => {
      document.getElementById("importMenuFileInput").click();
    });

    document
      .getElementById("importMenuFileInput")
      .addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Подтверждение, если меню уже загружено
        if (this.state.hasMenu()) {
          if (!confirm("Текущее меню будет заменено. Продолжить?")) {
            e.target.value = "";
            return;
          }
        }

        try {
          await this.state.importMenuFromFile(file);
          this.close();
          this.app.onMenuImported();
        } catch (err) {
          alert("Ошибка импорта меню: " + err.message);
        }
        e.target.value = "";
      });

    document.getElementById("exportMenuBtn").addEventListener("click", () => {
      try {
        this.state.exportMenuToFile();
      } catch (err) {
        alert("Ошибка экспорта: " + err.message);
      }
    });

    // === ПРОГРЕСС ===
    document
      .getElementById("exportProgressBtn")
      .addEventListener("click", () => {
        this.state.exportProgressToFile();
      });

    document
      .getElementById("importProgressBtn")
      .addEventListener("click", () => {
        document.getElementById("importProgressFileInput").click();
      });

    document
      .getElementById("importProgressFileInput")
      .addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          await this.state.importProgressFromFile(file);
          alert("Прогресс успешно загружен!");
          window.location.reload();
        } catch (err) {
          alert("Ошибка импорта прогресса: " + err.message);
        }
        e.target.value = "";
      });

    // === УДАЛИТЬ ВСЁ ===
    document.getElementById("clearAllBtn").addEventListener("click", () => {
      if (
        confirm(
          "Удалить ВСЁ: и меню, и прогресс (галочки)? Это действие нельзя отменить.",
        )
      ) {
        this.state.clearAll();
        this.close();
        this.app.onAllCleared();
      }
    });
  }

  open() {
    this.modal.classList.add("open");
  }
  close() {
    this.modal.classList.remove("open");
  }
}

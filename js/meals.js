// 1. Массив с данными ваших карточек
const mealsData = [
  {
    id: 1,
    time: "08:00",
    title: "Завтрак: Овсяная каша с арахисовой пастой и яйцами",
    kbju: "680 ккал • Б:32 • Ж:25 • У:85",
    image:
      "https://cdn.food.ru/unsigned/fit/2048/1536/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDI2MDMyNi90bTllRHQuanBlZw.webp",
    isChecked: false,
  },
  {
    id: 2,
    time: "10:00",
    title: "Второй завтрак: Творог с ягодами и орехами",
    kbju: "420 ккал • Б:35 • Ж:12 • У:40",
    image:
      "https://cdn.food.ru/unsigned/fit/2048/1536/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDIyMTExNi8zakZ1dHkuanBlZw.webp",
    isChecked: true,
  },
  {
    id: 3,
    time: "12:00",
    title: "Второй завтрак: Творог с ягодами и орехами",
    kbju: "420 ккал • Б:35 • Ж:12 • У:40",
    image:
      "https://cdn.food.ru/unsigned/fit/2048/1536/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDIyMTExNi8zakZ1dHkuanBlZw.webp",
    isChecked: false,
  },
  {
    id: 4,
    time: "14:00",
    title: "Второй завтрак: Творог с ягодами и орехами",
    kbju: "420 ккал • Б:35 • Ж:12 • У:40",
    image:
      "https://cdn.food.ru/unsigned/fit/2048/1536/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy8yMDIyMTExNi8zakZ1dHkuanBlZw.webp",
    isChecked: true,
  },
];

// SVG иконка галочки для повторного использования
const checkSvg = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

// 2. Функция генерации карточек на странице
export function renderMeals() {
  const container = document.getElementById("mealContainer");
  if (!container) return;

  // Очищаем контейнер перед рендером
  container.innerHTML = "";

  mealsData.forEach((meal) => {
    // Создаем строку ряда
    const mealRow = document.createElement("div");
    mealRow.className = "meal-row";

    // Наполняем внутренний HTML карточки
    mealRow.innerHTML = `
      <div class="meal-card">
        <div class="meal-time">${meal.time}</div>
        <div class="card-image">
          <!-- Картинка рендерится только если meal.image задан -->
          ${meal.image ? `<img src="${meal.image}" alt="${meal.title}" class="meal-bg-image" />` : ""}
          
          <button class="expand-btn" aria-label="Развернуть" data-id="${meal.id}">
            <img src="icons/expand.svg" alt="Expand" class="expand-icon" />
          </button>
        </div>
        <div class="card-info">
          <h3 class="card-title">${meal.title}</h3>
          <p class="card-kbju">${meal.kbju}</p>
        </div>
      </div>

      <div class="meal-status">
        <button class="status-btn ${meal.isChecked ? "checked" : ""}" data-id="${meal.id}">
          ${meal.isChecked ? checkSvg : ""}
        </button>
      </div>
    `;

    // Навешиваем событие клика на кнопку статуса (галочку) внутри текущего ряда
    const statusBtn = mealRow.querySelector(".status-btn");
    statusBtn.addEventListener("click", () => {
      // Меняем состояние в данных
      meal.isChecked = !meal.isChecked;

      // Меняем визуальное состояние кнопки
      statusBtn.classList.toggle("checked");
      statusBtn.innerHTML = meal.isChecked ? checkSvg : "";
    });

    // Навешиваем событие клика на кнопку развертывания (expand)
    const expandBtn = mealRow.querySelector(".expand-btn");
    expandBtn.addEventListener("click", () => {
      console.log(`Разворачиваем карточку с ID: ${meal.id}`);
      // Здесь вы можете прописать логику открытия модального окна или скрытого текста
    });

    // Добавляем готовую карточку в контейнер
    container.appendChild(mealRow);
  });
}

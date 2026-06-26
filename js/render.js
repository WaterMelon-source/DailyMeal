export class Render {
  constructor(app) {
    this.app = app;
  }

  isTimeExpired(timeStr) {
    const now = new Date();
    const [h, m] = timeStr.split(":").map(Number);
    const mealTime = new Date();
    mealTime.setHours(h, m, 0, 0);
    return now > mealTime;
  }

  createMealCard(dayId, meal, state) {
    const eaten = state.isEaten(dayId, meal.id);
    const expired = this.isTimeExpired(meal.time);

    const card = document.createElement("div");
    card.className = `meal-card ${expired ? "expired" : ""} ${eaten ? "eaten" : ""}`;
    card.id = `card_${meal.id}`;

    const kcalText = `${meal.kcal} ккал · Б:${meal.protein} · Ж:${meal.fat} · У:${meal.carbs}`;

    const imageHtml = meal.image
      ? `<img class="meal-image" src="${meal.image}" alt="${meal.name}" loading="lazy">`
      : `<div class="meal-image" style="background: linear-gradient(135deg, #2A2A2A, #1A1A1A);"></div>`;

    card.innerHTML = `
      ${imageHtml}
      <div class="meal-info-bar">
        <button class="meal-expand-btn" aria-label="Открыть рецепт">
          <img src="icons/expand.svg" alt="">
        </button>
        <span class="meal-time">${meal.time}</span>
        <div class="meal-text">
          <div class="meal-name">${meal.name}</div>
          <div class="meal-kcal">${kcalText}</div>
        </div>
        <div class="checkbox-wrapper">
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17L4 12"/></svg>
          </div>
        </div>
      </div>
    `;

    const expandBtn = card.querySelector(".meal-expand-btn");
    expandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.app.openRecipe(meal);
    });

    const checkbox = card.querySelector(".checkbox-wrapper");
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowEaten = state.toggleEaten(dayId, meal.id);
      card.classList.toggle("eaten", nowEaten);
    });

    return card;
  }

  showRecipeModal(meal) {
    const modal = document.getElementById("recipeModal");
    const body = document.getElementById("recipeModalBody");

    const kcalText = `${meal.kcal} ккал · Б:${meal.protein} · Ж:${meal.fat} · У:${meal.carbs}`;

    const heroImage = meal.image
      ? `<img class="recipe-hero-image" src="${meal.image}" alt="${meal.name}">`
      : "";

    const stepsHtml = meal.steps
      .map((step, index) => {
        const stepText = typeof step === "string" ? step : step.text;
        const stepImage =
          typeof step === "object" && step.image ? step.image : null;
        const imageHtml = stepImage
          ? `<img class="recipe-step-image" src="${stepImage}" alt="Шаг ${index + 1}" loading="lazy">`
          : "";
        return `
        <li class="recipe-step">
          <div class="recipe-step-text">${stepText}</div>
          ${imageHtml}
        </li>
      `;
      })
      .join("");

    body.innerHTML = `
      ${heroImage}
      <h2 class="recipe-title">${meal.name}</h2>
      <p class="recipe-meta">${kcalText}</p>
      <ol class="recipe-steps">${stepsHtml}</ol>
    `;

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  hideRecipeModal() {
    const modal = document.getElementById("recipeModal");
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

export function initRecipe(mealsData) {
  const modal = document.getElementById("recipe-modal");
  const modalBody = document.getElementById("modal-body");

  if (!modal || !modalBody) {
    console.error("Modal elements not found in DOM");
    return;
  }

  const closeModal = () => modal.classList.remove("open");

  const parseRecipe = (recipeText) => {
    if (!recipeText) return "Рецепт для этого блюда пока не добавлен.";

    const lines = recipeText.split("<br>");
    return lines
      .map((line) => {
        const match = line.match(/^(.+?)\s+(\d+\s*г\.?)$/i);
        if (match) {
          return `<div class="recipe-line"><span class="ingredient">${match[1]}</span><span class="grams">${match[2]}</span></div>`;
        }
        return `<div class="recipe-line">${line}</div>`;
      })
      .join("");
  };

  document.body.addEventListener("click", (event) => {
    const cardBtn = event.target.closest(".card-image-btn");
    if (!cardBtn) return;

    const mealId = cardBtn.dataset.id;
    const meal = mealsData.find((m) => String(m.id) === String(mealId));

    if (!meal) {
      console.warn(`Meal with id ${mealId} not found`);
      return;
    }

    modalBody.innerHTML = `
      <h2 class="modal-title">${meal.title}</h2>
      <div class="modal-meta">${meal.kbju}</div>
      <div class="modal-recipe-text">${parseRecipe(meal.recipe)}</div>
    `;

    modal.classList.add("open");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
}

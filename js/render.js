export class Render {
  isTimeExpired(timeStr) {
    const now = new Date();
    const [h, m] = timeStr.split(':').map(Number);
    const mealTime = new Date();
    mealTime.setHours(h, m, 0, 0);
    return now > mealTime;
  }

  createMealCard(dayId, meal, state) {
    const eaten = state.isEaten(dayId, meal.id);
    const expired = this.isTimeExpired(meal.time);

    const card = document.createElement('div');
    card.className = `meal-card ${expired ? 'expired' : ''} ${eaten ? 'eaten' : ''}`;
    card.id = `card_${meal.id}`;

    const kcalText = `${meal.kcal} ккал · Б:${meal.protein} · Ж:${meal.fat} · У:${meal.carbs}`;

    card.innerHTML = `
      <div class="meal-header">
        <div class="meal-info-left">
          <div class="arrow-icon">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="${expired ? '#8C8A85' : '#1A1A1A'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 1L6 6L11 1"/>
            </svg>
          </div>
          <span class="meal-time">${meal.time}</span>
          <div class="meal-text">
            <span class="meal-name">${meal.name}</span>
            <span class="meal-kcal">${kcalText}</span>
          </div>
        </div>
        <div class="checkbox-wrapper">
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17L4 12"/></svg>
          </div>
        </div>
      </div>
      <div class="recipe-content" id="recipe_${meal.id}">
        <div class="recipe-inner">
          <h4>Пошаговый рецепт:</h4>
          <ol class="steps-list">
            ${meal.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;

    const header = card.querySelector('.meal-header');
    header.addEventListener('click', () => this.toggleRecipe(card, meal.id));

    const checkbox = card.querySelector('.checkbox-wrapper');
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowEaten = state.toggleEaten(dayId, meal.id);
      card.classList.toggle('eaten', nowEaten);
    });

    return card;
  }

  toggleRecipe(card, mealId) {
    const content = document.getElementById(`recipe_${mealId}`);
    if (card.classList.contains('expanded')) {
      card.classList.remove('expanded');
      content.style.maxHeight = '0px';
    } else {
      card.classList.add('expanded');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }
}
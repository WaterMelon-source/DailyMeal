// Imports
import { initCalendar } from "./top-nav.js";
import { initTabs } from "./bottom-nav.js";
import { renderMeals } from "./meals.js";
import { initRecipe } from "./recipe.js";
import { initAuth } from "./auth.js";
import { initOnboarding } from "./onboarding.js";

const meals = [
  {
    id: 1,
    title: "Овсяная каша с аsads пастой и яйцами",
    kbju: "350 ккал | Б 15 | Ж 10 | У 45",
    recipe: "1. Смешать яйцо и овсянку...<br>2. Обжарить на сковороде.",
  },
  {
    id: 2,
    title: "Каша и йогурт",
    kbju: "",
    recipe: "Ячменная крупа 65г.<br>Йогурт 3% 70г.",
  },
];

// Inits
initCalendar();
initTabs();
renderMeals();
initRecipe(meals);
initAuth();
initOnboarding();

// Mouse Scroll
const scrollContainer = document.querySelector(".top-nav");

scrollContainer.addEventListener(
  "wheel",
  (evt) => {
    evt.preventDefault();

    // If scrolling down/right, move right by container width. Otherwise, move left.
    const direction = evt.deltaY > 0 ? 1 : -1;
    const containerWidth = scrollContainer.clientWidth;

    scrollContainer.scrollBy({
      left: containerWidth * direction,
      behavior: "smooth", // Keep this CSS-linked smooth styling
    });
  },
  { passive: false },
);

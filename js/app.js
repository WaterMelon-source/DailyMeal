// Imports
import { initCalendar } from "./top-nav.js";
import { initTabs } from "./bottom-nav.js";

// Inits
initCalendar();
initTabs();

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

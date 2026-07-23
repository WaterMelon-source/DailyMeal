export function initTabs() {
  const menu = document.getElementById("buttonsMenu");
  if (!menu) return;

  const tabs = menu.querySelectorAll(".nav-tab");
  const contents = document.querySelectorAll(".tab-content");
  const topNav = document.querySelector(".top-nav");

  const updateUI = (activeTab) => {
    const isTimerTab = activeTab?.dataset.target === "timer";

    if (topNav) {
      topNav.classList.toggle("hidden", !isTimerTab);
    }

    tabs.forEach((tab) => {
      const img = tab.querySelector(".tab-icon");
      const isActive = tab === activeTab;

      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;

      if (img) {
        const currentSrc = img.getAttribute("src");
        const baseSrc =
          img.dataset.baseSrc || currentSrc.replace("-active.svg", ".svg");
        img.dataset.baseSrc = baseSrc;
        img.setAttribute(
          "src",
          isActive ? baseSrc.replace(".svg", "-active.svg") : baseSrc,
        );
      }
    });

    contents.forEach((content) => {
      const isActiveContent = content.id === activeTab?.dataset.target;
      content.classList.toggle("active", isActiveContent);
    });
  };

  const initialActiveTab = menu.querySelector(".nav-tab.active");
  updateUI(initialActiveTab);

  menu.addEventListener("click", (e) => {
    const tab = e.target.closest(".nav-tab");
    if (tab) {
      e.preventDefault();
      updateUI(tab);
    }
  });
}

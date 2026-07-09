export function initTabs() {
  const menu = document.getElementById("buttonsMenu");
  if (!menu) return;

  const tabs = menu.querySelectorAll(".nav-tab");
  const contents = document.querySelectorAll(".tab-content");

  const updateUI = (activeTab) => {
    tabs.forEach((tab) => {
      const img = tab.querySelector(".tab-icon");
      const isActive = tab === activeTab;
      tab.classList.toggle("active", isActive);

      const basePath = img.src.replace("-active.svg", ".svg");
      img.src = isActive ? basePath.replace(".svg", "-active.svg") : basePath;
    });
    contents.forEach((c) =>
      c.classList.toggle("active", c.id === activeTab?.dataset.target),
    );
  };

  updateUI(menu.querySelector(".nav-tab.active"));

  menu.addEventListener("click", (e) => {
    const tab = e.target.closest(".nav-tab");
    if (tab) e.preventDefault() || updateUI(tab);
  });
}

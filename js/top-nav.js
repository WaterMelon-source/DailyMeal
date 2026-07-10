export function initCalendar() {
  const menu = document.getElementById("calendarMenu");
  if (!menu) return;

  const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

  const getLocalDateStr = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const todayStr = getLocalDateStr(new Date());

  menu.innerHTML = Array.from({ length: 360 }, (_, i) => {
    const d = new Date(2026, 6, 1 + i);
    const iso = getLocalDateStr(d);
    return `
      <li class="calendar-item">
        <a href="#date-${iso}" class="day-link ${iso === todayStr ? "active" : ""}">
          <span class="day-name no-select">${days[(d.getDay() + 6) % 7]}</span>
          <span class="day-number no-select">${d.getDate()}</span>
        </a>
      </li>`;
  }).join("");

  const activeDay = menu.querySelector(".day-link.active");
  if (activeDay) {
    setTimeout(
      () => activeDay.scrollIntoView({ behavior: "smooth", inline: "center" }),
      100,
    );
  }

  menu.addEventListener("click", (e) => {
    const link = e.target.closest(".day-link");
    if (!link) return;
    e.preventDefault();
    menu.querySelector(".day-link.active")?.classList.remove("active");
    link.classList.add("active");
  });
}

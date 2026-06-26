export class Router {
  constructor(routes, defaultRoute) {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this.currentRoute = null;
  }

  init() {
    const path = this.getCurrentPath();
    this.navigate(path, false);
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  navigate(path, updateHistory = true) {
    // Нормализация пути
    if (!path || path === "") path = "/";

    // Проверка существования маршрута
    const route = this.routes[path] || this.routes[this.defaultRoute];
    if (!route) {
      console.warn(`Route not found: ${path}`);
      path = this.defaultRoute;
    }

    // Обновление URL через replaceState (без создания записей в истории)
    if (updateHistory) {
      window.history.replaceState({ path }, "", path);
    }

    // Вызов обработчика маршрута
    this.currentRoute = path;
    if (route) route();
  }

  isActive(path) {
    return this.currentRoute === path;
  }
}

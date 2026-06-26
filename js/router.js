// js/router.js
export class Router {
  constructor() {
    this.routes = {};
    this.currentPath = null;
    window.addEventListener("popstate", () => this.handleLocation());
  }

  define(path, callback) {
    this.routes[path] = callback;
  }

  navigate(path) {
    if (this.currentPath === path) return;
    window.history.pushState({ path }, "", path);
    this.handleLocation();
  }

  handleLocation() {
    let path = window.location.pathname || "/";
    const stored = sessionStorage.getItem("spa-path");

    if (stored && path === "/") {
      path = stored;
      sessionStorage.removeItem("spa-path");
      window.history.replaceState({}, "", path);
    }

    this.currentPath = path;
    const handler = this.routes[path] || this.routes["/menu"];
    if (handler) handler();
  }

  init() {
    this.handleLocation();
  }
}

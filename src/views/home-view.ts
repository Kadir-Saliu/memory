import { renderSettings } from "./setting-view";
import { getHomeTemplate } from "../templates/home-template";

const APP = document.getElementById("app") as HTMLElement;

/**
 * Renders the Home Screen by injecting the template into the main app container
 * and initializing all required event listeners.
 *
 * This function performs no UI logic itself — it only delegates rendering
 * and event binding to helper functions.
 */
export function renderHome(): void {
  APP.innerHTML = APP.innerHTML = getHomeTemplate();

  initHomeEvents();
}

/**
 * Initializes all event listeners for the Home screen.
 *
 * Responsibilities:
 * - Activates the "Start" button on the Home view
 * - Navigates to the Settings screen when the button is clicked
 *
 * This function is called after the Home template is rendered.
 *
 * @returns void
 */
function initHomeEvents(): void {
  const startBtn = document.getElementById("start-btn") as HTMLButtonElement;

  startBtn.addEventListener("click", () => {
    renderSettings();
  });
}

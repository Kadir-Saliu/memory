/**
 * Entry point of the application.
 *
 * Responsibilities:
 * - Loads all global and view‑specific SCSS styles
 * - Imports the renderer for the Home screen
 * - Initializes the application by rendering the Home view
 *
 * This file is executed once when the application starts.
 * It ensures that the initial UI is displayed before any user interaction occurs.
 */

import { renderHome } from "./views/home-view";

// Global and screen‑specific styles
import "./styles/main.scss";
import "./styles/game.scss";
import "./styles/global.scss";

// Render the initial Home screen
renderHome();

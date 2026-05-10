/**
 * Entry point of the application.
 *
 * Responsibilities:
 * - Imports global and view-specific styles
 * - Imports the home screen renderer
 * - Renders the initial Home view on application start
 */
import { renderHome } from "./views/home-view";
import "./styles/main.scss";
import "./styles/game.scss";
import "./styles/global.scss";

renderHome();

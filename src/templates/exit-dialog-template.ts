/**
 * Returns the HTML template for the exit confirmation dialog.
 *
 * The dialog includes:
 * - A message asking the user to confirm quitting the game
 * - A cancel button that closes the dialog
 * - A confirm button that triggers the exit action
 *
 * @returns A string containing the full HTML structure of the exit dialog.
 */
export function getExitDialogTemplate(): string {
  return `
<div class="exit-dialog-overlay hidden">
  <div class="exit-dialog">
    <p class="exit-dialog__text">
      Are you sure you want to<br />quit the game?
    </p>

    <div class="exit-dialog__buttons">
      <button class="exit-dialog__btn exit-dialog__cancel">
        No, back to Game
      </button>
      <button class="exit-dialog__btn exit-dialog__confirm">
        Exit Game
      </button>
    </div>
  </div>
</div>
  `;
}

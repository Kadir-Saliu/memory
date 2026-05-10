/**
 * Returns the HTML template for a single memory card.
 *
 * The card consists of:
 * - A front side showing the theme-specific back image
 * - A back side showing the numbered card image
 *
 * @param theme - The active theme ("code" or "gaming"), used to resolve image paths.
 * @param num - The card number used to load the correct image for the card back.
 * @returns A string containing the full HTML structure of the card.
 */
export function getCardTemplate(theme: string, num: number): string {
  return `
    <div class="card__inner">
      <div class="card__front">
        <img src="/cards/${theme}/back.png" alt="">
      </div>
      <div class="card__back">
        <img src="/cards/${theme}/${num}.png" alt="">
      </div>
    </div>
  `;
}

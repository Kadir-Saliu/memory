/**
 * Initializes a simple click counter on the provided button element.
 *
 * Functionality:
 * - Displays the current counter value inside the button
 * - Increments the counter on each click
 * - Updates the button label dynamically using an internal setter function
 *
 * This utility is mainly used for testing or demo purposes and is not part
 * of the core game logic.
 *
 * @param element - The button element that will display and update the counter.
 *                  Must be a valid `<button>` element in the DOM.
 *
 * @returns void
 */
export function setupCounter(element: HTMLButtonElement): void {
  let counter = 0;

  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `Count is ${counter}`;
  };

  element.addEventListener("click", () => setCounter(counter + 1));

  setCounter(0);
}

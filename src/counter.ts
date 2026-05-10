/**
 * Initializes a simple click counter on the given button element.
 *
 * Behavior:
 * - Displays the current counter value inside the button
 * - Increments the counter on each click
 *
 * @param element The button element that will display and update the counter.
 */
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `Count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}

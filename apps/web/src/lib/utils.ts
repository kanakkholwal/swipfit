/**
 * Randomly shuffles the elements of an array using the Fisher-Yates algorithm.
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The array to be shuffled
 * @returns {T[]} A new array with the same elements in a random order
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffledNumbers = shuffle(numbers);
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap elements
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array; // Return the shuffled array for better function usability
}

/**
 * Formats a number into a compact representation using K, M, B suffixes.
 *
 * @param {number} num - The number to format
 * @returns {string} The formatted string representation
 *
 * @example
 * formatNumber(2500);      // '2.5K'
 * formatNumber(1000000);   // '1M'
 * formatNumber(500000000); // '500M'
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
}

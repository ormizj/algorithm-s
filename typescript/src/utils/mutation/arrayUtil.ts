/**
 * Randomly sorts an array based on weighted probability.
 *
 * Each element is assigned a weight through the `weightCb` callback.
 * Elements with higher weights have a proportionally higher chance
 * of appearing earlier in the resulting array.
 *
 * This implementation performs a weighted shuffle by repeatedly:
 *   1. Calculating the total weight of all remaining elements.
 *	 2. Picking a random point within that total weight.
 *   3. Selecting an element based on weighted distribution.
 *   4. Removing it from the pool and appending it to the result.
 *
 * @typeParam T - Type of array elements.
 *
 * @param arr - The input array to be weighted and shuffled.
 * @param weightCb - A callback that receives an element and returns
 * a numeric weight. Must be non-negative.
 *
 * @returns A new array with elements ordered by weighted randomness.
 *
 * @example
 *   ```ts
 *   const items = [
 *   	{ name: 'Common', rarity: 8 },
 *   	{ name: 'Uncommon', rarity: 4 },
 *   	{ name: 'Rare', rarity: 2 },
 *   	{ name: 'Epic', rarity: 1 },
 *   ];
 *   const sorted = weightedSort(items, item => item.rarity);
 *   ```
 */
export const weightedSort = <T>(arr: T[], weightCb: (el: T) => number) => {
	const result: T[] = [];
	const remaining = [...arr];

	/**
	 * goes over all the elements,
	 * sums up the `totalWeight` of all the elements in the `remaining` array and multiplies it by a random number;
	 * the weight of each element subtracts from the `totalWeight`, the element that reduces `totalWeight` to below 0
	 * is the `selectedIndex`; the `selectedIndex` will be pushed to the `result` array, and removed from the `remaining` array
	 */
	while (remaining.length > 0) {
		const totalWeight = remaining.reduce((sum, el) => sum + weightCb(el), 0);
		let random = Math.random() * totalWeight;
		let selectedIndex = 0;
		for (let i = 0; i < remaining.length; i++) {
			random -= weightCb(remaining[i]);
			if (random > 0) continue;
			selectedIndex = i;
			break;
		}
		result.push(remaining[selectedIndex]);
		remaining.splice(selectedIndex, 1);
	}
	return result;
};

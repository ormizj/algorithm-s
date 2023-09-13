/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function (ratings) {
    const length = ratings.length;
    const candies = new Array(length).fill(1);

    for (let i = 1; i < length; i++) {
        const currRating = ratings[i];
        const prevRating = ratings[i - 1];

        if (prevRating < currRating) {
            const prevCandies = candies[i - 1];
            candies[i] = prevCandies + 1;
        }
    }

    for (let i = length - 2; i >= 0; i--) {
        const currRating = ratings[i];
        const nextRating = ratings[i + 1];
        const currCandies = candies[i];
        const nextCandies = candies[i + 1]

        if (currRating > nextRating && currCandies <= nextCandies) {
            candies[i] = nextCandies + 1;
        }
    }

    return candies.reduce((sum, val) => sum + val);
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = candy;
printResult({ answerCb, expected: 5, input: { ratings: [1, 0, 2] } });
printResult({ answerCb, expected: 4, input: { ratings: [1, 2, 2] } });
printResult({ answerCb, expected: 9, input: { ratings: [1, 2, 1, 4, 5] } });

printEnd();

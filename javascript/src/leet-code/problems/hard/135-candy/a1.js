/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function (ratings) {
  let numOfCandies = ratings.length;
  const givenCandies = {};

  let index = -1;
  while (++index < ratings.length) {
    givenCandies[index] = 1;
  }

  let toResetI = false;
  for (let i = 0; i < ratings.length; i++) {
    const prevRating = ratings[i - 1];
    const currRating = ratings[i];
    const prevCandies = givenCandies[i - 1];
    const currCandies = givenCandies[i];

    if (currRating > prevRating && currCandies <= prevCandies) {
      givenCandies[i]++;
      numOfCandies++;
      toResetI = true;
    } else if (currRating < prevRating && prevCandies <= currCandies) {
      givenCandies[i - 1]++;
      numOfCandies++;
      toResetI = true;
    }

    if (i + 1 <= ratings.length && toResetI) {
      toResetI = false;
      i = -1;
    }
  }

  return numOfCandies;
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = candy;
printResult({ answerCb, expected: 5, input: { ratings: [1, 0, 2] } });
printResult({ answerCb, expected: 4, input: { ratings: [1, 2, 2] } });

printEnd();

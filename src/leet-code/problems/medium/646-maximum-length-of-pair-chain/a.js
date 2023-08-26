/**
 * @param {number[][]} pairs
 * @return {number}
 */
var findLongestChain = function (pairs) {
    const pairsMap = {};
    let startingKey = pairs[0][0];
    let endingKey = pairs[0][0];

    for (const pair of pairs) {
        pairsMap[pair[0]] = pair[1] - pair[0];

        if (startingKey > pair[0]) startingKey = pair[0];
        else if (endingKey < pair[0]) endingKey = pair[0];
    }

    const checkPairs = (pairKey, longestChain) => {
        if (pairKey > endingKey) return longestChain;

        let addedChain = longestChain;
        let newPairKey = pairKey;

        const leap = pairsMap[pairKey] + 1;
        if (pairsMap[leap] !== undefined) {
            addedChain++;
            newPairKey += pairsMap[leap];
        }

        return Math.max(
            checkPairs(pairKey + 1, longestChain),
            checkPairs(newPairKey, addedChain),
        );
    }

    return checkPairs(startingKey, 1);
};

//TODO WIP

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = findLongestChain;
printResult({ answerCb, expected: 2, input: { pairs: [[1, 2], [2, 3], [3, 4]] } });
// printResult({ answerCb, expected: 3, input: { pairs: [[1, 2], [7, 8], [4, 5]] } });
// printResult({ answerCb, expected: 4, input: { pairs: [[-10, -8], [8, 9], [-5, 0], [6, 10], [-6, -4], [1, 7], [9, 10], [-4, 7]] } });

printEnd();

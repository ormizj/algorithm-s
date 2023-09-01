/**
 * @param {number[][]} pairs
 * @return {number}
 */
function findLongestChain(pairs) {
    pairs.sort((a, b) => a[1] - b[1]);

    let chain = 1;
    let prev = pairs[0];

    for (let i = 1; i < pairs.length; i++) {
        let curr = pairs[i];

        if (curr[0] > prev[1]) {
            prev = curr;
            chain++;
        }
    }

    return chain;
}

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = findLongestChain;
printResult({ answerCb, expected: 2, input: { pairs: [[1, 2], [2, 3], [3, 4]] } });
printResult({ answerCb, expected: 3, input: { pairs: [[1, 2], [7, 8], [4, 5]] } });
printResult({ answerCb, expected: 4, input: { pairs: [[-10, -8], [8, 9], [-5, 0], [6, 10], [-6, -4], [1, 7], [9, 10], [-4, 7]] } });
printResult({ answerCb, expected: 3, input: { pairs: [[-6, 9], [1, 6], [8, 10], [-1, 4], [-6, -2], [-9, 8], [-5, 3], [0, 3]] } });

printEnd();

/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function (matrix) {
    const transpose = [];
    let column = matrix[0].length;
    let row = matrix.length;

    for (const number of matrix[0]) {
        transpose.push([]);
    }

    let i = 0;
    while (i < row) {
        let j = 0;
        while (j < column) {
            const pushedNumber = matrix[i][j];
            transpose[j].push(pushedNumber);
            j++;
        }
        i++;
    }

    return transpose;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = transpose;
printResult({ answerCb, expected: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] } });
printResult({ answerCb, expected: [[1, 4], [2, 5], [3, 6]], input: { matrix: [[1, 2, 3], [4, 5, 6]] } });

printEnd();

/**
 * @param {number[][]} mat
 * @return {number}
 */
var numSpecial = function (mat) {
    const validColumns = {};
    const validRows = {};

    for (let i = 0; i < mat.length; i++) {
        const row = mat[i];
        let onesInRow = 0;

        for (let j = 0; j < row.length; j++) {
            const number = row[j];
            if (number !== 1) continue;

            onesInRow++;

            if (validColumns[j] === undefined) validColumns[j] = i;
            else validColumns[j] = -1;
        }

        if (onesInRow === 1) validRows[i] = true;
    }

    let specialPositions = 0;
    for (const specialPositionRow of Object.values(validColumns)) {
        if (specialPositionRow > -1 && validRows[specialPositionRow]) specialPositions++;
    }

    return specialPositions;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = numSpecial;
printResult({ answerCb, expected: 1, input: { mat: [[1, 0, 0], [0, 0, 1], [1, 0, 0]] } });
printResult({ answerCb, expected: 3, input: { mat: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] } });
printResult({ answerCb, expected: 2, input: { mat: [[0, 0, 0, 1], [1, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]] } });

printEnd();

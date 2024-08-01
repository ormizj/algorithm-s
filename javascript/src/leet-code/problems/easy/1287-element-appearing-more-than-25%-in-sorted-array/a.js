/**
 * @param {number[]} arr
 * @return {number}
 */
var findSpecialInteger = function (arr) {
    let threshold = arr.length / 4;
    let curCount = 1;
    let curNum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === curNum) {
            curCount++;
            if (curCount > threshold) break;

        } else {
            curCount = 1;
            curNum = arr[i];
        }
    }

    return curNum;
};
/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = findSpecialInteger;
printResult({ answerCb, expected: 6, input: { arr: [1, 2, 2, 6, 6, 6, 6, 7, 10] } });
printResult({ answerCb, expected: 1, input: { arr: [1, 1] } });

printEnd();

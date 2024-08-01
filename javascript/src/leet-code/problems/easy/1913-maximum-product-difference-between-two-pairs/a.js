/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProductDifference = function (nums) {
    let prevMin = Number.MAX_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let prevMax = 0;
    let max = 0;

    for (const num of nums) {
        if (num < prevMin) {
            if (num < min) {
                prevMin = min;
                min = num;

            } else {
                prevMin = num;
            }
        }

        if (num > prevMax) {
            if (num > max) {
                prevMax = max;
                max = num;

            } else {
                prevMax = num;
            }
        }
    }

    return (prevMax * max) - (prevMin * min);
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = maxProductDifference;
printResult({ answerCb, expected: 34, input: { num: [5, 6, 2, 7, 4] } });
printResult({ answerCb, expected: 64, input: { num: [4, 2, 5, 9, 7, 4, 8] } });

printEnd();

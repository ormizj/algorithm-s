/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
    let preMax = -1;
    let max = -1;

    for (let i = 0; i < nums.length; i++) {
        const number = nums[i];

        if (number > preMax) {
            if (number > max) {
                preMax = max;
                max = number;

            } else {
                preMax = number;
            }
        }
    }

    return (preMax - 1) * (max - 1);
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = maxProduct;
printResult({ answerCb, expected: 12, input: { nums: [3, 4, 5, 2] } });
printResult({ answerCb, expected: 16, input: { nums: [1, 5, 4, 5] } });
printResult({ answerCb, expected: 12, input: { nums: [3, 7] } });

printEnd();

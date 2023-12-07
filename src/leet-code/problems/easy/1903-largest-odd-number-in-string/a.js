/**
 * @param {string} num
 * @return {string}
 */
var largestOddNumber = function (num) {
    for (let i = num.length - 1; i >= 0; i--) {
        if (num[i] % 2 !== 0) {
            return num.slice(0, i + 1);
        }
    }

    return '';
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = largestOddNumber;
printResult({ answerCb, expected: '5', input: { num: '52' } });
printResult({ answerCb, expected: '', input: { num: '4206' } });
printResult({ answerCb, expected: '35427', input: { num: '35427' } });

printEnd();

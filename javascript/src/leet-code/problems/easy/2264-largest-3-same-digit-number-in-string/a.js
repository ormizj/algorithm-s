/**
 * @param {string} num
 * @return {string}
 */
var largestGoodInteger = function (num) {
    let maxSeriesNumber = -1;

    for (let i = 0; i < num.length - 2; i++) {
        const digit1 = num[i];
        const digit2 = num[i + 1];
        const digit3 = num[i + 2];

        if (digit1 === digit2 && digit2 === digit3) {
            const seriesNumber = Number(digit1);

            if (seriesNumber > maxSeriesNumber) {
                maxSeriesNumber = seriesNumber;
            }
        }
    }

    if (maxSeriesNumber === -1) return '';
    return `${maxSeriesNumber}${maxSeriesNumber}${maxSeriesNumber}`;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = largestGoodInteger;
printResult({ answerCb, expected: '777', input: { num: '6777133339' } });
printResult({ answerCb, expected: '000', input: { num: '2300019' } });
printResult({ answerCb, expected: '', input: { num: '42352338' } });

printEnd();

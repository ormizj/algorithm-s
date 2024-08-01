/**
 * @param {number} n
 * @return {number}
 */
var totalMoney = function (n) {
    let day = 1;
    let week = 0;
    let saved = 0;

    while (n > 0) {
        saved += day + week;

        if (day === 7) {
            day = 0;
            week++;
        }

        day++;
        n--;
    }

    return saved;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = totalMoney;
printResult({ answerCb, expected: 10, input: { n: 4 } });
printResult({ answerCb, expected: 37, input: { n: 10 } });
printResult({ answerCb, expected: 96, input: { n: 20 } });

printEnd();

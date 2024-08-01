/**
 * @param {number} n
 * @return {number}
 */
var numberOfMatches = function (n) {
    let matches = 0;

    while (n > 1) {
        const oldN = n;
        n = Math.round(n / 2);

        if (oldN % 2 === 0) {
            matches += n;

        } else {
            matches += n - 1
        }
    }

    return matches;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = numberOfMatches;
printResult({ answerCb, expected: 6, input: { n: 7 } });
printResult({ answerCb, expected: 13, input: { n: 14 } });

printEnd();

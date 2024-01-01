/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function (g, s) {
    let suppliedCookies = 0;
    let cookieI = s.length - 1;
    let childI = g.length - 1;

    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);

    while (cookieI >= 0 && childI >= 0) {
        if (g[childI] <= s[cookieI]) {
            suppliedCookies++;
            cookieI--;
        }

        childI--;
    }

    return suppliedCookies;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = findContentChildren;
printResult({ answerCb, expected: 1, input: { g: [1, 2, 3], s: [1, 1] } });
printResult({ answerCb, expected: 2, input: { g: [1, 2], s: [1, 2, 3] } });
printResult({ answerCb, expected: 2, input: { g: [1, 2, 3], s: [3, 3] } });

printEnd();

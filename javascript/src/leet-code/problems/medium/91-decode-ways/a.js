var numDecodings = function (s) {
    const dp = new Array(s.length + 1).fill(0);

    dp[s.length] = 1;

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === "0") continue;
        dp[i] = dp[i + 1];
        if (s[i] + s[i + 1] <= 26) dp[i] += dp[i + 2];
    }

    return dp[0];
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = numDecodings;
printResult({ answerCb, expected: 2, input: { s: '12' } });
printResult({ answerCb, expected: 3, input: { s: '226' } });
printResult({ answerCb, expected: 0, input: { s: '06' } });
printResult({ answerCb, expected: 1836311903, input: { s: '111111111111111111111111111111111111111111111' } });

printEnd();
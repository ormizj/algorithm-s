const mod = Math.pow(10, 9) + 7;

/**
 * @param {number} n
 * @param {number} k
 * @param {number} target
 * @return {number}
 */
var numRollsToTarget = (n, k, target) => {
    const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(-1));
    return recursion(dp, n, k, target);
}

const recursion = (dp, n, k, target) => {
    if (target === 0 && n === 0) return 1;
    if (n === 0 || target <= 0) return 0;

    if (dp[n][target] !== -1) return dp[n][target] % mod;

    let ways = 0;
    for (let i = 1; i <= k; i++) {
        ways = (ways + recursion(dp, n - 1, k, target - i)) % mod;
    }
    dp[n][target] = ways % mod;

    return dp[n][target];
}

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = numRollsToTarget;
printResult({ answerCb, expected: 1, input: { n: 1, k: 6, target: 3 } });
printResult({ answerCb, expected: 6, input: { n: 2, k: 6, target: 7 } });
printResult({ answerCb, expected: 222616187, input: { n: 30, k: 30, target: 500 } });

printEnd();
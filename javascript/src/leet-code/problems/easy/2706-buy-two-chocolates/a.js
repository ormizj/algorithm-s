/**
 * @param {number[]} prices
 * @param {number} money
 * @return {number}
 */
var buyChoco = function (prices, money) {
    prices.sort((a, b) => a - b);
    const surplus = money - prices[1] - prices[0];
    return surplus >= 0 ? surplus : money;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = buyChoco;
printResult({ answerCb, expected: 0, input: { prices: [1, 2, 2], money: 3 } });
printResult({ answerCb, expected: 3, input: { prices: [3, 2, 3], money: 3 } });
printResult({ answerCb, expected: 1, input: { prices: [1, 1, 4], money: 3 } });
printResult({ answerCb, expected: 22, input: { prices: [98, 54, 6, 34, 66, 63, 52, 39], money: 62 } });

printEnd();

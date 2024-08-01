/**
 * @param {string} s
 * @return {number}
 */
var minOperations = function (s) {
    let minReqChanges = -1;
    let evenNum = s[0];
    let oddNum = evenNum === '1' ? '0' : '1';

    while (true) {
        let reqChanges = 0;

        for (let i = 0; i < s.length; i++) {
            if (i % 2 === 0 && s[i] !== evenNum) {
                reqChanges++;

            } else if (i % 2 !== 0 && s[i] !== oddNum) {
                reqChanges++;
            }
        }

        // break if both cases are tested
        if (minReqChanges !== -1) {
            minReqChanges = Math.min(minReqChanges, reqChanges);
            break;
        }

        // invert tests, if only 1 case is tested
        minReqChanges = reqChanges;
        const temp = evenNum;
        evenNum = oddNum;
        oddNum = temp;
    }

    return minReqChanges;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = minOperations;
printResult({ answerCb, expected: 1, input: { s: "0100" } });
printResult({ answerCb, expected: 0, input: { s: "10" } });
printResult({ answerCb, expected: 2, input: { s: "1111" } });
printResult({ answerCb, expected: 3, input: { s: "10010100" } });

printEnd();

/**
 * @param {string} s
 * @return {number}
 */
var maxLengthBetweenEqualCharacters = function (s) {
    const lettersIndexes = {};
    let longestSubStrRange = -1;

    for (let i = 0; i < s.length; i++) {
        if (lettersIndexes[s[i]] === undefined) {
            lettersIndexes[s[i]] = [i];
        } else {
            lettersIndexes[s[i]].push(i);
        }
    }

    const indexesArr = Object.values(lettersIndexes)

    indexesArr.forEach((indexArr) => {
        let subStrRange = indexArr[indexArr.length - 1] - indexArr[0] - 1;

        if (subStrRange > longestSubStrRange) {
            longestSubStrRange = subStrRange;
        }
    })

    return longestSubStrRange;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = maxLengthBetweenEqualCharacters;
printResult({ answerCb, expected: 0, input: { s: 'aa' } });
printResult({ answerCb, expected: 2, input: { s: 'abca' } });
printResult({ answerCb, expected: -1, input: { s: 'cbzxy' } });
printResult({ answerCb, expected: 4, input: { s: 'ababca' } });

printEnd();

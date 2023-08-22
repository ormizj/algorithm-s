/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let stringMap = {};
    let maxLength = 0;
    let currentLength = 0;

    for (let i = 0; i < s.length; i++) {
        if (stringMap[s[i]] === undefined) {
            stringMap[s[i]] = i;
            currentLength++;

        } else {
            if (currentLength > maxLength) maxLength = currentLength;
            i = stringMap[s[i]];
            stringMap = {};
            currentLength = 0;
        }
    }

    return Math.max(maxLength, currentLength);
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

printResult({ answerCb: lengthOfLongestSubstring, expected: 3, input: { s: 'abcabcbb' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 1, input: { s: 'bbbbb' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 3, input: { s: 'pwwkew' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 2, input: { s: 'aab' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 3, input: { s: 'dvdf' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 1, input: { s: ' ' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 2, input: { s: 'au' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 2, input: { s: 'cdd' } });
printResult({ answerCb: lengthOfLongestSubstring, expected: 2, input: { s: 'abba' } });
printEnd();

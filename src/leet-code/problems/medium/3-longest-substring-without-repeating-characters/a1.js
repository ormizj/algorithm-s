/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let charMap = {};
    let left = 0;
    let max = 0;

    for (let right = 0; right < s.length; right++) {

        if (charMap[s[right]] !== undefined) {
            left = Math.max(left, charMap[s[right]] + 1);
        }

        charMap[s[right]] = right;
        max = Math.max(max, right - left + 1);
    }

    return max;
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

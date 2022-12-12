/**
 * @param {string} s
 * @return {string}
 */
const makeGood = function (s) {
    for (let i = 0; i < s.length - 1; i++) {
        if (isSameLetter(s[i], s[i + 1]) && s[i] !== s[i + 1]) {
            s = removeByIndex(s, i, 2);
            i = -1;
        }
    }

    return s;
};

const isSameLetter = (char, oChar) => char.toLowerCase() === oChar.toLowerCase();

const removeByIndex = (str, index, count) => str.slice(0, index) + str.slice(index + count);



/*----------------------------------------------------------------------------------------------------*/
import { printResult } from "../../../answerUtil.mjs";
printResult({ answerCb: makeGood, expected: ['leetcode'], input: { s: 'leEeetcode' } });
printResult({ answerCb: makeGood, expected: [''], input: { s: 'abBAcC' } });
printResult({ answerCb: makeGood, expected: ['s'], input: { s: 's' } });

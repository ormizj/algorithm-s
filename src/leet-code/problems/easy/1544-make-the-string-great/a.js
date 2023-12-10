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
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = makeGood;
printResult({ answerCb, expected: 'leetcode', input: { s: 'leEeetcode' } });
printResult({ answerCb, expected: '', input: { s: 'abBAcC' } });
printResult({ answerCb, expected: 's', input: { s: 's' } });

printEnd();

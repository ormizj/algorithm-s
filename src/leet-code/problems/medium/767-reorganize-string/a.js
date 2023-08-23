/**
 * @param {string} s
 * @return {string}
 */
var reorganizeString = function (s) {
    let newString = '';

    let i = 0;
    while (s[i] || newString[i]) {
        if (s.length === 0) return newString;

        const currentIndex = newString[i] !== undefined ? i : newString.length - 1;
        const afterIndex = newString[i + 1] !== undefined ? i + 1 : newString.length - 1;
        const sIndex = s[i] !== undefined ? i : s.length - 1;
        let charAdded = false;

        if (newString[currentIndex] !== s[sIndex] && newString[afterIndex] !== s[sIndex]) {
            newString = newString.slice(0, afterIndex) + s[sIndex] + newString.slice(afterIndex);
            charAdded = true;
        } else {
            if (newString[0] !== s[sIndex]) {
                newString = s[sIndex] + newString;
                charAdded = true;
            } else if (newString[newString.length - 1] !== s[sIndex]) {
                newString += s[sIndex];
                charAdded = true;
            }
        }

        if (charAdded) {
            s = s.slice(0, sIndex) + s.slice(sIndex + 1);
            i = 0;
        } else {
            i++;
        }
    }

    return '';
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = reorganizeString;
printResult({ answerCb, expected: 'aba', input: { s: 'aab' } });
printResult({ answerCb, expected: '', input: { s: 'aaab' } });
printResult({ answerCb, expected: 'ababa', input: { s: 'baaba' } });
printResult({ answerCb, expected: 'vlvov', input: { s: 'vvvlo' } });
printResult({ answerCb, expected: 'babab', input: { s: 'baabb' } });

printEnd();

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {
  let astToggle = false;
  let astLetter = "";
  let pIndex = 0;

  for (const sLetter of s) {
    if (p[pIndex] === "*") {
      astToggle = true;
      astLetter = p[pIndex - 1];
      pIndex++;

      if (astLetter === ".") return true;
    }

    if (p[pIndex] !== ".") {
      let pLetter = p[pIndex];

      if (astToggle) {
        if (astLetter === sLetter) {
          continue;
        }

        if (pLetter === sLetter) {
          astToggle = false;
          pIndex++;
          continue;
        }
      } else {
        if (pLetter !== sLetter) return false;
      }
    }

    pIndex++;
  }

  return true;
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = isMatch;
printResult({ answerCb, expected: false, input: { s: "aa", p: "a" } });
printResult({ answerCb, expected: true, input: { s: "aa", p: "a*" } });
printResult({ answerCb, expected: true, input: { s: "ab", p: ".*" } });
printResult({ answerCb, expected: true, input: { s: "aab", p: "c*a*b" } });

printEnd();

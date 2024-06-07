import chalk from 'chalk';
import { objEqual, forIn, objEqualMessy, isObject } from '../utils/pure/objectUtil.js';
import { vTypeOf } from '../utils/pure/jsUtil.js';

const SPACE = `    `;
const DASH = `----------`;
const START = chalk.green(`START`);
const END = chalk.green(`END`);

// prints
console.log(`\n${SPACE}${DASH}${START}${DASH}\n`); //prints "----------START----------" on import
export const printEnd = () => setTimeout(() => console.log(`${SPACE}${DASH}-${END}-${DASH}\n`));

export const printResult = ({ answerCb, expected, input = {}, isOrder = false } = {}) => {
    const inputPrint = beautify(input); // preparing the answer, in-case of mutation to the input
    const actual = runAnswer(input, answerCb);

    let answer;
    if (calculateAnswer({ expected, actual, isOrder })) {
        answer = chalk.blue(`Accepted`);
    } else {
        answer = chalk.red(`Wrong Answer`);
    }

    console.log(`${SPACE}${answer}
    Input:    ${inputPrint}
    Output:   ${beautify(actual)}
    Expected: ${beautify(expected)}
    `);
}

const runAnswer = (input = {}, answerCb) => {
    const inputValues = Object.values(input);
    return answerCb.apply(null, inputValues);
}

const beautify = (toBeautify) => {
    let beautified = '';

    const removeBeautifiedExcess = () => {
        beautified = beautified.substring(0, beautified.length - 2);
    }

    const beautifyHelper = (obj) => {
        forIn(obj, (value, key) => {
            if (isNaN(key)) beautified += `${key}: `;

            if (Array.isArray(value)) {
                beautified += `[`;
                if (value.length > 0) {
                    beautifyHelper(value);
                    removeBeautifiedExcess();
                }
                beautified += `], `;

            } else if (isObject(value)) {
                beautified += `{`;
                if (Object.keys(value).length > 0) {
                    beautifyHelper(value);
                    removeBeautifiedExcess();
                }
                beautified += `}, `;

            } else {
                beautified += `${value}, `;
            }
        });
    }

    if (typeof toBeautify === 'object') {
        let start = '{ ';
        let end = ' }';

        if (Array.isArray(toBeautify)) {
            start = '[ ';
            end = ' ]';
        }

        beautified = start;
        beautifyHelper(toBeautify);
        removeBeautifiedExcess();
        beautified += end;

        return beautified;
    }

    return toBeautify;
}

const calculateAnswer = ({ expected, actual, isOrder = false } = {}) => {
    const type = vTypeOf(expected);

    if (type === 'object' || type === 'array') {
        if (isOrder) {
            return objEqual(expected, actual);

        } else {
            return objEqualMessy(expected, actual);
        };
    }

    return expected === actual;
}
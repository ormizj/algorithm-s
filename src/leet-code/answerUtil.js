import chalk from 'chalk';
import { objEqual, objSize, forIn, objEqualMessy, isObject } from '../utils/pure/objectUtil.js';
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
    if (Array.isArray(toBeautify)) return beautifyObject([toBeautify]);
    else if (isObject(toBeautify)) return beautifyObject(toBeautify);
    return toBeautify;
}

// TODO rework this function
const beautifyObject = (json) => {
    let beautifiedJson = ``;
    const jsonLength = objSize(json);

    let index = 1;
    forIn(json, (value, key) => {
        if (!isNaN(key) && Array.isArray(value)) {
            if (Array.isArray(value[0])) {
                beautifiedJson += `[ `;
                beautifiedJson += `[${[value[0]]}]`;
                for (let arrIndex = 1; arrIndex < value.length - 1; arrIndex++) {
                    beautifiedJson += ` [${[value[arrIndex]]}]`;
                }
                beautifiedJson += ` [${[value[value.length - 1]]}] ]`;

            } else {
                beautifiedJson += `[${[value[0]]}, `;
                for (let arrIndex = 1; arrIndex < value.length - 1; arrIndex++) {
                    beautifiedJson += `${[value[arrIndex]]}, `;
                }
                beautifiedJson += `${[value[value.length - 1]]}]`;
            }

        } else {
            beautifiedJson += `[${key}: ${value}]`;
            if (index < jsonLength) {
                beautifiedJson += ` ${chalk.yellow('|')} `;
                index++;
            }
        }
    });

    return beautifiedJson;
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
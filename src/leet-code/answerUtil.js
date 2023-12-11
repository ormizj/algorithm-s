import chalk from 'chalk';
import { objEqual, objSize, forIn, objEqualMessy } from '../utils/pure/objectUtil.js';
import { vTypeOf } from '../utils/pure/jsUtil.js';

const SPACE = `    `;
const DASH = `----------`;
const START = chalk.green(`START`);
const END = chalk.green(`END`);

// prints
console.log(`\n${SPACE}${DASH}${START}${DASH}\n`); //prints "----------START----------" on import
export const printEnd = () => setTimeout(() => console.log(`${SPACE}${DASH}-${END}-${DASH}\n`));

export const printResult = ({ answerCb, expected, input = {}, isOrder = false } = {}) => {
    const inputPrint = beautifyJson(input);
    const actual = runAnswer(input, answerCb);

    let answer;
    if (calculateAnswer({ expected, actual, isOrder })) {
        answer = chalk.blue(`Accepted`);
    } else {
        answer = chalk.red(`Wrong Answer`);
    }

    // TODO "[" and "]" (as arrays, not strings) are omitted from the printing;
    // need to create a function that takes arrays, and transforms the "[" and "]" into strings
    console.log(`${SPACE}${answer}
    Input:    ${inputPrint}
    Output:   ${actual}
    Expected: ${expected}
    `);
}

const runAnswer = (input = {}, answerCb) => {
    const inputValues = Object.values(input);
    return answerCb.apply(null, inputValues);
}

const beautifyJson = (json) => {
    let beautifiedJson = ``;
    const jsonLength = objSize(json);

    let index = 1;
    forIn(json, (value, key) => {
        if (Array.isArray(value)) {

            // TODO WIP [works in "867-transpose-matrix"]
            // beautifiedJson += `[ `;
            // beautifiedJson += `[${[value[0]]}]`;
            // for (let arrIndex = 1; arrIndex < value.length - 1; arrIndex++) {
            //     beautifiedJson += ` [${[value[arrIndex]]}]`;
            // }
            // beautifiedJson += ` [${[value[value.length - 1]]}] ]`;

            // TODO WIP [works in 1287-element-appearing-more-than-25%-in-sorted-array]
            beautifiedJson += `[${[value[0]]}, `;
            for (let arrIndex = 1; arrIndex < value.length - 1; arrIndex++) {
                beautifiedJson += `${[value[arrIndex]]}, `;
            }
            beautifiedJson += `${[value[value.length - 1]]}]`;

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
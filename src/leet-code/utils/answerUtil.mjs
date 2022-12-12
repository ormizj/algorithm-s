import chalk from 'chalk';
import { arrObjEqual } from './objUtil.mjs';
import { vTypeOf } from './jsUtil.mjs';
import { mapForIn, mapSize } from './mapUtil.mjs';
import { strCompareAs } from './strUtil.mjs';

const space = `    `;
const dash = `----------`;
const start = chalk.green(`START`);
const end = chalk.green(`END`);

//prints, printing start on import
console.log(`\n${space}${dash}${start}${dash}\n`);
export const printEnd = () => setTimeout(() => console.log(`${space}${dash}-${end}-${dash}\n`));

export const printResult = ({ answerCb, expected, input = {}, isOrder = false } = {}) => {
    const inputPrint = beautifyJson(input);
    const actual = runAnswer(input, answerCb);

    let answer;
    if (calculateAnswer({ expected, actual, isOrder })) {
        answer = chalk.blue(`Accepted`);
    }
    else {
        answer = chalk.red(`Wrong Answer`);
    }

    console.log(`${space}${answer}
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
    const jsonLength = mapSize(json);

    let index = 1;
    mapForIn(json, (value, key) => {
        beautifiedJson += `[${key}: ${value}]`;

        if (index < jsonLength) {
            beautifiedJson += ` ${chalk.yellow('|')} `;
            index++;
        }
    });

    return beautifiedJson;
}

//TODO add order
const calculateAnswer = ({ expected, actual, isOrder = false } = {}) => {
    const type = vTypeOf(expected);

    if (type === 'array') {
        return arrObjEqual(expected, actual);
    }

    return strCompareAs(expected, actual);
}
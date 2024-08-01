import { isFunction } from "../../../utils/pure/javascriptUtil.js";

/**
 * calls functions on the "context" param, can add arguments to the last function in the "functions" param
 * Example: callFunction(['word1','word2'], 'pop.charAt', 4);
 *
 * @param context to call functions on
 * @param functions name seperated by a ".", Example: 'func1' , 'func1.func2'
 * @param args arguments of the last function in the "functions" param
 * @returns {*} the return of the called function
 */
export const callFunction = (context, functions = '', ...args) => {
    const funcList = functions.split('.');
    const lastFunc = funcList.pop();

    for (let func of funcList) {
        context = context[func]();
    }

    return context[lastFunc].apply(context, args);
}

export const getFunctionName = function (argument = arguments) {
    let funcName = argument.callee.toString();
    funcName = funcName.substring('function '.length);
    funcName = funcName.substring(0, funcName.indexOf('('));

    return funcName;
}

export const isFunctionMsg = (func) => {
    if (isFunction(func)) {
        return true;
    } else if (func) {
        console.error(`"${func}" variable is not a function`);
    }

    return false;
}
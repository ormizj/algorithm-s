export const isNull = (any) => any === undefined || any === null;

export const cloneDeep = (any) => structuredClone(any);

export const vTypeOf = (any) => {
    if (any === null || any === undefined) return 'undefined';

    if (Array.isArray(any)) return 'array';

    if (any !== any) return 'nan';
    return typeof any;
}

/**
 * a recurring "setTimeout", that handles similarly to "setInterval",
 * unlike interval, the "handler" will only be called only when it is finished executing,
 * avoiding multiple executions at the same time.
 *
 * @param handler
 * @param timeout
 * @returns {function(): boolean} function to stop the "setTimeout" recursion
 */
export const recursiveTimeout = (handler, timeout) => {
    let active = true;

    (function recursiveTimeoutHelper() {
        setTimeout(() => {
            if (active) {
                recursiveTimeoutHelper();
                handler();
            }
        }, timeout);
    })();

    return () => active = false;
}

/**
 * @param objArr an object or an array
 * @param {string[]} path
 * @returns {*}
 */
export const getValueByPath = (objArr = {}, path = []) => {
    let temp = objArr;
    for (let route of path) {
        temp = temp[route];
    }
    return temp;
}

/**
 *
 * @param objArr an object or an array
 * @param value
 * @param {string[]} path
 */
export const setValueByPath = (objArr = {}, value, path = []) => {
    if (path.length === 0) return;

    let temp = objArr;
    for (let i = 0; i < path.length - 1; i++) {
        temp = temp[path[i]];
    }
    temp[path[path.length - 1]] = value;
}

export const isFunction = (func) => typeof func === 'function';

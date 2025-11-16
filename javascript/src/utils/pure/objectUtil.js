import { removeElement } from "../mutation/arrayUtil.js";
import { vTypeOf } from "./javascriptUtil.js";

export const isObject = (obj = {}) => obj !== null && !Array.isArray(obj) && typeof obj === 'object';

export const isEmpty = (obj = {}) => {
	for (const objKey in obj) {
		if (Object.hasOwn(obj, objKey)) return false;
	}
	return true;
};

export const hasOwn = (obj, property) => Object.hasOwn(obj, property);

const existDeep = (obj, target) => {
    for (let key in obj) {
        if (!hasOwn(obj, key)) continue;
        const value = obj[key];

        if (value === target) {
            return true;
        }

        if (typeof value === 'object') {
            const res = existDeep(value, target);
            if (res) return true;
        }
    }

    return false;
}

export const equal = (obj, otherObj) => {
    if (obj === otherObj) return true;
    return equalHelper(obj, otherObj);
}

const equalHelper = (obj, otherObj) => {
    if (vTypeOf(obj) !== vTypeOf(otherObj)) return false;

    if (typeof obj === 'object') {
        for (const objKey in obj) {
            if (!hasOwn(obj, objKey)) continue;
            const value = obj[objKey];
            const otherValue = otherObj[objKey];

            if (!equalHelper(value, otherValue)) {
                return false;
            }
        }

        return true;
    }

    if (obj !== otherObj) {
        return false;
    }
    return true;
}

export const equalMessy = (obj, otherObj) => {
    if (obj === otherObj) return true;
    const flatArr = deepFlat(obj);
    return equalMessyHelper(otherObj, flatArr);
}

const equalMessyHelper = (obj, flatArr) => {
    if (typeof obj === 'object') {
        for (const objKey in obj) {
            if (!hasOwn(obj, objKey)) continue;
            const value = obj[objKey];

            if (typeof value === 'object') {
                equalMessyHelper(value, flatArr);

            } else {
                if (!existDeep(flatArr, value)) return false;
                removeElement(flatArr, value);
            }
        }
    }

    return flatArr.length === 0;
}

export const protoAttr = (any, attrType) => {
    const properties = new Set();
    let protoCurr = Object.getPrototypeOf(any);

    while (protoCurr) {
        Object.getOwnPropertyNames(protoCurr)
            .map(attr => properties.add(attr));

        protoCurr = Object.getPrototypeOf(protoCurr);
    }

    protoList = [...properties.keys()];

    if (type === undefined) return protoList;
    return protoList.filter(attr => vTypeOf(any[attr]) === attrType);
}

export const forIn = (obj, cb) => {
    for (const key in obj) {
        if (!hasOwn(obj, key)) continue;

        cb(obj[key], key);
    }
}

export const forInBreak = (obj, cb) => {
    for (const key in obj) {
        if (!hasOwn(obj, key)) continue;

        const toBreak = cb(obj[key], key);
        if (toBreak === true) break;
    }
}

export const forInDeep = (obj, cb) => {
    for (let key in obj) {
        if (!hasOwn(obj, key)) continue;
        const value = obj[key];

        if (typeof value === 'object') {
            forInDeep(value, cb);
        } else {
            cb(value, key);
        }
    }
}

export const forInDeepBreak = (obj, cb) => {
    let toStop = false;

    (function forInDeepBreakHelper(obj) {
        for (let key in obj) {
            if (toStop === true) return;
            if (!hasOwn(obj, key)) continue;
            const value = obj[key];

            if (typeof value === 'object') {
                forInDeepBreakHelper(value);

            } else {
                const toBreak = cb(value, key);
                if (toBreak === true) toStop = true;
            }
        }
    })(obj)
}

export const size = (obj) => {
    let size = 0;
    forIn(obj, () => size++);
    return size;
}

/**
 * @param obj
 * @param value path of the object
 * @returns {*|*[]} a path to the obj value, or null if the value was not found
 */
export const valuePath = (obj = {}, value) => pathHelper(obj, value, []);

/**
 * @param obj
 * @param key path of the object
 * @returns {*|*[]} a path to the obj key, or null if key was not found
 */
export const keyPath = (obj = {}, key) => pathHelper(obj, key, [], true);

const pathHelper = (obj = {}, target, path = [], keyMode = false) => {
    for (const key in obj) {
        if (!hasOwn(obj, key)) continue;
        const value = obj[key];

        if (isArr(obj)) {
            path.push(Number(key));
        } else {
            path.push(key);
        }

        if (keyMode && key === target) return path;
        else if (value === target) return path;

        if (typeof value === 'object') {
            const res = pathHelper(value, target, path, keyMode);
            if (res !== null) return res;
        }

        path.pop();
    }

    return null;
}

const deepFlat = (obj) => deepFlatHelper(obj, []);

const deepFlatHelper = (obj, flatArr) => {
    if (typeof obj === 'object') {
        forIn(obj, (value) => {

            if (typeof value === 'object') {
                deepFlatHelper(value, flatArr);
            } else {
                flatArr.push(value);
            }
        });
    }

    return flatArr;
}

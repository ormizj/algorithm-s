import { arrRemove } from "./arrUtil.mjs";
import { vTypeOf } from "./jsUtil.mjs";
import { isString } from "./strUtil.mjs";

export const isObject = (obj = {}) => obj !== null && !Array.isArray(obj) && typeof obj === 'object';

export const objIsEmpty = (obj = {}) => {
    for (let objKey in obj) {
        if (obj.hasOwnProperty(objKey)) return false;
    }
    return true;
}

export const objCloneShallow = (obj = {}) => Object.assign({}, obj);

const objExistDeep = (obj, target) => {
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];

        if (value === target) {
            return true;
        }

        if (typeof value === 'object') {
            const res = objExistDeep(value, target);
            if (res) return true;
        }
    }

    return false;
}

export const objEqual = (obj, otherObj) => {
    if (obj === otherObj) return true;
    return objEqualHelper(obj, otherObj);
}

const objEqualHelper = (obj, otherObj) => {
    if (vTypeOf(obj) !== vTypeOf(otherObj)) return false;

    if (typeof obj === 'object') {
        for (const objKey in obj) {
            if (!Object.hasOwn(obj, objKey)) continue;
            const value = obj[objKey];
            const otherValue = otherObj[objKey];

            if (!objEqualHelper(value, otherValue)) {
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

export const objEqualMessy = (obj, otherObj) => {
    if (obj === otherObj) return true;
    const flatArr = deepFlat(obj);
    return objEqualMessyHelper(otherObj, flatArr);
}

const objEqualMessyHelper = (obj, flatArr) => {
    if (typeof obj === 'object') {
        for (const objKey in obj) {
            if (!Object.hasOwn(obj, objKey)) continue;
            const value = obj[objKey];

            if (typeof value === 'object') {
                objEqualMessyHelper(value, flatArr);

            } else {
                if (!objExistDeep(flatArr, value)) return false;
                arrRemove(flatArr, value);
            }
        }
    }

    return flatArr.length === 0;
}

export const objProtoAttr = (any, attrType) => {
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
        if (!Object.hasOwn(obj, key)) continue;

        cb(obj[key], key);
    }
}

export const forInBreak = (obj, cb) => {
    for (const key in obj) {
        if (!Object.hasOwn(obj, key)) continue;

        const isBroken = cb(obj[key], key);
        if (isBroken === true) break;
    }
}

export const objSize = (obj) => {
    let size = 0;
    forIn(obj, () => size++);
    return size;
}

/**
 * @param obj an object or an array
 * @param key in the object you want to find the path of 
 *            (returns value path, if the key is inside an {Array})
 * @returns {*|*[]} a path to the object key, or null if key was not found
 */
export const keyPath = (obj = {}, key) => {
    if (obj.hasOwnProperty(key)) return [key];
    if (Array.isArray(obj)) return pathArrHelper(obj, key, [], keyPathHelper);
    return keyPathHelper(obj, key, []);
}

const keyPathHelper = (obj = {}, target, path = []) => {
    if (path.length > 0 && isString(path[path.length - 1]))
        obj = obj[path[path.length - 1]];

    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        path.push(key);

        if (key === target) {
            return path;
        }

        if (isObject(obj[key])) {
            const res = keyPathHelper(obj, target, path);
            if (res !== null) return res;
        }

        if (Array.isArray(obj[key])) {
            const res = pathArrHelper(obj[key], target, path, keyPathHelper);
            if (res !== null) return res;
        }

        path.pop();
    }

    return null;
}

/**
 * @param obj an object or an array
 * @param value in the object you want to find the path of
 * @returns {*|*[]} a path to the object/array value, or null if the value was not found
 */
export const valuePath = (obj = {}, value) => {
    if (obj === value) return [];
    if (Array.isArray(obj)) return pathArrHelper(obj, value, [], valuePathHelper);
    return valuePathHelper(obj, value, []);
}

const valuePathHelper = (obj = {}, target, path = []) => {
    if (path.length > 0 && isString(path[path.length - 1]))
        obj = obj[path[path.length - 1]];

    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        path.push(key);

        if (value === target) {
            return path;
        }

        if (isObject(value)) {
            const res = valuePathHelper(obj, target, path);
            if (res !== null) return res;
        }

        if (Array.isArray(value)) {
            const res = pathArrHelper(value, target, path, valuePathHelper);
            if (res !== null) return res;
        }

        path.pop();
    }

    return null;
}

const pathArrHelper = (value, target, path, cb) => {
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        path.push(index);

        if (element === target) {
            return path;
        }

        if (Array.isArray(element)) {
            const tempPath = pathArrHelper(element, target, path, cb);
            if (tempPath !== null) return tempPath;
        }

        if (isObject(element)) {
            const tempPath = cb(element, target, path, cb);
            if (tempPath !== null) return tempPath;
        }

        path.pop();
    }

    return null;
}

const deepFlat = (obj) => {
    return deepFlatHelper(obj, []);
}

const deepFlatHelper = (obj, flatArr) => {
    if (typeof obj === 'object') {
        forIn(obj, (value) => {

            if (typeof value === 'object') {
                deepFlatHelper(value, flatArr);
            } else {
                flatArr.push(value);
            }
        })
    }

    return flatArr;
}
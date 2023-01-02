import { vTypeOf } from "./jsUtil.mjs";
import { isString } from "./strUtil.mjs";

export const isObject = (obj = {}) => obj !== null && !Array.isArray(obj) && typeof obj === 'object';

export const objIsEmpty = (obj = {}) => {
    for (let objKey in obj) {
        if (obj.hasOwnProperty(objKey)) return false;
    }
    return true;
}

export const objShallowClone = (obj = {}) => Object.assign({}, obj);

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
        if (Object.hasOwn(obj, key)) {
            const value = obj[key];
            cb(value, key);
        }
    }
}

export const forInBreak = (obj, cb) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const isBroken = cb(obj[key], key);
            if (isBroken === true) break;
        }
    }
}

export const objSize = (obj) => {
    let size = 0;
    forIn(obj, () => size++);
    return size;
}

/**
 * @param objArr an object or an array
 * @param key in the object you want to find the path of 
 *            (returns value path, if the key is inside an {Array})
 * @returns {*|*[]} a path to the object key, or null if key was not found
 */
export const keyPath = (objArr = {}, key) => {
    if (objArr.hasOwnProperty(key)) return [key];
    if (Array.isArray(objArr)) return pathArrHelper(objArr, key, [], keyPathHelper);
    return keyPathHelper(objArr, key, []);
}

const keyPathHelper = (obj = {}, target, path = []) => {
    let tempObj = obj;

    if (path.length > 0 && isString(path[path.length - 1]))
        tempObj = tempObj[path[path.length - 1]];

    for (let key in tempObj) {
        if (!tempObj.hasOwnProperty(key)) continue;
        path.push(key);

        if (key === target) {
            return path;
        }

        if (isObject(tempObj[key])) {
            const res = keyPathHelper(tempObj, target, path);
            if (res !== null) return res;
        }

        if (Array.isArray(tempObj[key])) {
            const res = pathArrHelper(tempObj[key], target, path, keyPathHelper);
            if (res !== null) return res;
        }

        path.pop();
    }

    return null;
}

/**
 * @param objArr an object or an array
 * @param value in the object you want to find the path of
 * @returns {*|*[]} a path to the object/array value, or null if the value was not found
 */
export const valuePath = (objArr = {}, value) => {
    if (objArr === value) return [];
    if (Array.isArray(objArr)) return pathArrHelper(objArr, value, [], valuePathHelper);
    return valuePathHelper(objArr, value, []);
}

const valuePathHelper = (obj = {}, target, path = []) => {
    let tempObj = obj;

    if (path.length > 0 && isString(path[path.length - 1]))
        tempObj = tempObj[path[path.length - 1]];

    for (let key in tempObj) {
        if (!tempObj.hasOwnProperty(key)) continue;
        const value = tempObj[key];
        path.push(key);

        if (value === target) {
            return path;
        }

        if (isObject(value)) {
            const res = valuePathHelper(tempObj, target, path);
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
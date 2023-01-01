import { isObject } from "./utils/objUtil.mjs";
import { isString } from "./utils/strUtil.mjs";

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



const obj = {
    test: [1, 2, { test2: 'abc' }, 4],
    b: { 'c': 5 },
    a: {
        b: [
            5,
            2,
            {
                nested: ['b', 'c', 'd']
            },
            3
        ]
    }
}

const arr = [{ test2: 'abc' }, obj]

console.log(keyPath(arr, 'd'))
console.log(valuePath(arr, 'd'));
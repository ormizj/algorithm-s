import { vTypeOf } from "./jsUtil.mjs";

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

export const getProtoAttr = (any, attrType) => {
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

export const objForIn = (obj, cb) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const value = obj[key];
            cb(value, key);
        }
    }
}

export const objForInBreak = (obj, cb) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const value = obj[key];

            const isBroken = cb(value, key);
            if (isBroken === true) break;
        }
    }
}

export const objSize = (obj) => {
    let size = 0;
    objForIn(obj, () => size++);
    return size;
}
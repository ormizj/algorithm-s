import { isArr } from "./utils/arrUtil.mjs";


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
        if (!obj.hasOwnProperty(key)) continue;
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




const obj = {
    test: [1, 2, { test2: 'abc' }, 4],
    b: { 'c': 5 },
    a: {
        b: [
            5,
            2,
            {
                nested: ['b', 'c', 'd', {
                    mostNested: '83'
                }]
            },
            3
        ]
    }
}

const arr = [{ test2: 'abc' }, obj]

console.log(keyPath(arr, 'mostNested'))
console.log(valuePath(arr, 'd'));

// console.log(obj)
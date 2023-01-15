import { isArr } from "./utils/pure/arrUtil.mjs";
import { quickArray } from "./utils/classes/quickArray.mjs";
import { hasOwn } from "./utils/pure/objUtil.mjs";



const forInDeep = (obj, cb) => {
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
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

const arr = [{ test3: 'yxz' }, obj]


// forInDeepBreak(arr, (value, key) => {
//     console.log('iteration')
//     if (value === 'c') {
//         console.log('STOP')
//         return true
//     };
// })

const quicker = new quickArray({ srcArr: [5, 3, 2, 8, 9] });
quicker.insert(123, 0)
console.log(quicker.getSrcArr());
console.log(quicker.getIndexMap());
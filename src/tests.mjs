import { isArr } from "./utils/arrUtil.mjs";



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

const forInDeepBreak = (obj, cb) => {
    let stop = false;

    const forInDeepBreakHelper = (obj) => {
        for (let key in obj) {
            if (stop === true) return;
            if (!obj.hasOwnProperty(key)) continue;
            const value = obj[key];

            if (typeof value === 'object') {
                forInDeepBreakHelper(value, cb);

            } else {
                const toBreak = cb(value, key);
                if (toBreak === true) stop = true;
            }
        }
    }

    forInDeepBreakHelper(obj);
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


forInDeepBreak(arr, (value, key) => {
    console.log('iteration')
    if (value === 'c') {
        console.log('STOP')
        return true
    };
})
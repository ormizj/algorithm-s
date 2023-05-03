import KeyArray, { KeyArrayProxy } from "./classes/KeyArray.js";

const obj = { 'a': 1 };
const karr = new KeyArrayProxy({ array: ['a', 'b', 'c', 'd', 'e', 'f', 'j', 'j', 'k', 'm', 'o', 'p'] });
const karr2 = new KeyArrayProxy({ array: [1, 2, 3, 4] });
// karr[5] = 'hello'
// console.log(karr.length)
// karr[15] = 5
karr.insert(9, 'testsa')
// console.log(karr.get(1));

// console.log(karr[1]);

// console.log(karr['a']);
// karr[15] = 5
// karr.replace('test11', 11)
// console.log(karr);
// console.log(karr.remove(1));
// console.log(karr[5]);
// karr[15] = 'test'
// karr[13] = 'test2'
// karr[18] = 'test3'

// karr.remove(18)
// karr.length = 10
// console.log(karr);
// console.log(karr);
// console.log(karr.toArray());
// console.log(karr.size());
// console.log(karr.getByKey(obj))
// console.log(karr.includes('test', 20));
// console.log(karr.includesByKey('test'));
// objEqual.a = 'hello'
// karr[7] = undefined;
// karr.remove(14)
// console.log(karr.toArray());
// karr[7] = 'abc';

// console.log(karr.concat('testNormal', ['test', 'array']))
// console.log(karr.concatToKeyArrayProxy());
// console.log(karr.mapToKeyArrayProxy((element, index, instance) => {
//     return element?.toUpperCase() + index
// }));


const karr3 = new KeyArrayProxy({ array: [1, 2, 3, 4, 5] });

// console.log(karr3.splice(1, 2, ['a']));
// console.log(karr3.toArray());
console.log(new KeyArray().classType === KeyArray);
console.log(karr.classType === KeyArrayProxy);

// console.log(karr.concatToKeyArray([undefined]));
console.log(karr3.concatToKeyArray([undefined]));



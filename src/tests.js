import KeyArray, { KeyArrayProxy } from "./classes/KeyArray.js";

const obj = { 'a': 1 };
const karr = new KeyArrayProxy({ array: ['a', 'b', 'c', 'd', 'e', 'f', 'j', 'j', 'k', 'm', 'o', 'p', obj] });
// karr[5] = 'hello'
// console.log(karr.length)
// karr[15] = 5
// karr.insert('testa', 9)
// console.log(karr.get(1));

// console.log(karr[1]);

// console.log(karr['a']);
// karr[15] = 5
karr.replace('test11', 11)
// console.log(karr);
// console.log(karr.remove(1));
// console.log(karr[5]);
karr[15] = 'test'
karr[13] = 'test2'
karr[18] = 'test3'

karr.remove(18)
// karr.length = 10
console.log(karr);
// console.log(karr);
// console.log(karr.toArray());
console.log(karr.size());
console.log(karr.getByKey(obj))
console.log(karr.includes('test', 20));
// objEqual.a = 'hello'
// karr[7] = undefined;
// karr.remove(14)
// console.log(karr.toArray());
// karr[7] = 'abc';


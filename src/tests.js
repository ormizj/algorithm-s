import KeyArray, { KeyArrayProxy } from "./classes/KeyArray.js";

const karr = new KeyArrayProxy({ array: ['a', 'b', 'c', 'd', 'e', 'f', 'j', 'j', 'k', 'm', 'o', 'p'] });
// karr[5] = 'hello'
// console.log(karr.length)
// karr[15] = 5
// karr.insert('testa', 9)
// console.log(karr.get(1));

// console.log(karr[1]);

// console.log(karr['a']);
// karr[15] = 5
// karr.replace('test', 11)
// console.log(karr);
// console.log(karr.remove(1));
console.log(karr[5]);
karr[5] = 'test'
console.log(karr);
// objEqual.a = 'hello'
// karr[7] = undefined;
// karr.remove(14)
// console.log(karr.toArray());
// karr[7] = 'abc';


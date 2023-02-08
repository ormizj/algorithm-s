import KeyArray from "./classes/KeyArray.js";


const karr = new KeyArray({ array: ['a', 'b', 'c', 'd', 'e', 'f', 'j', 'g', 'h', 'i', 'j', 'k'] });

console.table(karr.toArray())

// karr.insertByKey([1, 2, 3, 4, 5, 6, 7], 'k')

// karr.replaceByKey(['new1', 'new2', 'new3'], 'g');
console.log(karr.keyExists('j'));
karr.removeByKeyAll('j', 4)

console.log(karr.elementMap)
console.log(karr.indexMap)

console.log();

console.log(karr.length);

console.table(karr.toArray())



import { describe, expect, it, beforeEach, test } from '@jest/globals';
import { KeyArrayProxy } from '../classes/KeyArray';

describe("KeyArray", () => {
    const aCode = `${'a'.charCodeAt()}`;
    const fCode = `${'f'.charCodeAt()}`;
    const zCode = `${'z'.charCodeAt()}`;
    let karr;

    beforeEach(() => {
        const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'f', 'z'];
        const elementToKey = (letter) => `${letter.charCodeAt()}`;

        karr = new KeyArrayProxy({ array, elementToKey });
    });

    test('insert', () => {
        karr.insert(karr.length >>> 1, 'mid', 'dle');
        karr.insert(0, 'first');
        karr.insert(karr.length, 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'a', 'b', 'c', 'd', 'e', 'mid', 'dle', 'f', 'g', 'h', 'i', 'f', 'z', 'last']);
    });

    test('insertByKey', () => {
        karr.insertByKey(fCode, 0, 'mid', 'dle');
        karr.insertByKey(aCode, 0, 'first');
        karr.insertByKey(zCode, 0, 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'a', 'b', 'c', 'd', 'e', 'mid', 'dle', 'f', 'g', 'h', 'i', 'f', 'last', 'z']);
    });

    test('insertByKeyAll', () => {
        karr.insertByKeyAll(fCode, 'mid', 'dle');
        karr.insertByKeyAll(aCode, 'first');
        karr.insertByKeyAll(zCode, 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'a', 'b', 'c', 'd', 'e', 'mid', 'dle', 'f', 'g', 'h', 'i', 'mid', 'dle', 'f', 'last', 'z']);
    });

    test('replace', () => {
        karr.replace(karr.length >>> 1, 'mid', 'dle');
        karr.replace(0, 'first');
        karr.replace(karr.length - 1, 'after', 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'b', 'c', 'd', 'e', 'mid', 'dle', 'h', 'i', 'f', 'after', 'last']);
    });

    test('replaceByKey', () => {
        karr.replaceByKey(fCode, 0, 'mid', 'dle');
        karr.replaceByKey(aCode, 0, 'first');
        karr.replaceByKey(zCode, 0, 'after', 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'b', 'c', 'd', 'e', 'mid', 'dle', 'h', 'i', 'f', 'after', 'last']);
    });

    test('insertByKeyAll', () => {
        karr.replaceByKeyAll(fCode, 'mid');
        karr.replaceByKeyAll(aCode, 'first');
        karr.replaceByKeyAll(zCode, 'after', 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'b', 'c', 'd', 'e', 'mid', 'g', 'h', 'i', 'mid', 'after', 'last']);
    });

    test('remove', () => {
        karr.remove(karr.length >>> 1, 2);
        karr.remove(0);
        karr.remove(karr.length - 1, 2);

        expect(karr.toArray()).toStrictEqual(['b', 'c', 'd', 'e', 'h', 'i', 'f']);
    });


    test('removeByKey', () => {
        karr.removeByKey(fCode, 0, 2);
        karr.removeByKey(aCode, 0);
        karr.removeByKey(zCode, 0, 2);

        expect(karr.toArray()).toStrictEqual(['b', 'c', 'd', 'e', 'h', 'i', 'f']);
    });

    test('removeByKeyAll', () => {
        karr.removeByKeyAll(fCode, 2);
        karr.removeByKeyAll(aCode);
        karr.removeByKeyAll(zCode, 2);

        expect(karr.toArray()).toStrictEqual(['b', 'c', 'd', 'e', 'h', 'i']);
    });
});
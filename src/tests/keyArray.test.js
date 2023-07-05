import { describe, expect, it, beforeEach, test } from '@jest/globals';
import { KeyArrayProxy } from '../classes/KeyArray';

describe("KeyArray", () => {
    let karr;

    beforeEach(() => {
        const array = ['a', 'b', 'c', 'd', 'e', 'f', 'a', 'g', 'h', 'i', 'g'];
        const elementToKey = (letter) => `${letter.charCodeAt()}`;

        karr = new KeyArrayProxy({ array, elementToKey });
    });

    test('insert', () => {
        karr.insert(0, 'first');
        karr.insert(karr.length >>> 1, 'mid', 'dle');
        karr.insert(karr.length, 'last');

        expect(karr.toArray()).toStrictEqual(['first', 'a', 'b', 'c', 'd', 'e', 'mid', 'dle', 'f', 'a', 'g', 'h', 'i', 'g', 'last']);
    });
});
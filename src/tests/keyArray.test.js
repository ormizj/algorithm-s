import { describe, expect, it, beforeEach } from '@jest/globals';
import { KeyArrayProxy } from '../classes/KeyArray';

describe("insert", () => {
    let karr;

    beforeEach(() => {
        const array = ['a', 'b', 'c', 'd', 'e', 'f', 'a', 'g', 'h', 'i', 'g'];
        const elementToKey = (letter) => `${letter.charCodeAt()}`;

        karr = new KeyArrayProxy({ array, elementToKey });
    });
});
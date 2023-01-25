import { describe, expect, it, beforeEach } from '@jest/globals';
import KeyArray from '../utils/classes/KeyArray';

describe("insert", () => {
    let keyArray;

    beforeEach(() => {
        keyArray = new KeyArray();
    });

    it("inserts multiple elements at the end of the array", () => {
        keyArray.insert(["first element", "second element", "third element", "fourth element", "fifth element"]);

        expect(keyArray.toArray()).toEqual(["first element", "second element", "third element", "fourth element", "fifth element"]);
    });

    it("inserts an element at a specific index", () => {
        keyArray.insert(["first element", "second element", "third element", "fourth element", "fifth element"]);
        keyArray.insert("second and a half element", 2);

        expect(keyArray.toArray()).toEqual(["first element", "second element", "second and a half element", "third element", "fourth element", "fifth element"]);
    });

    it("overwrites elements when inserting at an occupied index", () => {
        keyArray.insert(["first element", "second element", "third element", "fourth element", "fifth element"]);
        keyArray.insert("second and a half element", 2);
        keyArray.insert("another element", 3);

        expect(keyArray.toArray()).toEqual(["first element", "second element", "second and a half element", "another element", "third element", "fourth element", "fifth element"]);
    });

    it("inserts elements with the correct keys", () => {
        keyArray = new KeyArray({
            elementToKey: element => element.id
        });
        keyArray.insert([{ id: 1, value: "first element" }, { id: 2, value: "second element" }, { id: 3, value: "third element" }, { id: 4, value: "fourth element" }, { id: 5, value: "fifth element" }]);

        expect(keyArray.getByKey(1)).toEqual({ id: 1, value: "first element" });
        expect(keyArray.getByKey(2)).toEqual({ id: 2, value: "second element" });
        expect(keyArray.getByKey(3)).toEqual({ id: 3, value: "third element" });
        expect(keyArray.getByKey(4)).toEqual({ id: 4, value: "fourth element" });
        expect(keyArray.getByKey(5)).toEqual({ id: 5, value: "fifth element" });
    });
});
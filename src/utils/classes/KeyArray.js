import { arrInsert, arrRemove } from "../mutation/arrUtil.js";
import { arrValidate, arrIsEmpty, isArr, arrIndexToInsertNum } from "../pure/arrUtil.js";
import { isNull } from "../pure/jsUtil.js";
import { hasOwn } from "../pure/objUtil.js";

//TODO add unique version (keySet class)
export default class keyArray {
    constructor({
        arr = [],
        elementToKey = (element) => `${element}`
    } = {}) {
        this.elementToKey = elementToKey;// function to generate a key for the "indexMap"

        this.elementMap = {};// map containing the elements [key: index,    value:element]
        this.indexMap = {};// map containing the indexes    [key: string,   value:index]

        this.length = 0;// length of the keyArray

        this.insert(arr);// convert array to "elementMap" + "indexMap"
    }

    /* PUBLIC FUNCTIONS */

    //TODO insert by key

    insert(elements = [], index = 0) {
        index = this.#validateIndex(index);
        elements = arrValidate(elements);

        const overwrittenElements = [];
        let currentLength = this.length;
        let indexesToMove = 0;

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (hasOwn(this.elementMap, index)) {
                overwrittenElements.push(this.elementMap[index]);
                this.#deleteFromMaps(index);
                indexesToMove++;

                // new value in "elementMap"
            } else {
                currentLength++;
            }

            this.#insertToMaps(element, index);
            index++;
        }

        // re-orgnize "indexMap" (if elements were overwritten)
        if (!arrIsEmpty(overwrittenElements)) {
            let lastFilledIndex = index;
            const targetIndex = lastFilledIndex - 1;

            index = currentLength;
            while (targetIndex < --index) {
                const newIndex = index + indexesToMove;

                // deleting from maps before inserting, for performance
                const element = this.elementMap[index];
                this.#deleteFromMaps(index);
                this.#insertToMaps(element, newIndex);
            }

            for (const overwrittenElement of overwrittenElements) {
                this.#insertToMaps(overwrittenElement, lastFilledIndex, true);
                lastFilledIndex++;
            }
        }

        this.length += elements.length;
    }

    //TODO replace by key

    //TODO create the function
    replace(elements = [], index) {

    }

    //TODO remove by key

    //TODO create the function
    remove(index = 0) {
        const mapKey = this.elementToKey(this.srcArr[index]);
        delete this.indexMap[mapKey];

        arrRemove(this.srcArrarr, index);
    }

    //TODO sort

    toArray() {
        const arr = [];
        let index = -1;
        while (++index < this.length) {
            const element = this.elementMap[index];
            arr.push(element);
        }
        return arr;
    }

    forEach(callback = (element, index = 0) => { }) {
        let index = -1;
        while (++index < this.length) {
            callback(this.elementMap[index], index);
        }
    }

    forEachBreak(callback = (element, index) => true) {
        let index = -1;
        while (++index < this.length) {
            const toBreak = callback(this.elementMap[index], index);
            if (toBreak === true) break;
        }
    }

    /* KEY FUNCTIONS */

    /**
    * @param {''} key is determined by {indexPath} 
    * @param {Number} position of the element (0 for first, -1 for last...)
    * @returns 
    */
    getByKey(key = '', position = 0) {
        const index = this.indexMap[key][position];
        return this.elementMap[index];
    }
    /** returns {true} if the key exists*/
    keyExists = (key = '') => hasOwn(this.indexMap[key]);
    /** returns the key array*/
    getKeyArray = (key = '') => this.indexMap[key];
    /** returns the size of the key array*/
    getKeySize = (key = '') => this.indexMap[key].length;
    /** returns the index of the key array*/
    getKeyIndex = (key = '', index = 0) => this.indexMap[key][index];
    /** returns the first index of the key array*/
    getKeyFirstIndex = (key = '') => this.indexMap[key][0];
    /** returns the last index of the key array */
    getKeyLastIndex = (key = '') => this.indexMap[key][this.getKeySize(key) - 1];

    /* INDEX FUNCTIONS */

    /**
     * @param {Number} position positive or negative integers
     * @returns 
     * @see Array.at
     */
    at = (position = 0) => position >= 0 ? this.elementMap[position] : this.elementMap[this.length + position];
    get = (index = 0) => this.elementMap[index];
    getFirst = () => this.elementMap[0];
    getLast = () => this.elementMap[this.length - 1];
    size = () => this.length;
    exists = (index = 0) => hasOwn(this.elementMap, index);

    /* PRIVATE FUNCTIONS */

    #validateIndex(index = 0, canBeEmptyIndex = true) {
        const maxIndex = canBeEmptyIndex ? this.length : this.length - 1;

        if (isNull(index) || index >= maxIndex) return maxIndex;
        if (index < 0) return index;
        return index;
    }

    #insertToMaps(element, index = 0) {
        this.elementMap[index] = element;

        const key = this.elementToKey(element);
        if (isArr(this.indexMap[key])) {
            arrInsert(this.indexMap[key], this.#getIndexMapSortedIndex(key, index), index);

        } else {
            this.indexMap[key] = [index];
        }
    }

    #deleteFromMaps(index = 0) {
        const element = this.elementMap[index];
        delete this.elementMap[index];

        const key = this.elementToKey(element);
        if (this.indexMap[key].length > 1) {
            arrRemove(this.indexMap[key], this.#getIndexMapSortedIndex(key, index))

        } else {
            delete this.indexMap[key];
        }
    }

    #getIndexMapSortedIndex = (key = '', index = 0) => arrIndexToInsertNum(this.indexMap[key], index);
}


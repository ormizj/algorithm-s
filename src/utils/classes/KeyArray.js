import { arrInsert, arrRemove } from "../mutation/arrUtil.js";
import { arrValidate, arrIsEmpty, isArr, arrIndexToInsertNum } from "../pure/arrUtil.js";
import { hasOwn } from "../pure/objUtil.js";

export default class keyArray {

    /**
     * @param {[]} arr
     * @param {(element) => `${element}`} elementToKey
     */
    constructor({
        arr,
        elementToKey = (element) => `${element}`
    }) {
        this.elementToKey = elementToKey;// function to generate a key for the "indexMap"

        this.elementMap = {};// map containing the elements [key: index,    value:element]
        this.indexMap = {};// map containing the indexes    [key: string,   value:index]

        this.length = 0;// length of the keyArray

        this.insert(arr);// convert array to "elementMap" + "indexMap"
    }

    /* PUBLIC FUNCTIONS */

    insertByKey = (elements, key, position) => this.insert(elements, this.getKeyIndex(key, position));

    insert(elements, index) {
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

    replaceByKey = (elements, key, position) => this.replace(elements, this.getKeyIndex(key, position));

    replace(elements, index) {
        index = this.#validateIndex(index);
        elements = arrValidate(elements);

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (hasOwn(this.elementMap, index)) {
                this.#deleteFromMaps(index);

                // new value in "elementMap"
            } else {
                this.length++;
            }

            this.#insertToMaps(element, index);
            index++;
        }
    }

    //TODO remove by key

    //TODO create the function
    remove(index) {
        const mapKey = this.elementToKey(this.srcArr[index]);
        delete this.indexMap[mapKey];

        arrRemove(this.srcArrarr, index);
    }

    //TODO sort (mergeSort)

    //TODO (after "sort") option to send custom sort function, to sort the array

    toArray() {
        const arr = [];
        let index = -1;
        while (++index < this.length) {
            const element = this.elementMap[index];
            arr.push(element);
        }
        return arr;
    }

    /**
     * 
     * @param {(element, index)} callback 
     */
    forEach(callback) {
        let index = -1;
        while (++index < this.length) {
            callback(this.elementMap[index], index);
        }
    }

    /**
     * @param {(element, index) => true} callback
     */
    forEachBreak(callback) {
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
    getByKey(key, position = 0) {
        const index = this.indexMap[key][position];
        console.log(index);
        return this.elementMap[index];
    }
    /** returns {true} if the key exists*/
    keyExists = (key) => hasOwn(this.indexMap[key]);
    /** returns the key array*/
    getKeyArray = (key) => this.indexMap[key];
    /** returns the size of the key array*/
    getKeySize = (key) => this.indexMap[key].length;
    /** returns the index of the key array, position optional*/
    getKeyIndex = (key, position = 0) => this.indexMap[key][position];
    /** returns the first index of the key array*/
    getKeyFirstIndex = (key) => this.indexMap[key][0];
    /** returns the last index of the key array */
    getKeyLastIndex = (key) => this.indexMap[key][this.getKeySize(key) - 1];

    /* INDEX FUNCTIONS */

    /**
     * @param {Number} position positive or negative integers
     * @returns 
     * @see Array.at
     */
    at = (position) => position >= 0 ? this.elementMap[position] : this.elementMap[this.length + position];
    get = (index) => this.elementMap[index];
    getFirst = () => this.elementMap[0];
    getLast = () => this.elementMap[this.length - 1];
    size = () => this.length;
    exists = (index) => hasOwn(this.elementMap, index);

    /* PRIVATE FUNCTIONS */

    #validateIndex(index, canBeEmptyIndex = true) {
        const maxIndex = canBeEmptyIndex ? this.length : this.length - 1;
        if (index === undefined || index > maxIndex) return maxIndex;
        return index;
    }

    #insertToMaps(element, index) {
        this.elementMap[index] = element;

        const key = this.elementToKey(element);
        if (isArr(this.indexMap[key])) {
            arrInsert(this.indexMap[key], this.#getIndexMapSortedIndex(key, index), index);

        } else {
            this.indexMap[key] = [index];
        }
    }

    #deleteFromMaps(index) {
        const element = this.elementMap[index];
        delete this.elementMap[index];

        const key = this.elementToKey(element);
        if (this.indexMap[key].length > 1) {
            arrRemove(this.indexMap[key], this.#getIndexMapSortedIndex(key, index))

        } else {
            delete this.indexMap[key];
        }
    }

    #getIndexMapSortedIndex = (key, index) => arrIndexToInsertNum(this.indexMap[key], index);
}


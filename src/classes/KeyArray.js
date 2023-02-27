import { arrInsert, arrRemove } from "../utils/mutation/arrUtil.js";
import { arrValidate, arrIsEmpty, arrIndexToInsertNum } from "../utils/pure/arrUtil.js";
import { validateNum } from "../utils/pure/numUtil.js";
import { hasOwn } from "../utils/pure/objUtil.js";
export default class KeyArray {
    /**
     * @param {[]} array
     * @param {(element) => `${element}`} elementToKey
     */
    constructor({
        array = [],
        elementToKey = (element) => `${element}`
    } = {}) {
        this.$ = this; // "this" variable for "KeyArrayProxy" (Proxy can't access private methods)

        this.elementToKey = elementToKey; // function to generate a key for the "indexMap"
        this.elementMap = {}; // map containing the elements [key: index,    value:element]
        this.indexMap = {}; //   map containing the indexes  [key: string,   value:index]

        this.length = 0; // length of the keyArray

        this.insert(array); // convert array to "elementMap" + "indexMap"
    }

    //TODO add push

    //TODO add shift

    //TODO add splice

    //TODO add split

    //TODO add unshift

    //TODO add pop

    //TODO add indexing to the object

    /* PUBLIC METHODS */

    //TODO handle inserting to indexes outside of length
    insert(elements, index) {
        index = this.$.#validateIndex(index, this.length);
        elements = arrValidate(elements);

        const overwrittenElements = [];
        let currentLength = this.length;
        let indexesToMove = 0;

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (hasOwn(this.elementMap, index)) {
                overwrittenElements.push(this.elementMap[index]);
                this.$.#deleteFromMaps(index);
                indexesToMove++;

                // new value in "elementMap"
            } else {
                currentLength++;
            }

            this.$.#insertToMaps(element, index);
            index++;
        }

        // re-orgnize "indexMap" (if elements were overwritten)
        if (!arrIsEmpty(overwrittenElements)) {
            let lastFilledIndex = index - 1;

            index = currentLength;
            while (lastFilledIndex < --index) {
                this.$.#moveInMaps(index, index + indexesToMove);
            }

            lastFilledIndex++;
            for (const overwrittenElement of overwrittenElements) {
                this.$.#insertToMaps(overwrittenElement, lastFilledIndex, true);
                lastFilledIndex++;
            }
        }

        this.length += elements.length;
    }

    insertByKey = (elements, key, position) => this.insert(elements, this.getKeyIndex(key, position));

    insertByKeyAll(elements, key) {
        const insertIndexes = this.getKeyArray(key);
        elements = arrValidate(elements);

        for (let index = insertIndexes.length - 1; index >= 0; index--) {
            this.insert(elements, insertIndexes[index]);
        }
    }

    replace(elements, index) {
        index = this.$.#validateIndexBound(index, this.length - 1);
        elements = arrValidate(elements);

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (hasOwn(this.elementMap, index)) {
                this.$.#deleteFromMaps(index);

                // new value in "elementMap"
            } else {
                this.length++;
            }

            this.$.#insertToMaps(element, index);
            index++;
        }
    }

    replaceByKey = (elements, key, position) => this.replace(elements, this.getKeyIndex(key, position));

    /**
     * replaces all elements in the {key} index, does not overwrites added elements,
     * inserts elements instead of replacing if needed to avoid overwriting added elements
     * 
     * @param {[]} elements 
     * @param {''} key
     */
    replaceByKeyAll = (elements, key) => {
        const replaceIndexes = this.getKeyArray(key);
        const amount = elements.length;

        for (let index = replaceIndexes.length - 1; index >= 0; index--) {
            let replaceIndex = replaceIndexes[index];
            let tempAmount = amount;

            for (tempAmount = 0; tempAmount < amount; tempAmount++) {
                if (elements[0] === this.elementMap[replaceIndex + tempAmount]) {
                    break;
                }
            }

            const startElements = elements.slice(0, tempAmount);
            this.replace(startElements, replaceIndex);

            const endElements = elements.slice(tempAmount);
            this.insert(endElements, replaceIndex + tempAmount);
        }
    }

    remove(index, amount = 1) {
        index = this.$.#validateIndexBound(index, this.length - 1);

        let indexesToMove = 0;
        let amountDeleted = amount;

        while (hasOwn(this.elementMap, index) && amount > 0) {
            this.$.#deleteFromMaps(index);
            indexesToMove++;
            index++;
            amount--;
        }

        index--;
        while (++index < this.length) {
            this.$.#moveInMaps(index, index - indexesToMove);
        }

        this.length += amount - amountDeleted;
    }

    removeByKey = (key, position, amount) => this.remove(this.getKeyIndex(key, position), amount);

    /**
     * removes all elements in the {key} index, 
     * ensures that removed elements will not exceed {amount} from the {key} index
     * E.G. ['a', 'a', 'b', 'c'], calling "removeByKeyAll('a',2)" will not delete 'c' (even though, total amount to remove is 4)
     * 
     * @param {''} key 
     * @param {Number} amount 
     */
    removeByKeyAll = (key, amount) => {
        while (this.keyExists(key)) {
            let firstKeyIndex = this.getKeyFirstIndex(key);
            let tempAmount = amount;

            for (tempAmount = 1; tempAmount < amount; tempAmount++) {
                if (this.elementMap[firstKeyIndex] === this.elementMap[firstKeyIndex + tempAmount]) {
                    break;
                }
            }

            this.remove(firstKeyIndex, tempAmount);
        }
    }

    //TODO sort (mergeSort)

    //TODO (after "sort") option to send custom sort function, to sort the array

    //TODO insertSorted (returns index where the element was placed in)?

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

    /* KEY METHODS */

    /**
    * @param {''} key is determined by {indexPath} 
    * @param {Number} position of the element (0 for first, -1 for last...)
    * @returns 
    */
    getByKey(key, position = 0) {
        const index = this.indexMap[key][position];
        return this.elementMap[index];
    }
    /** returns {true} if the key exists*/
    keyExists = (key) => hasOwn(this.indexMap, key);
    /** returns {true} if exactly 1 key of the type exists */
    keyUnique = (key) => this.getKeySize(key) === 1;
    /** returns the key of the index */
    getKey = (index) => this.elementToKey(this.elementMap[index]);
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

    /* INDEX METHODS */

    /**
     * @param {Number} index positive or negative integers
     * @returns 
     * @see Array.at
     */
    at = (index) => index >= 0 ? this.elementMap[index] : this.elementMap[this.length + index];
    get = (index) => this.elementMap[index];
    getFirst = () => this.elementMap[0];
    getLast = () => this.elementMap[this.length - 1];
    size = () => this.length;
    exists = (index) => hasOwn(this.elementMap, index);

    /* PRIVATE METHODS */

    /**
     * @param {Number} index 
     * @param {Number} lastIndex the last index valid of the array
     * @returns
     * @see Array.at
     */
    #validateIndex(index, lastIndex) {
        if (index === undefined) {
            return lastIndex;

        } else {
            index = validateNum(index);
            if (index < 0) index = index + lastIndex + 1;
        }

        return index;
    }

    /**
     * throws an exception if the {index} is bigger or equal {lastIndex}
     * 
    * @param {Number} index 
    * @param {Number} lastIndex the last index valid of the array 
    * @returns
    */
    #validateIndexBound(index, lastIndex) {
        index = this.$.#validateIndex(index, lastIndex);

        if (index >= this.length) throw RangeError(`Index ${index} out of bounds for length ${lastIndex}`);

        return index;
    }

    #insertToMaps(element, index) {
        this.elementMap[index] = element;

        const key = this.elementToKey(element);
        if (hasOwn(this.indexMap, key)) {
            arrInsert(this.indexMap[key], this.$.#getIndexMapSortedIndex(key, index), index);

        } else {
            this.indexMap[key] = [index];
        }
    }

    #moveInMaps(index, newIndex) {
        // deleting from maps before inserting, for performance
        const element = this.elementMap[index];
        this.$.#deleteFromMaps(index);
        this.$.#insertToMaps(element, newIndex);
    }

    #deleteFromMaps(index) {
        const element = this.elementMap[index];
        delete this.elementMap[index];

        const key = this.elementToKey(element);
        if (this.indexMap[key].length > 1) {
            arrRemove(this.indexMap[key], this.$.#getIndexMapSortedIndex(key, index))

        } else {
            delete this.indexMap[key];
        }
    }

    #getIndexMapSortedIndex = (key, index) => arrIndexToInsertNum(this.indexMap[key], index);

    /* SYMBOL METHODS */

    [Symbol.iterator]() {
        let index = 0;

        return {
            next: () => ({
                value: this.elementMap[index],
                done: ++index > this.length
            })
        };
    };
}

export function KeyArrayProxy(
    array = [],
    elementToKey = (element) => `${element}`
) {
    // if the "new" keyword isn't used when calling the function, throw TypeError
    if (!(this instanceof KeyArrayProxy)) throw TypeError(`Constructor KeyArrayProxy requires 'new'`);

    const instance = new KeyArray(array, elementToKey);

    return new Proxy(instance, {
        get(obj, key, receiver) {
            if (key in obj) return obj[key];

            return obj.get(key);
        },

        set(obj, key, value, receiver) {
            if (isNaN(key)) return obj[key] = value;

            if (obj.exists(key)) obj.replace(value, key);
            else obj.insert(value, key);

            return true;
        },
    });
}

import { arrInsert, arrRemove } from "../utils/mutation/arrUtil.js";
import { arrValidate, arrIsEmpty, arrIndexToInsertNum } from "../utils/pure/arrUtil.js";
import { validateNum } from "../utils/pure/numUtil.js";
export default class KeyArray {
    /**
     * @param {[]} array to initialize elements
     * @param {(element) => any} elementToKey  to set the keys for the elements
     */
    constructor({
        array = [],
        elementToKey = (element) => typeof element === 'object' ? element : `${element}`
    } = {}) {
        this.$ = this; // "this" variable for "KeyArrayProxy" (Proxy can't access private methods)
        this.$.#defineLength(); // length of the keyArray

        this.elementToKey = elementToKey; // function to generate a key for the "indexMap"
        this.elementMap = new Map(); // map containing the elements [key: index,    value:element]
        this.indexMap = new Map(); //   map containing the indexes  [key: string,   value:index]

        this.insert(array); // convert array to "elementMap" + "indexMap"
    }

    /* PUBLIC METHODS */

    insert(elements, index) {
        index = this.$.#validateIndex(index, this.elementMap.size);
        elements = arrValidate(elements);

        const overwrittenElements = [];
        const startingLength = this.elementMap.size;
        let currentLength = this.elementMap.size;
        let indexesToMove = 0;

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (this.elementMap.has(index)) {
                overwrittenElements.push(this.elementMap.get(index));
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
                this.$.#insertToMaps(overwrittenElement, lastFilledIndex);
                lastFilledIndex++;
            }

            // handle inserting element outside of the range
        } else if (index - elements.length > startingLength) {
            index--;
            const emptyIndexes = index - startingLength;

            while (startingLength < index--) {
                this.$.#insertToMaps(undefined, index);
            }
        }
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
        index = this.$.#validateIndexBound(index, this.elementMap.size - 1);
        elements = arrValidate(elements);

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (this.elementMap.has(index)) {
                this.$.#deleteFromMaps(index);
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
                if (elements[0] === this.elementMap.get(replaceIndex + tempAmount)) {
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
        index = this.$.#validateIndexBound(index, this.elementMap.size - 1);

        let indexesToMove = 0;

        while (this.elementMap.has(index) && amount > 0) {
            this.$.#deleteFromMaps(index);
            indexesToMove++;
            index++;
            amount--;
        }

        index--;
        while (++index < this.elementMap.size) {
            this.$.#moveInMaps(index, index - indexesToMove);
        }
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
                if (this.elementMap.get(firstKeyIndex) === this.elementMap.get(firstKeyIndex + tempAmount)) {
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
        while (++index < this.elementMap.size) {
            const element = this.elementMap.get(index);
            arr.push(element);
        }
        return arr;
    }

    /**
     * @param {(element, index)} callback 
     */
    forEach(callback) {
        let index = -1;
        while (++index < this.elementMap.size) {
            callback(this.elementMap.get(index), index);
        }
    }

    /**
     * @param {(element, index) => true} callback
     */
    forEachBreak(callback) {
        let index = -1;
        while (++index < this.elementMap.size) {
            const toBreak = callback(this.elementMap.get(index), index);
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
        const index = this.indexMap.get(key)[position];
        return this.elementMap.get(index);
    }
    /** returns {true} if the key exists*/
    keyExists = (key) => this.indexMap.has(key);
    /** returns {true} if exactly 1 key of the type exists */
    keyUnique = (key) => this.getKeySize(key) === 1;
    /** returns the key of the index */
    getKey = (index) => this.elementToKey(this.elementMap.get(index));
    /** returns the key array*/
    getKeyArray = (key) => this.indexMap.get(key);
    /** returns the size of the key array*/
    getKeySize = (key) => this.indexMap.get(key).length;
    /** returns the index of the key array, position optional*/
    getKeyIndex = (key, position = 0) => this.indexMap.get(key)[position];
    /** returns the first index of the key array*/
    getKeyFirstIndex = (key) => this.indexMap.get(key)[0];
    /** returns the last index of the key array */
    getKeyLastIndex = (key) => this.indexMap.get(key)[this.getKeySize(key) - 1];

    /* INDEX METHODS */

    /**
     * @param {Number} index positive or negative integers
     * @returns 
     * @see Array.at
     */
    at = (index) => index >= 0 ? this.elementMap.get(index) : this.elementMap.get(this.elementMap.size + index);
    get = (index) => this.elementMap.get(index);
    getFirst = () => this.elementMap.get(0);
    getLast = () => this.elementMap.get(this.elementMap.size - 1);
    size = () => this.elementMap.size;
    exists = (index) => this.elementMap.has(index);

    /* ARRAY METHODS */

    //TODO add splice

    //TODO add split

    includes(searchElement, fromIndex) {
        fromIndex = this.$.#validateIndex(fromIndex, 0);

        console.log(fromIndex);
        while (fromIndex < this.elementMap.size) {
            if (this.elementMap.get(fromIndex) === searchElement) return true;
            fromIndex++;
        }

        return false;
    }

    push = (elements) => this.insert(elements, this.elementMap.size - 1);

    pop() {
        const poppedElement = this.getLast();
        this.remove(this.elementMap.size - 1);
        return poppedElement;
    }

    unshift = (elements) => this.insert(elements, 0);

    shift() {
        const shiftedElement = this.getFirst();
        this.remove(0);
        return shiftedElement;
    }

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

        if (index >= this.elementMap.size) throw RangeError(`Index ${index} out of bounds for length ${lastIndex}`);

        return index;
    }

    #insertToMaps(element, index) {
        this.elementMap.set(index, element);

        const key = this.elementToKey(element);
        if (this.indexMap.has(key)) {
            arrInsert(this.indexMap.get(key), this.$.#getIndexMapSortedIndex(key, index), index);

        } else {
            this.indexMap.set(key, [index]);
        }
    }

    #moveInMaps(index, newIndex) {
        // deleting from maps before inserting, for performance
        const element = this.elementMap.get(index);
        this.$.#deleteFromMaps(index);
        this.$.#insertToMaps(element, newIndex);
    }

    #deleteFromMaps(index) {
        const element = this.elementMap.get(index);
        this.elementMap.delete(index);

        const key = this.elementToKey(element);
        if (this.indexMap.get(key).length > 1) {
            arrRemove(this.indexMap.get(key), this.$.#getIndexMapSortedIndex(key, index))

        } else {
            delete this.indexMap.delete(key);
        }
    }

    #getIndexMapSortedIndex = (key, index) => arrIndexToInsertNum(this.indexMap.get(key), index);

    /* SYMBOL AND DEFINE METHODS */

    #defineLength() {
        Object.defineProperty(this, 'length', {
            get() {
                return this.elementMap.size;
            },
            set(newLength) {
                if (newLength > this.elementMap.size) {
                    this.insert(undefined, newLength - 1);

                } else if (newLength < this.elementMap.size) {
                    this.remove(newLength, this.elementMap.size);
                }
            }
        });
    }

    [Symbol.iterator]() {
        let index = 0;

        return {
            next: () => ({
                value: this.elementMap.get(index),
                done: ++index > this.elementMap.size
            })
        };
    };
}

export function KeyArrayProxy(
    array = [],
    elementToKey = (element) => `${element} `
) {
    // if the "new" keyword isn't used when calling the function, throw TypeError
    if (!(this instanceof KeyArrayProxy)) throw TypeError(`Constructor KeyArrayProxy requires 'new'`);

    const instance = new KeyArray(array, elementToKey);

    return new Proxy(instance, {
        get(obj, key, receiver) {
            if (isNaN(key)) return obj[key];

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

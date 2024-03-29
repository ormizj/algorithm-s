export default class KeyArray {
    /**
     * @param {[]} array to initialize elements
     * @param {(element) => any} elementToKey to set the keys for the inserted elements
     * @param {(a, b) => number} comparator of the elements; the default comparator to every function that uses a "compare" function
     */
    constructor({// when updating the argument for the constructor, update the KeyArrayProxy class, "#newKeyArray" & "#newKeyArrayProxy" methods
        array = [],
        elementToKey = (element) => typeof element === 'object' ? element : `${element}`,
        comparator = (a, b) => `${a}`.localeCompare(b),
    } = {}) {
        this.$ = this; // "this" variable for "KeyArrayProxy" (Proxy can't access private methods)
        this.$.#defineLength(); // length of the keyArray

        this.$classConstructor = KeyArray; // type of the class, for class overrides E.G. Proxy

        this.comparator = comparator; // element comparator, the default comparator to every function that uses "compare"
        this.elementToKey = elementToKey; // function to generate a key for the "indexMap"

        // initializing maps, to act as an array
        this.elementMap = new Map(); // map containing the elements [key: index,    value:element]
        this.indexMap = new Map(); //   map containing the indexes  [key: string,   value:index]

        this.$.#insert(array); // convert array to "elementMap" + "indexMap"
    }

    /* PUBLIC METHODS */

    insert = (index, ...elements) => this.$.#insert(elements, index);
    #insert(elements, index) {
        index = this.$.#validateIndex(index, this.elementMap.size);

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

    insertByKey = (key, position, ...elements) => this.$.#insertByKey(elements, key, position);
    #insertByKey = (elements, key, position) => this.$.#insert(elements, this.getKeyIndex(key, position));

    insertByKeyAll = (key, ...elements) => this.$.#insertByKeyAll(elements, key);
    #insertByKeyAll(elements, key) {
        const insertIndexes = this.getKeyArray(key);

        for (let index = insertIndexes.length - 1; index >= 0; index--) {
            this.$.#insert(elements, insertIndexes[index]);
        }
    }

    insertSorted(element, compare) {
        const index = this.sortedInsertIndex(element, compare);
        this.$.#insert([element], index);
    }

    /**
     * @param {*} element 
     * @param {*} compare 
     * @returns the index of the sorted {KeyArray}; inserting the element in the returned index will to keep the {KeyArray} sorted
     */
    sortedInsertIndex(element, compare = this.comparator) {
        let high = this.elementMap.size;
        let low = 0;

        while (low < high) {
            const mid = (low + high) >>> 1;

            if (compare(this.elementMap.get(mid), element) > 0) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        return low;
    }


    replace = (index, ...elements) => this.$.#replace(elements, index);
    #replace(elements, index) {
        index = this.$.#validateIndexBound(index, this.elementMap.size - 1);

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (this.elementMap.has(index)) {
                this.$.#deleteFromMaps(index);
            }

            this.$.#insertToMaps(element, index);
            index++;
        }
    }

    replaceByKey = (key, position, ...elements) => this.$.#replaceByKey(elements, key, position);
    #replaceByKey = (elements, key, position) => this.$.#replace(elements, this.getKeyIndex(key, position));

    /**
    * replaces all elements in the {key} index, does not overwrites added elements,
    * inserts elements instead of replacing if needed to avoid overwriting added elements
    * 
    * @param {[]} elements 
    * @param {''} key
    */
    replaceByKeyAll = (key, ...elements) => this.$.#replaceByKeyAll(elements, key);
    #replaceByKeyAll = (elements, key) => {
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
            this.$.#replace(startElements, replaceIndex);

            const endElements = elements.slice(tempAmount);
            this.$.#insert(endElements, replaceIndex + tempAmount);
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
        while (++index - indexesToMove < this.elementMap.size) {
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
    removeByKeyAll(key, amount) {
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

    resetArray() {
        this.elementMap = new Map();
        this.indexMap = new Map();
    }

    /**
     * @param {(element, index = 0, instance = KeyArray) => any} callback, "instance" will return the instance of {KeyArray}, not an {Array}
     * @returns {KeyArray}
     */
    map = (callback) => this.$.#mapTo(this.$.#newKeyArray(), callback);
    splice = (start, deleteCount, ...items) => this.$.#spliceTo(this.$.#newKeyArray(), start, deleteCount, ...items);
    concat = (...values) => this.$.#concatTo(this.$.#newKeyArray(), values);
    slice = (start, end) => this.$.#sliceTo(this.$.#newKeyArray(), start, end);

    binarySearch(element, compare = this.comparator) {
        let high = this.elementMap.size;
        let low = 0;

        while (low < high) {
            const mid = (low + high) >>> 1;

            if (compare(element, this.elementMap.get(mid)) > 0) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        return element === this.elementMap.get(low) ? low : -1;
    }

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
    /** returns true if the element exists after it is transfered into its key value */
    includesByKey = (element) => this.keyExists(this.elementToKey(element));

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
    /** returns the key of the index */
    getKey = (index) => this.elementToKey(this.elementMap.get(index));

    /* ARRAY METHODS */

    /**
     * @param {(element, index)} callback 
     */
    forEach(callback) {
        let index = -1;
        while (++index < this.elementMap.size) {
            callback(this.elementMap.get(index), index);
        }
    }

    sort(compare = this.comparator) {
        const sortedArr = mergeSort(this.toArray(), compare);

        this.resetArray();
        this.$.#insert(sortedArr);

        return this;
    }

    toSorted(compare = this.comparator) {
        const sortedArr = mergeSort(this.toArray(), compare);

        const newKeyArray = this.$.#newKeyArray(sortedArr);

        return newKeyArray;
    }

    /**
     * @param {(accumulator, currentValue, currentIndex=0, instance = KeyArray) => any} callback, "instance" will return the instance of {KeyArray}, not an {Array}
     * @returns
     */
    reduce(callback, initialValue = null) {
        let index;
        let accumulator;

        if (initialValue === null) {
            accumulator = this.getFirst();
            index = 0;
        } else {
            accumulator = initialValue;
            index = -1;
        }

        while (++index < this.elementMap.size) {
            const element = this.elementMap.get(index);
            accumulator = callback(accumulator, element, index, this.$);
        }

        return accumulator;
    }

    /**
     * @param {(accumulator, currentValue, currentIndex=0, instance = KeyArray) => any} callback, "instance" will return the instance of {KeyArray}, not an {Array}
     * @returns
     */
    reduceRight(callback, initialValue = null) {
        let index;
        let accumulator;

        if (initialValue === null) {
            accumulator = this.getLast();
            index = this.size() - 1;
        } else {
            accumulator = initialValue;
            index = this.size();
        }

        while (--index >= 0) {
            const element = this.elementMap.get(index);
            accumulator = callback(accumulator, element, index, this.$);
        }

        return accumulator;
    }

    /**
     * @param {(element, index = 0, instance = KeyArray) => any} callback, "instance" will return the instance of {KeyArray}, not an {Array}
     * @returns {[]}
     */
    mapToArray = (callback) => this.$.#mapTo([], callback);

    concatToArray = (...values) => this.$.#concatTo([...this.$], values);

    sliceToArray = (start, end) => this.$.#sliceTo([], start, end);

    spliceToArray = (start = 0, deleteCount, ...items) => this.$.#spliceTo([], start, deleteCount, items);

    toSortedArray = (compare = this.comparator) => mergeSort(this.toArray(), compare);

    includes(searchElement, fromIndex) {
        fromIndex = this.$.#validateIndex(fromIndex, 0);

        while (fromIndex < this.elementMap.size) {
            if (this.elementMap.get(fromIndex) === searchElement) return true;
            fromIndex++;
        }

        return false;
    }

    push = (...elements) => this.$.#insert(elements, this.elementMap.size);

    pop() {
        const poppedElement = this.getLast();
        this.remove(this.elementMap.size - 1);
        return poppedElement;
    }

    unshift = (...elements) => this.$.#insert(elements, 0);

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
            index = toNumber(index);
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

    #concatTo(obj, values) {
        for (const value of values) {
            if (Array.isArray(value)) {
                obj.push(...value);
            } else {
                obj.push(value);
            }
        }

        return obj;
    }

    #sliceTo(obj, start, end) {
        start = Number(start);
        end = Number(end);

        if (isNaN(end)) {
            end = this.elementMap.size;
        }

        start = this.$.#validateIndex(start, this.elementMap.size - 1);

        start--;
        while (++start < end) {
            obj.push(this.elementMap.get(start));
        }

        return obj;
    }

    #mapTo(obj, callback) {
        this.forEach((element, index) => {
            obj.push(callback(element, index, this.$));
        });

        return obj;
    }

    #spliceTo(obj, start, deleteCount, items) {
        start = Number(start);
        if (isNaN(start)) {
            start = 0;

        } else {
            start = this.$.#validateIndex(start, this.elementMap.size - 1);
        }

        deleteCount = Number(deleteCount);
        if (isNaN(deleteCount)) {
            deleteCount = this.elementMap.size;
        }

        let deleteFrom = start - 1;
        let deleteTo = deleteCount + start;
        if (deleteTo > this.length) deleteTo = this.length;

        while (++deleteFrom < deleteTo) {
            obj.push(this.get(deleteFrom));
        }

        this.remove(start, deleteTo);
        this.$.#insert(items, start);

        return obj;
    }

    #newKeyArray(array) {
        return new this.$classConstructor({
            array: array ?? [...this.$],
            elementToKey: this.elementToKey,
            comparator: this.comparator,
        });
    }

    #getIndexMapSortedIndex = (key, index) => sortedInsertIndex(this.indexMap.get(key), index);

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

export function KeyArrayProxy({
    array = [],
    elementToKey = (element) => typeof element === 'object' ? element : `${element}`,
    comparator = (a, b) => `${a}`.localeCompare(b),
}) {
    // if the "new" keyword isn't used when calling the function, throw TypeError
    if (!(this instanceof KeyArrayProxy)) throw TypeError(`Constructor KeyArrayProxy requires "new"`);

    // initialize KeyArray
    const instance = new KeyArray({
        array,
        elementToKey,
        comparator
    });
    instance.$classConstructor = KeyArrayProxy;

    return new Proxy(instance, {
        get(obj, key, receiver) {
            const keyNumber = typeof key === 'symbol' ? NaN : key;

            return isNaN(keyNumber) ? obj[key] : obj.get(Number(key));
        },

        set(obj, key, value, receiver) {
            if (isNaN(key)) return obj[key] = value;

            const keyNumber = Number(key);
            if (obj.exists(keyNumber)) obj.replace(key, value);
            else obj.insert(keyNumber, value);

            return true;
        },
    });
}

/* Independent Functions */

const arrInsert = (arr = [], index = 0, ...elements) => arr.splice(index, 0, ...elements);
const arrRemove = (arr = [], index = 0, count = 1) => arr.splice(index, count);
const arrIsEmpty = (arr = []) => arr.length === 0;
const toNumber = (num) => Number(num);

const mergeSort = (array, compare) => {

    const merge = (leftArr, rightArr) => {
        const sortedArr = [];

        while (leftArr.length && rightArr.length) {
            if (compare(leftArr[0], rightArr[0]) > 0) {
                sortedArr.push(rightArr.shift());
            } else {
                sortedArr.push(leftArr.shift());
            }
        }

        return [...sortedArr, ...leftArr, ...rightArr];
    }

    const mergeSortHelper = (arr) => {
        if (arr.length < 2) return arr;

        const otherArr = arr.splice(0, arr.length >>> 1);

        return merge(mergeSortHelper(arr), mergeSortHelper(otherArr));
    }

    return mergeSortHelper(array);
}

const sortedInsertIndex = (sortedArr, num) => {
    let high = sortedArr.length;
    let low = 0;

    while (low < high) {
        const mid = (low + high) >>> 1;

        if (sortedArr[mid] > num) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }

    return low;
}

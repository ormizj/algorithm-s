import { arrInsert, arrRemove } from "../mutation/arrUtil.mjs";
import { arrValidate, arrIsEmpty, isArr, arrIndexToInsertNum } from "../pure/arrUtil.mjs";
import { isNull } from "../pure/jsUtil.mjs";
import { hasOwn } from "../pure/objUtil.mjs";

//TODO add unique (keySet class)
export class keyArray {
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

    insert(elements = [], index) {
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

    //TODO how to remove from middle
    remove(index) {
        const mapKey = this.elementToKey(this.srcArr[index]);
        delete this.indexMap[mapKey];

        arrRemove(this.srcArrarr, index);
    }

    toArray() {
        const arr = [];
        let index = -1;
        while (++index < this.length) {
            const element = this.elementMap[index];
            arr.push(element);
        }
        return arr;
    }

    //TODO remove by key

    //TODO testing with an object
    // key is determined by indexPath
    findByKey(key) {
        const index = mapKey[key];
        return this.elementMap[index];
    }

    //TODO forEach
    //TODO forEachBreak
    //TODO sort

    #validateIndex(index, canBeEmptyIndex = true) {
        const maxIndex = canBeEmptyIndex ? this.length : this.length - 1;

        if (isNull(index) || index >= maxIndex) return maxIndex;
        if (index < 0) return 0;
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

    find = (index) => this.elementMap[index];
    size = () => this.length;
}


import { arrRemoveIndex } from "../mutation/arrUtil.mjs";
import { arrValidate, arrIsEmpty } from "../pure/arrUtil.mjs";
import { getValueByPath, isNull } from "../pure/jsUtil.mjs";
import { hasOwn } from "../pure/objUtil.mjs";

export class keyArray {
    constructor({
        arr = [],
        keyPath = [],
        keyStringFunc = (element) => `${element}`
    } = {}) {
        this.keyPath = keyPath;// path to the value to be used as the "indexMap" key
        this.keyStringFunc = keyStringFunc;// function to stringifiy the key before placed in the "indexMap"

        this.elementMap = {};// map containing the elements [key: index,    value:element]
        this.indexMap = {};// map containing the indexes    [key: string,   value:index]

        this.length = 0;// length of the keyArray

        this.insert(arr);// convert array to "elementMap" + "indexMap"
    }

    //TODO finish + testing
    insert(elements = [], index) {
        index = this.#validateIndex(index, elements.length);
        elements = arrValidate(elements);

        const overwrittenElements = [];
        let indexesToMove = 0;
        let currentLength = this.length;

        for (const element of elements) {
            // overwriting value in "elementMap"
            if (hasOwn(this.elementMap, index)) {
                overwrittenElements.push(this.elementMap[index]);
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
                this.#insertToMaps(this.elementMap[index], newIndex);
            }

            for (const overwrittenElement of overwrittenElements) {
                this.#insertToMaps(overwrittenElement, lastFilledIndex);
                lastFilledIndex++;
            }
        }

        this.length += elements.length;
    }

    //TODO how to remove from middle
    remove = (index) => {
        const mapKey = this.#getMapKey(this.srcArr[index]);
        delete this.indexMap[mapKey];

        arrRemoveIndex(this.srcArrarr, index);
    }

    toArray = () => {
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
    //key is determined by indexPath
    findByKey(key) {
        const index = mapKey[key];
        return this.elementMap[index];
    }

    //TODO forEach
    //TODO toArr
    //TODO sort

    #validateIndex = (index, indexingLength = 0, canBeEmptyIndex = true) => {
        const maxIndex = canBeEmptyIndex ? this.length : this.length - 1 - indexingLength;

        if (isNull(index) || index >= maxIndex) return maxIndex;
        if (index < 0) return 0;
        return index;
    }

    #insertToMaps = (element, index) => {
        this.elementMap[index] = element;
        const key = this.#getMapKey(element);
        this.indexMap[key] = index;
    }

    #getMapKey = (element) => {
        const key = getValueByPath(element, this.indexPath);
        return this.keyStringFunc(key);
    };

    find = (index) => this.elementMap[index];
    size = () => this.length;
}


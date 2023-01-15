import { arrInsert, arrRemove, arrRemoveIndex } from "../mutation/arrUtil.mjs";
import { getValueByPath } from "../pure/jsUtil.mjs";

export class quickArray {
    srcArr = [];
    indexMap = {};
    indexPath;

    //indexPath need to point to a key, that can be used as a JSON key
    constructor({ indexPath = [], srcArr } = {}) {
        this.indexPath = indexPath;
        this.#initSrcArr(srcArr);
    }

    //TODO
    insert(element, index) {
        if (index === undefined) index = this.srcArr.length;
        arrInsert(this.srcArr, index, element);

        const mapKey = getValueByPath(element, this.indexPath);
        this.indexMap[mapKey] = index;
    }

    //TODO
    remove = (index) => {
        const mapKey = getValueByPath(this.srcArr[index], this.indexPath);
        delete this.indexMap[mapKey];

        arrRemoveIndex(this.srcArrarr, index);
    }

    //TODO
    //key is determined by indexPath
    findByKey(key) {
        const index = mapKey[key];
        return this.srcArr[index];
    }

    #initSrcArr(arr) {
        for (const element of arr) this.insert(element);
    }

    getSrcArr = () => this.srcArr;
    getIndexPath = () => this.indexPath
    getIndexMap = () => this.indexMap;

    find = (index) => this.srcArr[index];
    size = () => this.srcArr.length;
}
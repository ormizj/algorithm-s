import { arrFindIndex } from '../pure/arrUtil.js'

export const arrInsert = (arr = [], index = 0, ...elements) => arr.splice(index, 0, ...elements);

export const arrRemove = (arr = [], index = 0, count = 1) => arr.splice(index, count);

export const arrRemoveElement = (arr = [], element) => {
    const index = arrFindIndex(arr, element);
    arrRemove(arr, index);
}
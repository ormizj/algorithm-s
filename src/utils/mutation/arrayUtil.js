import { findIndex } from '../pure/arrayUtil.js'

export const insert = (arr = [], index = 0, ...elements) => arr.splice(index, 0, ...elements);

export const remove = (arr = [], index = 0, count = 1) => arr.splice(index, count);

export const removeElement = (arr = [], element) => {
    const index = findIndex(arr, element);
    remove(arr, index);
}
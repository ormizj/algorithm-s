export const arrInsert = (arr = [], index = 0, ...elements) => arr.splice(index, 0, ...elements);

export const arrRemoveIndex = (arr = [], index = 0, count = 1) => arr.splice(index, count);

export const arrRemove = (arr = [], element) => {
    const index = arrFindIndex(arr, element);
    arrRemoveIndex(arr, index);
}
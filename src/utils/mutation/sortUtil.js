export const mergeSort = (array, compare) => {

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

/**
 * @param {[Number]} sortedArr 
 * @param {Number} num 
 * @returns the index of the {sortedArr} to insert the {num} to, to keep the array sorted
 */
export const binaryInsertIndex = (sortedArr, num) => {
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
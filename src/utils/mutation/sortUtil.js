const mergeSort = (array, comparator) => {

    const merge = (leftArr, rightArr) => {
        const sortedArr = [];

        while (leftArr.length && rightArr.length) {
            if (comparator(leftArr[0], rightArr[0]) > 0) {
                sortedArr.push(rightArr.shift());

            } else {
                sortedArr.push(leftArr.shift());
            }
        }

        return [...sortedArr, ...leftArr, ...rightArr];
    }

    const mergeSortHelper = (arr) => {
        if (arr.length < 2) return arr;

        const otherArr = arr.splice(0, Math.floor(arr.length / 2));

        return merge(mergeSortHelper(arr), mergeSortHelper(otherArr));
    }

    return mergeSortHelper(array);
}
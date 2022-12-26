/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
const findMedianSortedArrays = function (nums1, nums2) {
    nums1.push(...nums2);
    nums1.sort((num1, num2) => num1 - num2);

    const halfLength = nums1.length / 2;

    if (nums1.length % 2 === 1) {
        return nums1[Math.floor(halfLength)];
    }

    return (nums1[halfLength - 1] + nums1[halfLength]) / 2;
};

//solution 2
const findMedianSortedArrays2 = function (nums1, nums2) {
    let index1 = 0;
    let index2 = 0;
    const length1 = nums1.length;
    const length2 = nums2.length;
    const totalLength = length1 + length2;

    const medianValue = [];
    // "for" on half of the arrays length (to find median)
    for (let i = 0; i < Math.floor(totalLength / 2) + 1; i++) {
        // if last 2 iterations
        const isLastIterations = index1 + index2 > Math.floor(totalLength / 2) - 2;

        // if number is smaller, or out of iterations
        if (nums1[index1] < nums2[index2] || index2 == length2) {
            if (isLastIterations) medianValue.push(nums1[index1]);
            index1++

        } else {
            if (isLastIterations) medianValue.push(nums2[index2]);
            index2++;
        }
    }

    // if length is even, divide the medians by 2
    if (totalLength % 2 === 0) {
        return (medianValue[0] + medianValue[1]) / 2;
    }

    // if medianValue size is 1, return the first index
    return medianValue[1] || medianValue[0];
};


/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.mjs";
printResult({ answerCb: findMedianSortedArrays, expected: 2.00000, input: { nums1: [1, 3], nums2: [2] } });
printResult({ answerCb: findMedianSortedArrays, expected: 2.50000, input: { nums1: [1, 2], nums2: [3, 4] } });
printResult({ answerCb: findMedianSortedArrays2, expected: 2.00000, input: { nums1: [1, 3], nums2: [2] } });
printResult({ answerCb: findMedianSortedArrays2, expected: 2.50000, input: { nums1: [1, 2], nums2: [3, 4] } });
printResult({ answerCb: findMedianSortedArrays2, expected: 5.00000, input: { nums1: [3, 4, 5, 6, 7, 8, 9], nums2: [1, 2] } });
printResult({ answerCb: findMedianSortedArrays2, expected: 1.00000, input: { nums1: [], nums2: [1] } });
printEnd();

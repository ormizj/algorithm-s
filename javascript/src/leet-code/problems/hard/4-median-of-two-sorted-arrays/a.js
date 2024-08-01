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

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = findMedianSortedArrays;
printResult({ answerCb, expected: 2.00000, input: { nums1: [1, 3], nums2: [2] } });
printResult({ answerCb, expected: 2.50000, input: { nums1: [1, 2], nums2: [3, 4] } });

printEnd();

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {boolean}
 */
var leafSimilar = function (root1, root2) {
    const treeRootsToStr = (node) => {
        if (node !== null) {
            if (node.left === null && node.right === null) {
                return `${node.val}`;
            }

            return treeRootsToStr(node.right) + treeRootsToStr(node.left);
        } else {
            return '';
        }
    }

    return treeRootsToStr(root1) === treeRootsToStr(root2);
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = leafSimilar;
printResult({ answerCb, expected: true, input: { root1: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4], root2: [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8] } });
printResult({ answerCb, expected: false, input: { root1: [1, 2, 3], root2: [1, 3, 2] } });
printResult({ answerCb, expected: true, input: { root1: [1, 2, null, 3], root2: [1, 3] } });
printResult({ answerCb, expected: false, input: { root1: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 14], root2: [3, 5, 1, 6, 71, 4, 2, null, null, null, null, null, null, 9, 8] } });

printEnd();

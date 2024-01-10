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
    let tempStrNum = '';

    const inOrderTraversal = (node) => {
        if (node !== null) {
            if (node.left === null && node.right === null) {
                tempStrNum = `${node.val}${tempStrNum}`;
                return;
            }
            inOrderTraversal(node.left, node.val);
            inOrderTraversal(node.right, node.val);
        }
    }

    inOrderTraversal(root1);
    const strNum1 = tempStrNum;
    tempStrNum = '';
    inOrderTraversal(root2);
    const strNum2 = tempStrNum;

    return strNum1 === strNum2;
};

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = leafSimilar;
printResult({ answerCb, expected: true, input: { root1: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4], root2: [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8] } });
printResult({ answerCb, expected: false, input: { root1: [1, 2, 3], root2: [1, 3, 2] } });
printResult({ answerCb, expected: true, input: { root1: [1, 2, null, 3], root2: [1, 3] } });
printResult({ answerCb, expected: false, input: { root1: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 14], root2: [3, 5, 1, 6, 71, 4, 2, null, null, null, null, null, null, 9, 8] } });

printEnd();

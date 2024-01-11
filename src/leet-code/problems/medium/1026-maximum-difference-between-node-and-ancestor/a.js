/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxAncestorDiff = function (root) {
    let maxAnc = 0;

    const nodeTraversal = (node, min, max) => {
        if (node) {
            maxAnc = Math.max(maxAnc, max - node.val, node.val - min);
            max = Math.max(max, node.val);
            min = Math.min(min, node.val);

            nodeTraversal(node.left, min, max);
            nodeTraversal(node.right, min, max);
        }
    }
    nodeTraversal(root, Infinity, 0);

    return maxAnc;
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = maxAncestorDiff;
printResult({ answerCb, expected: 7, input: { root: [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13] } });
printResult({ answerCb, expected: 3, input: { root: [1, null, 2, null, 0, 3] } });

printEnd();
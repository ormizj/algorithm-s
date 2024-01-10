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
 * @param {number} start
 * @return {number}
 */
const amountOfTime = (root, start) => {
    let amount = 0;

    const traverse = (root, start) => {
        if (!root) {
            return 0;
        }

        let left = traverse(root.left, start);
        let right = traverse(root.right, start);

        if (root.val === start) {
            amount = Math.max(left, right);
            return -1;

        } else if (left >= 0 && right >= 0) {
            return Math.max(left, right) + 1;

        } else {
            amount = Math.max(amount, Math.abs(left - right));
            return Math.min(left, right) - 1;
        }
    }
    traverse(root, start)

    return amount;
}

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = amountOfTime;

printResult({ answerCb, expected: 4, input: { root: [1, 5, 3, null, 4, 10, 6, 9, 2], start: 3 } });
printResult({ answerCb, expected: 0, input: { root: [1], start: 1 } });

printEnd();
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    const node = new ListNode();
    let nextNode = node;
    let num1 = '';
    let num2 = '';

    while (l1 || l2) {
        if (l1) {
            num1 = String(l1.val) + num1
            l1 = l1.next;
        }

        if (l2) {
            num2 = String(l2.val) + num2;
            l2 = l2.next;
        }
    }

    let sumNumber = String(BigInt(num1) + BigInt(num2));
    for (let i = sumNumber.length - 1; i > 0; i--) {
        nextNode.val = sumNumber[i];
        nextNode.next = new ListNode();
        nextNode = nextNode.next;
    }
    nextNode.val = sumNumber[0];

    return listNodeToArr(node);
};

function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

function listNodeToArr(node) {
    const arr = [];

    while (node) {
        arr.push(node.val);
        node = node.next;
    }

    return arr;
}

function arrToListNode(arr) {
    const node = new ListNode();
    let nextNode = node;
    for (let i = arr.length - 1; i > 0; i--) {
        nextNode.val = arr[i];
        nextNode.next = new ListNode();
        nextNode = nextNode.next;
    }
    nextNode.val = arr[0];

    return node;
}

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = addTwoNumbers;
printResult({ answerCb, expected: ['7', '0', '8'], input: { l1: arrToListNode([2, 4, 3]), l2: arrToListNode([5, 6, 4]) } });

printEnd();
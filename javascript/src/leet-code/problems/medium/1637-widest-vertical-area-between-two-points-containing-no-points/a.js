/**
 * @param {number[][]} points
 * @return {number}
 */
var maxWidthOfVerticalArea = function (points) {
    let widestArea = 0;

    points.sort((point, oPoint) => point[0] - oPoint[0]);

    for (let i = 0; i < points.length - 1; i++) {
        const currentArea = points[i + 1][0] - points[i][0];
        widestArea = Math.max(widestArea, currentArea);
    }

    return widestArea;
};

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = maxWidthOfVerticalArea;

printResult({ answerCb, expected: 1, input: { points: [[8, 7], [9, 9], [7, 4], [9, 7]] } });
printResult({ answerCb, expected: 6, input: { points: [[3, 1], [9, 0], [1, 0]] } });
printResult({ answerCb, expected: 3, input: { points: [[3, 1], [9, 0], [1, 0], [1, 4], [5, 3], [8, 8]] } });
printResult({ answerCb, expected: 3, input: { points: [[0, 0], [5, 0], [0, 1], [3, 1], [6, 1]] } });
printResult({ answerCb, expected: 10, input: { points: [[58, 71], [64, 41], [96, 14], [26, 37], [11, 67], [84, 2], [72, 0], [16, 95], [74, 100], [60, 98], [8, 45], [6, 59], [69, 32], [93, 12], [26, 56], [9, 39], [61, 84], [54, 93], [43, 47], [84, 40], [95, 82], [17, 85], [99, 41], [96, 24], [83, 10], [82, 62], [26, 81], [74, 96], [53, 0], [11, 72], [51, 35], [33, 3], [33, 52], [58, 94], [89, 92], [54, 85]] } });

printEnd();
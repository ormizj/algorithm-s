/**
 * @param {number[][]} points
 * @return {number}
 */
var minTimeToVisitAllPoints = function (points) {
    let time = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const yTime = getDifference(points[i][0], points[i + 1][0]);
        const xTime = getDifference(points[i][1], points[i + 1][1]);

        time += Math.max(xTime, yTime);
    }

    return time;
};

function getDifference(num, oNum) {
    return Math.abs(num - oNum);
}

/*----------------------------------------------------------------------------------------------------*/
import { printEnd, printResult } from "../../../answerUtil.js";

const answerCb = minTimeToVisitAllPoints;
printResult({ answerCb, expected: 7, input: { points: [[1, 1], [3, 4], [-1, 0]] } });
printResult({ answerCb, expected: 5, input: { points: [[3, 2], [-2, 2]] } });

printEnd();

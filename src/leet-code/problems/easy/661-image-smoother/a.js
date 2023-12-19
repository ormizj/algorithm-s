/**
 * @param {number[][]} img
 * @return {number[][]}
 */
var imageSmoother = function (img) {
    const imgSmooth = [];

    for (let i = 0; i < img.length; i++) {
        const row = img[i];
        imgSmooth[i] = [];

        for (let j = 0; j < row.length; j++) {
            imgSmooth[i][j] = getSurroundPointsAvg(img, i, j, 1);
        }
    }

    return imgSmooth;
};

const getSurroundPointsAvg = (img, row, clm, radius) => {
    let sum = 0;
    let totalData = 0;
    let iRow = Math.max(row - radius, 0);
    let iClm = Math.max(clm - radius, 0);


    while (true) {
        const data = img[iRow]?.[iClm];

        if (data !== undefined) {
            sum += data;
            totalData++;
        }

        if (iClm < clm + radius) {
            iClm++;
        } else if (iRow < row + radius) {
            iRow++;
            iClm = Math.max(clm - radius, 0);
        } else {
            break;
        }
    }

    return Math.floor(sum / totalData);
}

/*----------------------------------------------------------------------------------------------------*/
import { printResult, printEnd } from "../../../answerUtil.js";

const answerCb = imageSmoother;
printResult({ answerCb, expected: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], input: { img: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] } });
printResult({ answerCb, expected: [[137, 141, 137], [141, 138, 141], [137, 141, 137]], input: { img: [[100, 200, 100], [200, 50, 200], [100, 200, 100]] } });

printEnd();

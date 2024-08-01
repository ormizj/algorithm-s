/**
 * all functions return the name + time of the functions that took the LONGEST to perform
 *
 * use the "Function.prototype.bind()" if cb contains parameters
 * 
 * Example: const myFunction = <function>.bind(null, <arg1>, <arg2>, ...);
 *          await calculateTime(myFunction);
 */
/*----------------------------------------------------------------------------------------------------*/

export const calculateTime = async (cb) => {
    let startTime, endTime;

    startTime = performance.now();
    await cb();
    endTime = performance.now();

    return endTime - startTime;
}

export const calculateTimeAvg = async ({
    name,
    cb,
    repeat = 1
}) => {
    const times = [];
    let fastestTime = Number.MAX_VALUE;
    let slowestTime = Number.MIN_VALUE;

    const returnedTime = {
        name,
        avgTime: 0,
        totalTime: 0,
        fastestTime,
        slowestTime,
        repeat,
    };

    while (repeat-- > 0) {
        const timeResult = await this.calculateTime(cb);
        times.push(timeResult);

        if (timeResult < fastestTime) fastestTime = timeResult;
        if (timeResult > slowestTime) slowestTime = timeResult;
    }

    //get avg and total
    const totalTime = times.reduce((a, b) => a + b);
    returnedTime.avgTime = totalTime / times.length;
    returnedTime.totalTime = totalTime;
    returnedTime.fastestTime = fastestTime;
    returnedTime.slowestTime = slowestTime;

    return returnedTime;
}

export const compareTime = async ({
    name,
    cb,
    otherName,
    otherCb,
}) => {
    let totalTime, otherTotalTime;

    totalTime = await this.calculateTime(cb);
    otherTotalTime = await this.calculateTime(otherCb);

    return getRelativeTime({
        name,
        totalTime,
        otherName,
        otherTotalTime
    });
}

export const compareTimeAvg = async ({
    name,
    cb,
    otherName,
    otherCb,
    repeat = 1
}) => {
    const times = [];
    const otherTimes = [];
    let timeFaster = 0;
    let otherTimeFaster = 0;
    let equal = 0;
    let fastestTime = Number.MAX_VALUE;
    let slowestTime = Number.MIN_VALUE;
    let otherFastestTime = Number.MAX_VALUE;
    let otherSlowestTime = Number.MIN_VALUE;

    const returnedTime = {
        fastFunction: null,
        avgTimeDifference: 0,
        xTimesDifference: 1,
        [`${name}Function`]: null,
        [`${otherName}Function`]: null,
        equal: 0,
        repeat
    };

    while (repeat-- > 0) {
        let timeResult = null;
        let cbSpeed = 'fast';
        let otherCbSpeed = 'fast';

        //switching between function position, to minimize the affect memory on comparison
        if (repeat % 2 === 0) {
            timeResult = await this.compareTime({
                name,
                cb,
                otherName,
                otherCb,
            });
        } else {
            timeResult = await this.compareTime({
                name: otherName,
                cb: otherCb,
                otherName: name,
                otherCb: cb,
            });
        }

        //check who is fast
        if (timeResult.fast.name === name) {
            timeFaster++;
            otherCbSpeed = 'slow';
        } else if (timeResult.fast.name === otherName) {
            otherTimeFaster++;
            cbSpeed = 'slow';
        } else {
            equal++;
        }

        //times list
        times.push(timeResult[cbSpeed].totalTime);
        otherTimes.push(timeResult[otherCbSpeed].totalTime);

        //time records
        if (timeResult[cbSpeed].totalTime < fastestTime) fastestTime = timeResult[cbSpeed].totalTime;
        if (timeResult[cbSpeed].totalTime > slowestTime) slowestTime = timeResult[cbSpeed].totalTime;
        if (timeResult[otherCbSpeed].totalTime < otherFastestTime) otherFastestTime = timeResult[otherCbSpeed].totalTime;
        if (timeResult[otherCbSpeed].totalTime > otherSlowestTime) otherSlowestTime = timeResult[otherCbSpeed].totalTime;
    }

    //get avg and total
    const totalTime = times.reduce((a, b) => a + b);
    const otherTotalTime = otherTimes.reduce((a, b) => a + b);

    const timesAvg = totalTime / times.length;
    const otherTimesAvg = otherTotalTime / otherTimes.length;

    const avgRelativeTime = getRelativeTime({
        name,
        totalTime: timesAvg,
        otherName,
        otherTotalTime: otherTimesAvg
    });

    //adding base data
    returnedTime.fastFunction = avgRelativeTime.fast.name;
    returnedTime.avgTimeDifference = avgRelativeTime.timeDifference;
    returnedTime.xTimesDifference = avgRelativeTime.xTimesDifference;

    //add function specific data
    returnedTime[`${name}Function`] = {
        avgTime: timesAvg,
        NumOfTimeFaster: timeFaster,
        totalTime,
        fastestTime,
        slowestTime
    }
    returnedTime[`${otherName}Function`] = {
        avgTime: otherTimesAvg,
        NumOfTimeFaster: otherTimeFaster,
        totalTime: otherTotalTime,
        fastestTime: otherFastestTime,
        slowestTime: otherSlowestTime
    }

    //add general data
    returnedTime.equal = equal;

    return returnedTime;
}

const getRelativeTime = ({
    name,
    totalTime,
    otherName,
    otherTotalTime
}) => {
    let timeDifference = totalTime - otherTotalTime;
    const returnedTime = {
        fast: {
            name: null,
            totalTime: null,
        },
        xTimesDifference: 1,
        timeDifference,
        slow: {
            name: null,
            totalTime: null,
        }
    }

    //cb is longer
    if (timeDifference > 0) {
        returnedTime.fast.name = otherName;
        returnedTime.fast.totalTime = otherTotalTime;
        returnedTime.xTimesDifference = totalTime / otherTotalTime;
        returnedTime.slow.name = name;
        returnedTime.slow.totalTime = totalTime;

        //otherCb is longer
    } else if (timeDifference < 0) {
        timeDifference *= -1;

        returnedTime.fast.name = name;
        returnedTime.fast.totalTime = totalTime;
        returnedTime.xTimesDifference = otherTotalTime / totalTime;
        returnedTime.timeDifference = timeDifference;
        returnedTime.slow.name = otherName;
        returnedTime.slow.totalTime = otherTotalTime;

        //cb & otherCb are equal
    } else {
        returnedTime.fast.name = `${name}, ${otherName}`;
        returnedTime.fast.totalTime = totalTime;
        returnedTime.slow.name = `${name}, ${otherName}`;
        returnedTime.slow.totalTime = totalTime;
    }

    return returnedTime;
}
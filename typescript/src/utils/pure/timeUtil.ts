/**
 * @param seconds
 * @param delimiter
 * @returns string
 * @see #HHMMSStoSeconds
 */
export const secondsToHHMMSS = (seconds: number, delimiter = ':') => {
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let hoursStr = `${hours}`;
    let minutesStr = `${minutes}`;
    let secondsStr = `${seconds}`;
    if (hours < 10) hoursStr = '0' + hours;
    if (minutes < 10) minutesStr = '0' + minutes;
    if (seconds < 10) secondsStr = '0' + seconds;
    return `${hoursStr}${delimiter}${minutesStr}${delimiter}${secondsStr}`;
};

/**
 * @param HHMMSS
 * @param delimiter
 * @returns {number}
 * @see #secondsToHHMMSS
 */
export const HHMMSStoSeconds = (HHMMSS: string, delimiter = ':'): number => {
    const parts = HHMMSS.split(delimiter);

    for (let i = 0; i < parts.length; i++) {
        if (parts[i].length === 1) {
            parts[i] += '0';
        }
    }

    const hours = +(parts[0] ?? 0);
    const minutes = +(parts[1] ?? 0);
    const seconds = +(parts[2] ?? 0);

    return hours * 3600 + minutes * 60 + seconds;
};

/**
 * @param {Date} date 
 * @param {*} format E.G. 'en-US', ['ban','id']
 * @see {Intl.DateTimeFormat}
 * @returns 
 */
export const toMap = (date = undefined, format = undefined) => {
    const dateArr = new Intl.DateTimeFormat(format).formatToParts(date);

    const dateObj = {};
    for (const dateAttr of dateArr) {
        dateObj[dateAttr.type] = dateAttr.value;
    }

    return dateObj;
}

/**
 * @param {Date} date 
 * @returns {[year, month, day]}
 */
export const toArray = (date = new Date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1; //January is 0!
    let day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        dd = '0' + dd;
    }

    return [year, month, day];
}

/**
 * @param dateFrom
 * @param dateTo
 * @returns {number} month difference between dates, without taking days into account
 */
export const monthDuration = (dateFrom, dateTo) => {
    return dateTo.getMonth() - dateFrom.getMonth()
        + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
}

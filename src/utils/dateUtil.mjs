export const getDateMap = (date, format) => {
    const dateArr = new Intl.DateTimeFormat(format).formatToParts(date);

    const dateObj = {};
    for (const dateAttr of dateArr) {
        dateObj[dateAttr.type] = dateAttr.value;
    }

    return dateObj;
};
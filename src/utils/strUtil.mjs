export const isString = (str) => typeof str === 'string';

export const strCompareAs = (str, otherStr) => `${str}` === `${otherStr}`;

/**
 * Adds a child to html structured {String}. 
 * 
 * @param {*} strHtml html structured {String}
 * @param {*} strEl starting string of the element to add the child to 
 * @param {*} strChild child to be added to the {strEl}
 * @returns copy of the html structured {String}, with the {strChild} appended, or undefined if {strEl} was not found
 */
export const strAddHtmlChild = (strHtml = '', strEl = '', strChild = '') => {
    const toCut = strEl.includes('/') ? -2 : -1;
    const elStart = strEl.slice(0, toCut);
    const elEnd = strEl.slice(toCut);
    const elLen = strEl.length;

    let isEnd = false;
    let currentIndex = 0;
    for (let i = 0; i < strHtml.length; i++) {
        const letter = strHtml[i];

        if (letter === elStart[currentIndex] || elEnd[elLen - 1 - currentIndex] === letter) {
            currentIndex++;
            if (elStart.length - currentIndex + 1 === elEnd.length) {
                isEnd = true
            }

        } else if (currentIndex === elLen) {
            return strInsert(strHtml, strChild, i);

        } else {
            if (!isEnd) {
                currentIndex = 0;
            }
        }
    }
};

export const strInsert = (str, insertStr, index) => {
    if (index > 0) {
        return str.substring(0, index) + insertStr + str.substring(index);
    }

    return str + insertStr;
};
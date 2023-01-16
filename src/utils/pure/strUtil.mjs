export const isString = (str) => typeof str === 'string';

export const strCompareAs = (str, otherStr) => `${str}` === `${otherStr}`;

export const strIsSubString = (longStr = '', shortStr = '') => longStr.indexOf(shortStr) > -1;

export const strRemoveLastLetter = (str = '') => str.substring(0, str.length - 1);

export const strGetFirstWord = (str = '') => str.split(' ')[0];

export const numericAddToStr = (numeric = '0' | 0, otherNumeric = '1' | 1) => `${BigInt(`${numeric}`) + BigInt(`${otherNumeric}`)}`;

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


export const strGetLastWord = (str = '') => {
    const strArr = str.split(' ');
    return strArr[strArr.length - 1];
}

export const toStringDelimiter = (delimiter = '', ...any) => {
    let str = '';
    for (let i = 0; i < any.length - 1; i++) {
        str += `${any[i]}${delimiter}`;
    }
    str += `${any[any.length - 1]}`;
    return str;
}

export const strCut = (str = '', cut = '') => str.replace(cut, '');
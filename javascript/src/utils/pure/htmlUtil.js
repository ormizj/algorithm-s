import { isBetween } from "./numberUtil.js";

export const findChild = (element = HTMLElement, className = '') => {
    for (let child of element.children) {
        if (child.className === className) return child;
    }
}

export const findChildInclude = (element = HTMLElement, className = '') => {
    for (let child of element.children) {
        if (child.className.includes(className)) return child;
    }
}

export const blurActiveElement = () => {
    document.activeElement.blur();
}

export const rgbToRgba = (rgb = 'rgb(255,255,255)', opacity = 1) => {
    let rgba = rgb;
    rgba = rgba.replace(/rgb/i, "rgba");
    rgba = rgba.replace(/\)/i, `, ${opacity})`);
    return rgba;
}

export const wheelEventDirection = (event) => {
    if (event.deltaY < 0) return 'up';
    return 'down';
}

export const styleAddWidth = (element, widths, widthType = 'width') => {
    const unit = element.style[widthType].slice(-2);
    let currWidth = element.style[widthType].slice(0, -2);
    currWidth = Number(currWidth);

    for (const width of widths) {
        currWidth = currWidth.add(width);
    }

    element.style[widthType] = `${currWidth}${unit}`;

    return {
        currWidth,
        unit
    };
}

export const calcOverflow = (elements, startCb, endCb) => {
    let maxOverflowWidth = 0;
    let maxOffsetWidth = 0;

    //helper function
    const compareWidth = (el) => {
        startCb?.(el);

        if (el.scrollWidth > maxOverflowWidth) {
            maxOverflowWidth = el.scrollWidth;

            if (el.offsetWidth > maxOffsetWidth) maxOffsetWidth = el.offsetWidth
        }

        endCb?.(el);
    }

    //get max widths
    if (elements.forEach) {
        elements.forEach((el) => {
            compareWidth(el);
        });
    } else {
        compareWidth(elements);
    }

    //element has overflow
    if (maxOverflowWidth !== maxOffsetWidth) {
        return maxOverflowWidth - maxOffsetWidth;
    }
    //element does not have overflow
    return 0;
}

/**
 *
 * @param element the element to scroll.
 * @param current current scroll position of the element.
 * @param to scroll position destination.
 * @param {''=} direction of the scroll, both if not 'x' or 'y'.
 * @param {number=} ease of the animation, higher = slower.
 */
export const scrollToAnimation = (element = HTMLElement, current = 0, to = 0, {
    direction = '', // ('x'/'y'/any)
    ease = 50
} = {}) => {
    if (to > 0) {
        to = 0;
    } else if (to < element.offsetWidth - element.scrollWidth) {
        to = element.offsetWidth - element.scrollWidth;
    }

    const scrollLeft = current - to;
    let speed = -(scrollLeft / ease);

    if (isBetween(speed, 0, 1)) {
        speed = 1;
    } else if (isBetween(speed, -1, 0)) {
        speed = -1;
    }

    let previous = current;
    const intervalId = setInterval(() => {
        current += speed;

        scrollByDirection(element, direction, speed)

        if (speed < 0) {
            if (current < to || previous === current) {
                scrollToDirection(element, direction, to);
                clearInterval(intervalId);
            }
        } else {
            if (current > to || previous === current) {
                scrollToDirection(element, direction, to);
                clearInterval(intervalId);
            }
        }

        previous = current;
    }, 1)
}

export const scrollByDirection = (element = HTMLElement, direction = '', amount = 0) => {
    scrollDirection(element, direction, amount, 'scrollBy');
}

export const scrollToDirection = (element = HTMLElement, direction = '', amount = 0) => {
    scrollDirection(element, direction, amount, 'scrollTo');
}

export const isElementInView = (element = HTMLElement) => {
    const elementTop = element.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight);
}

export const addEventListenerResize = (element = HTMLElement, cb = Function, delay = 0) => {
    let active = false;

    const resizeCb = () => {
        if (!active) {
            active = true;
            cb();

            setTimeout(() => {
                active = false;
            }, delay)
        }
    }

    const resizeObserver = new ResizeObserver(resizeCb);
    resizeObserver.observe(element);

    return resizeObserver;
}

export const removeEventListenerResize = (resizeObserver = new ResizeObserver, element = HTMLElement) => {
    resizeObserver.unobserve(element);
}

/*private methods*/
const scrollDirection = (element = HTMLElement, direction = '', amount = 0, scrollType = '') => {
    switch (direction) {
        case 'Y':
        case 'y':
            element[scrollType](0, amount);
            break;
        case 'X':
        case 'x':
            element[scrollType](amount, 0);
            break;
        default:
            element[scrollType](amount, amount);
            break;
    }
}

export const getUnpendedAttribute = (element, attributes = []) => {
    const attributesMap = {};

    document.body.appendChild(element);
    for (const attr of attributes) {
        attributesMap[attr] = element[attr];
    }
    document.body.removeChild(element);

    return attributesMap;
}

/**
 * @param element
 * @param beforeCb (elementClone, element)
 * 					callback to call, before appending cloned element;
 * 				   	return {any}- to change appended element;
 * 				   	return {undefined}- to not change the appended element;
 * 				   	return {null}- child will not be appended to the clone (including its children);
 *
 * @param afterCb (elementClone, element)
 * 					callback to call, after appending the cloned elements, parameters are: (elementClone, element);
 *
 * @param invalidCb (element)
 * 					callback to determine if child should be skipped;
 * 					return {~true~}- child will not be appended to the clone (including its children);
 * 					return {~false~}- child will be appended to the clone normally
 *
 * @returns {ActiveX.IXMLDOMNode | Node}
 */
export const deepClone = ({
    element = HTMLElement,
    beforeCb,
    afterCb,
    invalidCb
}) => {
    const clonedElement = element.cloneNode();
    document.body.appendChild(clonedElement); // appending for attributes calculations

    deepCloneHelper({
        element,
        clonedElement,
        beforeCb,
        afterCb,
        invalidCb
    });

    document.body.removeChild(clonedElement);
    return clonedElement;
}

const deepCloneHelper = ({
    element = HTMLElement,
    clonedElement = HTMLElement,
    beforeCb,
    afterCb,
    invalidCb
}) => {
    const children = element.children;

    for (let index = 0; index < children.length; index++) {
        //check child validation
        const child = children[index];
        const isInvalid = invalidCb?.(child);
        if (isInvalid) continue;

        //clone child
        let childClone = child.cloneNode();
        if (child.childNodes[0]?.nodeName === '#text')
            childClone.appendChild(child.childNodes[0].cloneNode());

        //beforeCb (before append)
        const cbRet = beforeCb?.(childClone, child);
        if (cbRet === null) continue;
        childClone = cbRet || childClone;

        //append clone
        clonedElement.appendChild(childClone);

        //afterCb (after append)
        afterCb?.(childClone, child);

        deepCloneHelper({
            element: child,
            clonedElement: childClone,
            beforeCb,
            afterCb,
            invalidCb
        });
    }
}

/**
 * use "textContent" attribute for the text of the element,
 * use "cloneNode()" before appending this node to a different element
 *
 * @param element
 * @returns {null|*}
 */
export const getTextNode = (element) => {
    const node = element.childNodes[0];
    if (node?.nodeName === '#text') {
        return node;
    }
    return null;
}

export const wrapMatches = (content = '', searchTerm = '', regexFlags = 'ig') => {
    // stopping function if search is not relevant   
    if (searchTerm === '') return content;

    const pattern = new RegExp(searchTerm, regexFlags);

    // dividing the matched letters and text
    const markedText = content.replace(pattern, (matchedLetters) =>
        `<span class="matching">${matchedLetters}</span>`
    );
    return `<span class="non-matching">${markedText}</span>`;
};
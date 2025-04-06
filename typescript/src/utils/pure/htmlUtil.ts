export const addDragScroll = (element: HTMLElement) => {
	const dragStart = (event: PointerEvent): void => {
		element.setPointerCapture(event.pointerId);
	};
	const dragEnd = (event: PointerEvent): void => {
		element.releasePointerCapture(event.pointerId);
	};
	const drag = (event: PointerEvent): void => {
		element.hasPointerCapture(event.pointerId) &&
			(element.scrollLeft -= event.movementX);
	};

	element.addEventListener('pointerdown', dragStart);
	element.addEventListener('pointerup', dragEnd);
	element.addEventListener('pointermove', drag);
};

export const hasOverflow = (element: HTMLElement): boolean => {
	return element.scrollWidth > element.clientWidth;
};

/**
 *  searches in the parent element for the child,
 *  and returns the closest element to the child
 *  with the specified class
 *
 * @param element
 * @param child
 * @param elementWithClassToFind
 */
export const findChildByClass = (
	element: Element,
	child: Element,
	elementWithClassToFind: string
): Element | null => {
	return findChildByClassHelper(element, child, elementWithClassToFind);
};

const findChildByClassHelper = (
	element: Element,
	child: Element,
	elementWithClassToFind: string,
	currentResult: Element | null = null
): Element | null => {
	for (const currentChild of Array.from(element.children)) {
		if (currentChild.classList.contains(elementWithClassToFind)) {
			currentResult = currentChild;
		}
		if (currentChild === child) {
			return currentResult;
		}

		// go over children
		if (currentChild.children) {
			const foundResult = findChildByClassHelper(
				currentChild,
				child,
				elementWithClassToFind,
				currentResult
			);
			if (foundResult) return foundResult;
		}
	}

	return null;
};

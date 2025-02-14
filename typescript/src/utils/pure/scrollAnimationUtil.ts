type ScrollDirection = 'x' | 'y' | 'both';

/**
 * @param element the element to scroll.
 * @param to scroll position destination.
 * @param direction direction of the scroll
 * @param ease ease of the animation, higher = slower.
 */
export const scrollToAnimation = (
	element: HTMLElement,
	to = 0,
	{ direction = 'both' as ScrollDirection, ease = 50 } = {}
) => {
	let current = element.scrollTop;
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

		scrollByDirection(element, direction, speed);

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
	}, 1);
};

const scrollByDirection = (
	element: HTMLElement,
	direction: ScrollDirection,
	amount: number
) => {
	scrollDirection(element, direction, amount, 'scrollBy');
};

const scrollToDirection = (
	element: HTMLElement,
	direction: ScrollDirection,
	amount: number
) => {
	scrollDirection(element, direction, amount, 'scrollTo');
};

const scrollDirection = (
	element: HTMLElement,
	direction: ScrollDirection,
	amount: number,
	scrollType: 'scrollTo' | 'scrollBy'
) => {
	switch (direction) {
		case 'y':
			element[scrollType](0, amount);
			break;
		case 'x':
			element[scrollType](amount, 0);
			break;
		default:
			element[scrollType](amount, amount);
			break;
	}
};

const isBetween = (num: number, min: number, max: number) => {
	return num >= min && num <= max;
};

import { isNull } from "./jsUtil.js";

export const arrIsEmpty = (arr = []) => arr.length === 0;

export const validateComparator = (comparator) => comparator ? comparator : () => 0;

export const isArr = (arr) => Array.isArray(arr);

export const forOfReverse = (arr, cb) => {
	for (let index = arr.length - 1; index > -1; index--) {
		cb(arr[index], index);
	}
}

export const forOfReverseBreak = (arr, cb) => {
	for (let index = arr.length - 1; index > -1; index--) {
		const toBreak = cb(arr[index], index);
		if (toBreak === true) break;
	}
}

export const arrFindIndex = (arr = [], element) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === element) return i;
	}
	return -1;
}

export const arrValidate = (arr) => Array.isArray(arr) ? arr : [arr];

export const arrValidateSafe = (arr) => {
	if (isNull(arr)) return [];
	return Array.isArray(arr) ? arr : [arr];
}

export const arrToStringDelimiter = (arr = [], delimiter = '') => {
	let str = '';
	for (let i = 0; i < arr.length - 1; i++) {
		str += `${arr[i]}${delimiter}`;
	}
	str += `${arr[arr.length - 1]}`;
	return str;
}

export const arrShallowCompare = (arr, otherArr) => {
	return arr.length !== otherArr.length
		&& arr.every((element, index) => element === otherArr[index]);
}

/**
 * shallow comparison, insures both arrays have at least 1 of each value between them
 *
 * @param arr
 * @param otherArr
 * @returns {boolean}
 */
export const arrUnorderedCompare = (arr = [], otherArr = []) => {
	return arr.length === otherArr.length
		&& arr.every((element) => otherArr.includes(element));
}

export const arrContainsNumber = (arr = []) => {
	for (let element of arr) {
		if (typeof element === 'number') return true;
	}
	return false;
}

export const arrWithoutIndex = (arr = [], index = 0) => {
	return arr.filter((value, arrIndex) => index !== arrIndex);
}

export const arrMutateWithoutIndex = (arr = [], index = 0) => {
	return arr.splice(index, 1);
}

export const arrFindLastIndexOfType = (arr = [], type = '') => {
	let lastIndex = -1;

	forOfReverseBreak(arr, (element, index) => {
		if (typeof element === type) {
			lastIndex = index;
			return true;
		}
	})

	return lastIndex;
}
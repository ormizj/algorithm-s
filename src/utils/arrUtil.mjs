import { isNull } from "./jsUtil.mjs";

export const arrShallowClone = (arr = []) => [...arr];

export const arrIsEmpty = (arr = []) => arr.length === 0;

export const arrRemoveIndex = (arr = [], index = 0, count = 1) => arr.splice(index, count);

export const validateComparator = (comparator) => comparator ? comparator : () => 0;

export const arrFindIndex = (arr = [], element) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === element) return i;
	}
	return -1;
}

export const arrRemove = (arr = [], element) => {
	const index = arrFindIndex(arr, element);
	arrRemoveIndex(arr, index);
}

export const arrValidate = (arr) => {
	if (isNull(arr)) return [];
	return Array.isArray(arr) ? arr : [arr]
}

export const arrToStringDelimiter = (arr = [], delimiter = '') => {
	let str = '';
	for (let i = 0; i < arr.length - 1; i++) {
		str += `${arr[i]}${delimiter}`;
	}
	str += `${arr[arr.length - 1]}`;
	return str;
}

export const arrCompare = (arr, otherArr) => {
	return arr.length !== otherArr.length
		&& arr.every((element, index) => element === otherArr[index]);
}

/**
 * shallow comparison, only insures both arrays have the same value, does not check duplications
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

export const arrToIndex = (arr = [], index = 0) => {
	const tempArr = [];
	for (let i = 0; i <= index; i++) {
		tempArr.push(arr[i]);
	}
	return tempArr;
}

export const arrFromIndex = (arr = [], index = 0) => {
	const tempArr = [];
	while (index < arr.length) {
		tempArr.push(arr[index]);
		index++;
	}
	return tempArr;
}

export const arrFindLastIndexOfType = (arr = [], type = '') => {
	let lastIndex = -1;
	arr.forEach((element, index) => {
		if (typeof element === type) lastIndex = index;
	})
	return lastIndex;
}
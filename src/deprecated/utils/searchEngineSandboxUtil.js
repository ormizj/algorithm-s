import {
	containsNumber,
	findLastIndexOfType,
	fromIndex,
	isEmpty, compare,
	removeIndex,
	shallowClone,
	toIndex,
	unorderedCompare,
	validateArr, forOf,
} from "./arrUtil.js";
import { isSubString, toString, toStringDelimiter } from "./stringUtil.js";
import { forIn, keyStructure, size } from "./objUtil.js";
import { getValueByPath, isNumber, valuePath } from "./jsUtil.js";

/**
 * see {searchEngineUtil.js} for TODO
 */
export class CacheSearch {
	/*an immutable array to search from*/
	#srcArr = [];
	/*values related to previous searches, e.g. list, searches*/
	#foundLists = {};
	/*list returned after the use of the "search" function, also used for sub-searching*/
	#returnedList = [];
	/*previous search words used in the "search" function*/
	#prevSearches = [];
	/*previous states used in the "search" functions*/
	#prevState = [];
	/*initial values of the subStates, used when resetting the CacheSearch*/
	#initialSubStates = [];
	/*current values of the subStates*/
	#subStates = [];
	/*path to reach the location of the list, where new items are inserted to*/
	#listPath = [];
	/*index of the list, which the item is located in (#listPath list, not #srcArr)*/
	#listItemIndex = -1;
	/*path to reach the item, from the list (not including index, #listPath list, not #srcArr)*/
	#itemPath = [];
	/*if the path to reach from the #srcArr to the "item" contains another array*/
	#isMultipleDimensions = false;
	/*comparator used for mutating the #foundLists, list*/
	#comparator = null;
	/*structure of the "item" inside the list, to determine if the "paths" needs recalculation*/
	#itemStructure = [];
	/*should the CacheSearch calculate the paths*/
	#isAutoPath = true;
	/*should the CacheSearch handle the #srcArr*/
	#handleSrcArr = null;/*true (1 dimension array) / function (multiple dimension array)*/
	/*instance of items in the #srcArr that are on the path, to reach the "item" in the list*/
	#arrItems = [];
	#isDynamicArrLength = false;

	/**
	 * @param {[*]} srcArr array to filter results from
	 *
	 * @param {[boolean]} subStates if the search contains state, which are subSearch, subState index corresponds with the "state" index
	 * 		  {true/false= first state toggle will/not be a sub-search}, {null= state change, will not have a subSearch}
	 * 		  e.g. state=[true,true,false] | subStates=[true,false,null] | i1= initial subSearch, i2= subSearch on toggle, i3= never subSearch
	 *
	 * @param {Function} comparator function for adding and inserting items into the CacheSearch,
	 * 					 also sets the comparator for the "CacheSearch"
	 *
	 * @param {Function | true} handleSrcArr whether to handle the "srcArr" when changing existing search results,
	 * 		                    "true" if the "srcArr" is a single dimension array,
	 * 		                    Function if the "srcArr" is multidimensional array (#insertSrcArr for more info),
	 * 		                    the function will be called when calling the "addSearchResult" function
	 *
	 * @param {boolean} isAutoPath should the "CacheSearch" automatically set the "valuePath" and "listPath" attributes
	 *
	 * @see setComparator
	 * @see search
	 */
	constructor({
		srcArr = [],
		subStates = [],
		comparator = null,
		handleSrcArr = null,
		isAutoPath = true
	} = {}) {
		this.#srcArr = srcArr;
		this.#isAutoPath = isAutoPath;
		this.#handleSrcArr = handleSrcArr;
		this.#comparator = comparator;
		this.#initialSubStates = shallowClone(subStates);
		this.#subStates = shallowClone(subStates);
	}

	//OM doesn't work with variable multi-dimensional #srcArr length
	/**
	 * if possible should send empty "state" when no state is active (to avoid unnecessary filtering)
	 *
	 * @param {[string]} searches array of text search
	 * @param state optional array of different state for searching (e.g. a button press, will change list),
	 * 				 "state" array cannot mutate, unless ALL the "state" values are unique,
	 * 				 "state" should be empty, if "searches" is empty (not mandatory)
	 *
	 * @param {function([])} filter callback function
	 * @returns {[*]} filtered array
	 */
	search({
		searches,
		state = [],
	} = {}, filter) {
		//converting values to array, if needed
		searches = validateArr(searches);
		state = validateArr(state);

		//if searches are empty, and there are no state, don't filter
		if ((this.#isSearchesEmpty(searches) && isEmpty(state)) || isEmpty(this.#srcArr)) return this.#srcArr;

		const foundListsKey = this.#createFoundListKey(searches, state);

		if (this.#foundLists[foundListsKey]) { //return existing search
			console.log('existing search', 111);
			this.#returnedList = this.#foundLists[foundListsKey].list;

		} else {
			//get list to use the filter on
			const filterList = this.#getFilterList(searches, state)
			this.#returnedList = filter(filterList);

			//checking if the filtered array has dynamic length (needed for multi-dimensional arrays)
			if (this.#srcArr.length !== this.#returnedList.length) this.#isDynamicArrLength = true;

			//adding filtered list to foundLists
			this.#foundLists[foundListsKey] = {
				list: this.#returnedList,
				searches,
				state
			};
		}

		//updating attributes, and returning list
		this.#prevState = state;
		this.#prevSearches = searches;
		return this.#returnedList;
	}

	/**
	 * resets the attributes in the "CacheSearch"
	 *
	 * @param subStates optional, reset subStates, to its initial value
	 * @see resetSubStates
	 */
	reset({ subStates = false } = {}) {
		this.#foundLists = {};
		this.#prevSearches = [];
		this.#prevState = [];
		this.#isDynamicArrLength = false;
		if (subStates) this.resetSubStates();
	}

	/** reset subStates, to its initial value */
	resetSubStates() {
		this.#subStates = this.#initialSubStates;
	}

	/** does not affect #initialSubStates */
	setSubStates(subStates) {
		this.#subStates = subStates;
	}

	/**
	 * sets the path of the "CacheSearch" with an item that exists within the "#srcArr"
	 *
	 * @param item that exists within the "#srcArr"
	 * @returns {boolean} true, if the item was found, and the #valuePath was set successfully,
	 * 			false if item was not found, and #valuePath did not change
	 *
	 * @see #setItemPathByItem
	 */
	setItemPathByItem = (item) => {
		this.#itemStructure = keyStructure(item);
		this.#setItemPathByItem(item);
	}

	#setItemPathByItem(value) {
		let path = null;
		const srcArr = this.#srcArr;

		for (let i = 0; i < srcArr.length; i++) {
			path = valuePath(srcArr[i], value);

			//if item not found
			if (!path) continue;

			this.#setPaths(path, i);
			return true;
		}

		return false;
	}

	/**
	 * sets the #itemPath, #listPath and #listItemIndex
	 *
	 * @param {[string]} path representing the keys needed to reach from the #srcArr to the desired value,
	 * 					 e.g. [{key1:{value: 'value1', key2:{value: 'value2'}}}, null]
	 * 					 if the desired value is "value2", the path should be: [0, 'key1', 'key2', 'value']
	 * 					 when the path refers to the index of the item in the list, any numeric value is valid
	 * 					 path should always start with a numeric value
	 *
	 * @param value that the path will reach (only needs to be structurally correct,
	 * 				the "value" doesn't need to exist within the #srcArr
	 *
	 * @see #setItemPathByItem
	 */
	setItemPath(path, value = {}) {
		this.#itemStructure = keyStructure(value);
		const index = path.shift();

		this.#setPaths(path, index);
	}

	/**
	 * @param {Function} comparator used when inserting new items, can be set to a non-true value to not use a comparator
	 */
	setComparator(comparator) {
		this.#comparator = comparator;
	}

	setSrcArr(srcArr) {
		this.#srcArr = srcArr;
	}

	/**
	 * whether to handle the srcArr when mutating the #foundLists
	 *
	 * @param {Function} handleSrcArr
	 * @see #insertSrcArr
	 */
	setHandleSrcArr(handleSrcArr) {
		this.#handleSrcArr = handleSrcArr;
	}

	/**@returns {number} amount of searches currently inside the "foundLists"*/
	searchCount = () => size(this.#foundLists);

	/**
	 * adds a new item into the existing searches, if "CacheSearch" paths don't exist,
	 * add the item to "srcArr" before calling this function
	 *
	 * @param {*} item the item to add to the existing searches
	 * @param {[string]} searchConditions the strings that the "searches" should look in the item
	 * @param {[[*]]} states optional the states which the items should be added to,
	 * 				  if states is empty, pushes the item to every state
	 */
	addSearchResult({
		item,
		searchConditions,
		states = [],
	}) {
		if (this.#handleSrcArr) this.#insertSrcArr(item);
		if (!this.#validateItemPath(item, 'addSearchResult')) return;

		searchConditions = validateArr(searchConditions);

		forIn(this.#foundLists, (foundListObj) => {
			//OM check for item path, if srcArr is multi-dimensional, and changes in size (function)
			const foundListSearches = foundListObj.searches;

			//if the foundListSearches, is eligible to find the item
			if (!this.#isConditionFound(foundListSearches, searchConditions)) return;

			if (this.#isMultipleDimensions && this.#isDynamicArrLength) {
				if (!this.#setDynamicIndex(foundListObj.list)) {
					foundListObj.list.push()
				}
			}

			this.#addSearchResult({
				item,
				states,
				foundListObj
			});
		});
	}

	/**
	 * updates an existing item in the searches
	 *
	 * @param {*} item the item to add to the existing searches
	 * @param {[string]} searchConditions the strings that the "searches" should look in the item
	 * @param {[[*]]} states optional the states which the items should be added to,
	 * 				  if states is empty, pushes the item to every state
	 */
	updateSearchResult({
		item,
		searchConditions,
		states = [],
	}) {
		if (!this.#validateItemPath(item, 'updateSearchResult')) return;
		if (this.#handleSrcArr) this.#updateSrcArr(item);

		searchConditions = validateArr(searchConditions);

		forIn(this.#foundLists, (foundListObj) => {
			//OM check for item path, if srcArr is multi-dimensional, and changes in size (function)
			const foundList = getValueByPath(foundListObj.list, this.#listPath);
			let itemIndex = -1;

			//finding the item location in the list
			for (let i = 0; i < foundList.length; i++) {
				const value = getValueByPath(foundList[i], this.#itemPath);

				if (value === item) {
					itemIndex = i;
					break;
				}
			}

			const foundListSearches = foundListObj.searches;
			const isRelatedToList = this.#isConditionFound(foundListSearches, searchConditions);

			//if item should be in the list
			if (isRelatedToList) {
				//if item is already in the list, remove it (in-case of "state" change, and to sort the item)
				if (itemIndex > -1) {
					removeIndex(foundList, itemIndex);
				}

				//add to list
				this.#addSearchResult({
					item,
					states,
					foundListObj
				});

				//else if item should not be in the list, but is currently in the list
			} else if (itemIndex > -1) {
				//delete from list
				removeIndex(foundList, itemIndex);
			}
		});
	}

	/**
	 * deletes an item from the existing searches, if "CacheSearch" paths don't exist,
	 * call this function before removing the item from the "srcArr"
	 *
	 * @param item
	 * @see #setItemPathByItem
	 */
	deleteSearchResult(item) {
		if (!this.#validateItemPath(item, 'deleteSearchResult')) return;

		forIn(this.#foundLists, (foundListObj) => {
			//OM check for item path, if srcArr is multi-dimensional, and changes in size (function)
			this.#deleteSearchResult(item, foundListObj);
		});

		if (this.#handleSrcArr) this.#deleteSrcArr();
	}

	#setPaths(path, initialIndex) {
		let index = -1;
		this.#listPath = [];

		// if path contains numbers, then the "srcArr" is multidimensional
		this.#isMultipleDimensions = containsNumber(path);
		if (this.#isMultipleDimensions) {
			//if the length of the list is dynamic, find the items, for later searches
			if (this.#isDynamicArrLength) this.#setArrItems(path, initialIndex);

			path.unshift(initialIndex);
			// creating a path to reach the location of the most nested array
			index = findLastIndexOfType(path, 'number');
			this.#listItemIndex = index;
			this.#listPath = toIndex(path, index - 1);
		} else {
			this.#listItemIndex = initialIndex;
		}

		this.#itemPath = fromIndex(path, index + 1);
	}

	#setArrItems(path, index) {
		const currentPath = [index];
		this.#arrItems.push(this.#srcArr[index]);

		forOf(path, (route) => {
			currentPath.push(route);

			if (isNumber(route)) {
				const item = getValueByPath(this.#srcArr, currentPath);
				this.#arrItems.push(item);
			}
		});

		// //removing the "item" from the list (not needed)
		// this.#arrItems.pop();
	}

	/**
	 * @returns {boolean} true if searchConditions are found
	 * @see addSearchResult
	 */
	#addSearchResult({
		item,
		states,
		foundListObj
	}) {
		const foundList = getValueByPath(foundListObj.list, this.#listPath);
		const foundListState = foundListObj.state;

		//if states is empty add item to all search states
		if (isEmpty(states)) {
			this.#pushItem(foundList, item);

		} else {
			//if states exist
			for (let state of states) {
				//find the matching state, and add the item to it
				if (toString(state) === toString(foundListState)) {
					this.#pushItem(foundList, item);
					break;
				}
			}
		}

		return true;
	}

	#setDynamicIndex(foundList) {
		let isItemFound = false;

		for (let i = 0; i < foundList.length; i++) {
			let j = 0;
			let path;

			do {
				path = valuePath(foundList[i], this.#arrItems[j])
				j++;

				if (j < this.#arrItems) {


					isItemFound = true;
					break;
				}
			} while (path)

			if (isItemFound) break;
		}

		return isItemFound;
	}

	#updateSrcArr(item) {
		const list = this.#deleteSrcArr();
		this.#pushItem(list, item);
	}

	#insertSrcArr(item) {
		if (Array.isArray(this.#handleSrcArr)) {

			this.#srcArr.forEach((element, index) => {
				// noinspection JSValidateTypes
				this.#handleSrcArr({
					element,
					index,
					item,
					comparator: this.#comparator
				});
			});

		} else {
			this.#pushItem(this.#srcArr, item);
		}
	}

	#pushItem(list, item) {
		if (this.#comparator) {
			list.pushSorted(item, this.#comparator);
		} else {
			list.push(item);
		}
	}

	/**
	 * @returns {boolean} true, if item was found in the "foundListObj"
	 * @see deleteSearchResult
	 */
	#deleteSearchResult(item, foundListObj) {
		const foundList = getValueByPath(foundListObj.list, this.#listPath);

		for (let i = 0; i < foundList.length; i++) {
			const value = getValueByPath(foundList[i], this.#itemPath);

			if (value === item) {
				removeIndex(foundList, i);
				return true;
			}
		}
		return false;
	}

	#deleteSrcArr() {
		const list = getValueByPath(this.#srcArr, this.#listPath);
		removeIndex(list, this.#listItemIndex);
		return list;
	}

	#getFilterList(searches = [''], state = []) {
		//if "state" is subSearch
		if (this.#isStateSubSearch(state, this.#prevState, this.#subStates)) {

			//if prevSearch sub
			if (this.#isSearchesSub(searches, this.#prevSearches) && this.#prevSearchExists(this.#prevSearches)) { //filter subsequent search
				console.log('prev sub search', 222);
				return this.#returnedList;
			}

			const foundListsSub = this.#getFoundListsSub(searches, state, this.#foundLists);

			//if sub from foundLists
			if (foundListsSub) {//filter found subsequent search;
				console.log('existing sub search', 444);
				return foundListsSub;
			}
		}

		console.log('new search', 333);
		return this.#srcArr;
	}

	#validateItemPath = (item, functionName = 'Operation') => {
		// #listItemIndex is not required for inserting new items
		const isItemIndexReq = functionName !== 'addSearchResult';
		// is #listPath and #itemPath valid
		const isPathValid = !this.#isNewItemStructure(item) && !this.#isMultipleDimensions;

		// if no new path or index is needed, or auto path disabled, return true
		if (!isItemIndexReq && isPathValid || !this.#isAutoPath) return true;

		let valid;

		// if path is not valid, calculate paths and index
		if (!isPathValid) valid = this.#setItemPathByItem(item);
		// else calculate only index
		else valid = this.#setListItemIndex(item);

		if (valid) return true;

		console.error(`${functionName} failed, no value path was found.`);
		return false;
	}

	#setListItemIndex(item) {
		const list = getValueByPath(this.#srcArr, this.#listPath);

		for (let i = 0; i < list.length; i++) {
			if (item === list[i]) {
				this.#listItemIndex = i;
				return true;
			}
		}

		return false;
	}

	#isConditionFound = (searches, conditions) => {
		for (let condition of conditions) {
			let found = true;
			for (let search of searches) {
				if (!isSubString(condition, search)) {
					found = false;
					break;
				}
			}
			if (found) return true;
		}
		return false;
	}

	#isNewItemStructure = (item = {}) => {
		const newItemStructure = keyStructure(item);

		const isNew = !unorderedCompare(this.#itemStructure, newItemStructure);
		this.#itemStructure = newItemStructure;

		return isNew;
	}

	#getFoundListsSub(searches = [''], state, foundLists = []) {
		let shortestList = null;

		for (let foundListKey in foundLists) {
			if (!foundLists.hasOwnProperty(foundListKey)) continue;
			const foundList = foundLists[foundListKey];

			//if sub string, state match and shorter list
			if (this.#isSearchesSub(searches, foundList.searches)
				&& compare(state, foundList.state)
				&& (!shortestList || foundList.list.length < shortestList.length)) {
				shortestList = foundList.list;
			}
		}

		return shortestList;
	}


	#isStateSubSearch(state = [], prevStates = [], subStates = []) {
		for (let i = 0; i < state.length; i++) {
			//if state didn't change, continue
			if (!(state[i] !== prevStates[i] && prevStates[i] !== undefined)) continue;
			const subState = subStates[i];

			//if subState is not null, toggle subStates
			if (subState === false || subState) subStates[i] = !subStates[i];
			//if subState is not subSearch, return false
			if (!subState) return false;
			//if SubState is currently a subSearch, convert it to false
			if (subState) subStates[i] = false;
		}
		return true;
	}

	#isSearchesEmpty(searches = ['']) {
		for (let search of searches)
			if (search !== '') return false;
		return true;
	}

	#isSearchesSub(searches = [''], prevSearches = ['']) {
		for (let i = 0; i < searches.length; i++)
			if (!isSubString(searches[i], prevSearches[i])) return false;
		return true;
	}

	#prevSearchExists(prevSearches = ['']) {
		for (let prevSearch of prevSearches)
			if ('' !== prevSearch) return true;
		return false;
	}

	#createFoundListKey = (searches, state) => toStringDelimiter(',', searches, state);
}

export const markFirst = (text = '', search = '') => {
	//stopping function if search is not relevant
	if (isInvalidSearch(text, search)) return text;

	//slicing text to 3 segments
	const startIndex = text.indexOf(search);
	const endIndex = startIndex + search.length;
	const startStr = text.slice(0, startIndex);
	const endStr = text.slice(endIndex);

	//splicing the segments into 1 element, with the matched letters in its own element
	return `<span class="divided-text"><!--
				-->${startStr}<span class="matched-letters">${search}</span>${endStr}<!--
			--></span>`
}

export const markAll = (text = '', search = '') => {
	//stopping function if search is not relevant
	if (isInvalidSearch(text, search)) return text;

	//g = find all matches
	const checkLetters = new RegExp(search, "g");

	//dividing the matched letters and text
	const dividedText = text.replace(checkLetters, matchedLetters => {
		return ('<span class="matched-letters">' + matchedLetters + '</span>');
	});

	return `<span class="divided-text">${dividedText}</span>`
}

export const isInvalidSearch = (text = '', search = '') => !text.includes(search) || search === '';
import {
	arrContainsNumber,
	arrFindLastIndexOfType,
	arrFromIndex,
	arrIsEmpty, arrCompare,
	arrRemoveIndex,
	arrShallowClone,
	arrToIndex,
	arrUnorderedCompare,
	arrValidate,
} from "./arrayUtil.js";
import { strIsSubString, toString, toStringDelimiter } from "./stringUtil.js";
import { objForIn, objSize } from "./objectUtil.js";
import { getValueByPath, valuePath } from "./jsUtil.js";

/**
 * sub-item = item in the path of the "Searched" item
 *
 * TODO CacheSearch (Multi-dimensional full support):
 * CacheSearch currently does not fully support multi-dimensional objects,
 * (when an item is added to the list, sub-items may not be currently in the list, and need to be added)
 *
 * currently there is an array, which saves all the sub-items which are needed for the "Searched" item, but in order to
 * make fully multi-dimensional support, the sub-items which are in the path for the "Searched" item, need to be inserted
 * to the "CacheSearch"-"foundLists" object (see "sandbox" util).
 *
 * Steps left:
 * 1.add an array for the paths of every sub-item
 * 2.add inserting/updating/removing for sub-item into the "foundLists"
 * 3.add an array, ~itemComparatorArray~ to enable pushSort of new items, to the "foundLists" (the items which are not directly searched for),
 *   array will contain comparators, based on the index of the sub-item
 *   e.g. sub-item list: [sub-item1, sub-item2], comparator list:[comparator sub-item1, comparator sub-item2]
 *
 * Bonus:
 * 1. function that will return the list of the latest found sub-items
 * 2. option to place comparators (~itemComparatorArray~) into an object, and will be in the structure: {<name>: <comparator>
 *      																								         <itemStructure> }
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
		this.#initialSubStates = arrShallowClone(subStates);
		this.#subStates = arrShallowClone(subStates);
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
		searches = arrValidate(searches);
		state = arrValidate(state);

		//if searches are empty, and there are no state, don't filter
		if ((this.#isSearchesEmpty(searches) && arrIsEmpty(state)) || arrIsEmpty(this.#srcArr)) return this.#srcArr;

		const foundListsKey = this.#createFoundListKey(searches, state);

		if (this.#foundLists[foundListsKey]) { //return existing search
			console.log('existing search', 111);
			this.#returnedList = this.#foundLists[foundListsKey].list;

		} else {
			//get list to use the filter on
			const filterList = this.#getFilterList(searches, state)
			this.#returnedList = filter(filterList);

			//present at "sandbox" branch
			//OM add length check between "this.#returnedList" and this.#srcArr, to determine if multi-dimensional arrays paths need to be rechecked every time

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
	 * @returns {boolean} "true", if the item was found, and the #valuePath was set successfully,
	 * 			"false" if item was not found, and #valuePath did not change
	 *
	 * @see #setItemPathByItem
	 */
	setItemPathByItem = (item) => {
		this.#itemStructure = Object.keys(item);
		this.#setItemPathByItem(item);
	}

	/**
	 * @param value
	 * @returns {boolean}
	 * @see setItemPathByItem
	 */
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
		this.#itemStructure = Object.keys(value);
		const index = path.shift();

		this.#setPaths(path, index);
	}

	/** @param {Function} comparator used when inserting new items, can be set to a non-true value to not use a comparator */
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
	searchCount = () => objSize(this.#foundLists);

	/**
	 * adds a new item into the existing searches, if "CacheSearch" paths don't exist,
	 * add the item to "srcArr" (externally) before calling this function
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

		searchConditions = arrValidate(searchConditions);

		objForIn(this.#foundLists, (foundListObj) => {
			//OM check for item path, if srcArr is multi-dimensional, and changes in size (function)
			const foundListSearches = foundListObj.searches;

			//if the foundListSearches, is eligible to find the item
			if (!this.#isConditionFound(foundListSearches, searchConditions)) return;

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

		searchConditions = arrValidate(searchConditions);

		objForIn(this.#foundLists, (foundListObj) => {
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
			//check if the item should be in the list
			const isRelatedToList = this.#isConditionFound(foundListSearches, searchConditions);

			//if item should be in the list
			if (isRelatedToList) {
				//if item is already in the list, remove it (in-case of "state" change, and to sort the item)
				if (itemIndex > -1) {
					arrRemoveIndex(foundList, itemIndex);
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
				arrRemoveIndex(foundList, itemIndex);
			}
		});
	}

	/**
	 * deletes an item from the existing searches, if "CacheSearch" paths don't exist,
	 * call this function before removing the item from the "srcArr" (externally)
	 *
	 * @param item
	 * @see #setItemPathByItem
	 */
	deleteSearchResult(item) {
		if (!this.#validateItemPath(item, 'deleteSearchResult')) return;

		objForIn(this.#foundLists, (foundListObj) => {
			//OM check for item path, if srcArr is multi-dimensional, and changes in size (function)
			this.#deleteSearchResult(item, foundListObj);
		});

		if (this.#handleSrcArr) this.#deleteSrcArr();
	}

	/**
	 * sets the paths of the CacheSearch
	 *
	 * @param path to reach the searched item
	 * @param initialIndex of the first item (related to the path)
	 */
	#setPaths(path, initialIndex) {
		let index = -1;
		this.#listPath = [];

		// if path contains numbers, then the "srcArr" is multidimensional
		this.#isMultipleDimensions = arrContainsNumber(path);
		if (this.#isMultipleDimensions) {
			// creating a path to reach the location of the most nested array
			path.unshift(initialIndex);
			index = arrFindLastIndexOfType(path, 'number');
			this.#listItemIndex = index;
			this.#listPath = arrToIndex(path, index - 1);
		} else {
			this.#listItemIndex = initialIndex;
		}

		this.#itemPath = arrFromIndex(path, index + 1);
	}

	/**
	 * @returns {boolean} "true" if item was added to the "foundListObj",
	 * 					  "false" is not
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
		if (arrIsEmpty(states)) {
			this.#pushItem(foundList, item);
			return true;

		} else {
			//if states exist
			for (let state of states) {
				//find the matching state, and add the item to it
				if (toString(state) === toString(foundListState)) {
					this.#pushItem(foundList, item);
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * updates "srcArr" existing item
	 *
	 * @param item
	 */
	#updateSrcArr(item) {
		const list = this.#deleteSrcArr();
		this.#pushItem(list, item);
	}

	/**
	 * adds a new item to "srcArr"
	 *
	 * @param item
	 */
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

	/**
	 * inserts an item to the list, based on the "comparator"
	 *
	 * @param {[*]} list
	 * @param {*} item
	 */
	#pushItem(list, item) {
		if (this.#comparator) {
			list.pushSorted(item, this.#comparator);
		} else {
			list.push(item);
		}
	}

	/**
	 * @returns {boolean} "true", if item was removed from the "foundListObj"
	 * @see deleteSearchResult
	 */
	#deleteSearchResult(item, foundListObj) {
		const foundList = getValueByPath(foundListObj.list, this.#listPath);

		for (let i = 0; i < foundList.length; i++) {
			const value = getValueByPath(foundList[i], this.#itemPath);

			if (value === item) {
				arrRemoveIndex(foundList, i);
				return true;
			}
		}
		return false;
	}

	/**
	 * deletes an item from "srcArr" (the deleted item, will be the item found from "validateItemPath")
	 *
	 * @returns {[*]} the list where the item is located in
	 * @see #validateItemPath
	 */
	#deleteSrcArr() {
		const list = getValueByPath(this.#srcArr, this.#listPath);
		arrRemoveIndex(list, this.#listItemIndex);
		return list;
	}

	/**
	 * @param searches
	 * @param state
	 * @returns {[*]} the smallest list, without omitting items that can be found by the searches
	 * @see search
	 */
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

	/**
	 * sets the paths objects of the "CacheSearch"
	 *
	 * @param item
	 * @param functionName
	 * @returns {boolean} "true" if paths were set successfully
	 * 					  "false" if paths couldn't be set (with a stack-trace message)
	 */
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

		console.trace(`${functionName} failed, no value path was found.`);
		return false;
	}

	/**
	 * sets only the "listItemIndex" path, instead of all paths
	 *
	 * @param item
	 * @returns {boolean} "true" if item was found, and index was set
	 * 					  "false" if not
	 * @see #setItemPathByItem
	 */
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

	/**
	 * @param searches
	 * @param conditions the strings that the "searches" should look in the item
	 * @returns {boolean} "true" if at-least one of the searches, is eligible to find at-least one condition
	 * 					  "false" if not
	 */
	#isConditionFound = (searches, conditions) => {
		for (let condition of conditions) {
			let found = true;

			for (let search of searches) {
				if (!strIsSubString(condition, search)) {
					found = false;
					break;
				}
			}

			if (found) return true;
		}
		return false;
	}

	/**
	 * compares the structure of the previous item ("itemStructure"), and the current item structure ("item")
	 *
	 * @param item
	 * @returns {boolean} "true" if the structures match (unordered)
	 * 					  "false" if not
	 */
	#isNewItemStructure = (item = {}) => {
		const newItemStructure = Object.keys(item);

		const isNew = !arrUnorderedCompare(this.#itemStructure, newItemStructure);
		this.#itemStructure = newItemStructure;

		return isNew;
	}

	/**
	 * finds the shortest list which is sub-search (based on "searches") and returns it
	 *
	 * @param searches
	 * @param state
	 * @param foundLists
	 * @returns {null|[*]} the shortest list present at "foundLists",
	 * 					   "null" if no list was found
	 */
	#getFoundListsSub(searches = [''], state, foundLists = []) {
		let shortestList = null;

		for (let foundListKey in foundLists) {
			if (!Object.hasOwn(foundLists, foundListKey)) continue;
			const foundList = foundLists[foundListKey];

			//if sub string, state match and shorter list
			if (this.#isSearchesSub(searches, foundList.searches)
				&& arrCompare(state, foundList.state)
				&& (!shortestList || foundList.list.length < shortestList.length)) {
				shortestList = foundList.list;
			}
		}

		return shortestList;
	}


	/**
	 * checks the states, to see if a "subSearch" is possible
	 *
	 * @param state current state to check
	 * @param prevStates
	 * @param subStates
	 * @returns {boolean} "true" if "subSearch" is possible,
	 * 					  "false" if not
	 */
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

	/**
	 * @param searches
	 * @returns {boolean} "true" if all searches are empty
	 * 					  "false" if at-least one search isn't empty
	 */
	#isSearchesEmpty(searches = ['']) {
		for (let search of searches)
			if (search !== '') return false;
		return true;
	}

	/**
	 * @param searches
	 * @param prevSearches
	 * @returns {boolean} "true" all "searches" are a substring of "prevSearches"
	 * 					  "false" at-least one of the "searches" isn't a sub-search
	 * 					  (2 searches for the same item)
	 */
	#isSearchesSub(searches = [''], prevSearches = ['']) {
		for (let i = 0; i < searches.length; i++)
			if (!strIsSubString(searches[i], prevSearches[i])) return false;
		return true;
	}

	/**
	 *
	 * @param prevSearches
	 * @returns {boolean} "true" if at-least one "prevSearch" is not an empty String
	 * 					  "false" if all "prevSearch" are empty Strings
	 */
	#prevSearchExists(prevSearches = ['']) {
		for (let prevSearch of prevSearches)
			if ('' !== prevSearch) return true;
		return false;
	}

	/**
	 * @param searches
	 * @param state
	 * @returns the key for a found list, combining the searches and state
	 */
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
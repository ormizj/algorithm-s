import { vTypeOf } from "./jsUtil.js";
import { objForIn } from "./objUtil.js";

/**
 * Example:
 * obj= {id:'a12345', anotherObj: key1:value1, key2:value2}
 * dummyData = (obj, {
 *     amount: 3,
 *     lang:'he',
 *
 *     optionsKeys:{
 *         id:{
 *             type:'',
 *             randRange: false
 *         }
 *     }
 * })
 *
 * @param obj
 * @param options	contains general options for all the keys in the object;
 * 					contains "optionsKeys" for key specific options in the object
 * @returns {*[]}
 */
export const buildDummyData = (obj = {}, options = {
	amount: 1,
	lang: '',
	randRange: true, // random range is from: base/2 - base*2

	optionsKeys: {
		'$key': {
			type: '',
			lang: '',
			cntLetters: [0],
			randRange: true,
		}
	}
}) => {
	const dupeData = [];

	let amount = options.amount ?? 1;
	while (amount-- !== 0) {
		dupeData.push(buildDummyDataHelper(obj, {}, options));
	}

	return dupeData;
}

const buildDummyDataHelper = (obj, dupeObj, options) => {
	objForIn(obj, (value, key) => {
		const type = vTypeOf(value);

		//nested values
		if (type === 'object') {
			dupeObj[key] = {};
			buildDummyDataHelper(obj[key], dupeObj[key], options);

			//nested values
		} else if (type === 'array') {
			dupeObj[key] = [];
			buildDummyDataHelper(obj[key], dupeObj[key], options);

			//custom values & generic values
		} else {
			dupeObj[key] = handleCustomKey({
				value,
				type,
				options,
				optionsKey: options.optionsKeys?.[key]
			});
		}
	});

	return dupeObj;
};


const genRandData = ({
	type = '',
	cntLetters = [],
	lang,
	randRange = true
}) => {
	let randFunction;
	let randData;
	switch (type) {
		case 'string':
			randFunction = randStr;
			randData = ``;
			break;

		case 'number':
			if (cntLetters.length > 1) console.error(`the type: "${type}", "words" must be exactly 1`)
			randFunction = randNum;
			randData = 0;
			break;

		default:
			console.error(`the type: "${type}", is not supported`);
			break;
	}

	for (let i = 0; i < cntLetters.length; i++) {
		let newCnt = cntLetters[i];

		if (randRange) {
			newCnt = getRandomIntInclusive(newCnt / 2, newCnt * 2);
		}

		if (i < cntLetters.length - 1) {
			randData += `${randFunction(newCnt, lang)} `;
		} else {
			randData += randFunction(newCnt, lang);
		}

	}

	return randData;
};

const handleCustomKey = ({
	value,
	type,
	options,
	optionsKey = {}
}) => {
	const lang = optionsKey.lang ?? options.lang;
	type = optionsKey.type ?? type;

	let cntLetters;
	if (!optionsKey.cntLetters) {
		const words = `${value}`.split(' ');

		cntLetters = [];
		for (const word of words) {
			cntLetters.push(word.length);
		}

	} else {
		cntLetters = optionsKey.cntLetters;
	}

	let randRange;
	if (optionsKey.randRange !== undefined) {
		randRange = optionsKey.randRange;
	} else if (options.randRange !== undefined) {
		randRange = options.randRange;
	}

	return genRandData({
		type,
		cntLetters,
		lang,
		randRange
	});
};

export const randStr = (length, lang) => {
	let result = '';

	let characters;
	switch (lang) {
		case 'en':
			// noinspection SpellCheckingInspection
			characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;
			break;

		case 'he':
			characters = `אבגדהוזחטיכלמנסעפצקרשת`;
			break;

		default:
			// noinspection SpellCheckingInspection
			characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
			break;
	}

	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};

export const randNum = (length) => {
	if (length === 0) return 0;

	//characters without "0"
	let characters = '123456789';
	let charactersLength = characters.length;

	//excluding "0" from first iteration
	let result = characters.charAt(Math.floor(Math.random() * charactersLength));

	//adding "0";
	characters += '0';
	charactersLength++;
	for (let i = 0; i < length - 1; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return Number(result);
};

const getRandomIntInclusive = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}


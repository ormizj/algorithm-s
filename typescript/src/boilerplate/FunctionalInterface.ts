// interface example
export interface FunctionalInterface {
	undefinedAttribute: undefined;
	objectAttribute: object;
	booleanAttribute: boolean;
	numberAttribute: number;
	bigintAttribute: bigint;
	stringAttribute: string;
	symbolAttribute: Symbol;
	functionAttribute: Function;
}
// mapping interface attributes into javascript types
const attributes: Record<keyof FunctionalInterface, TypeOf> = {
	undefinedAttribute: 'undefined',
	objectAttribute: 'object',
	booleanAttribute: 'boolean',
	numberAttribute: 'number',
	bigintAttribute: 'bigint',
	stringAttribute: 'string',
	symbolAttribute: 'symbol',
	functionAttribute: 'function',
};

export const instanceofComplexInterface = <T extends object>(
	complexClass: T
): complexClass is T & FunctionalInterface =>
	satisfiesPropertiesTypes(complexClass, attributes);

/* UTILITY FUNCTIONS */
const satisfiesPropertiesTypes = <T extends object>(
	obj: object,
	props: Record<ObjectKey, TypeOf>
): obj is T => {
	for (const propKey in props) {
		if (!Object.hasOwn(props, propKey)) continue;
		if (!(propKey in obj) || typeof obj[propKey] !== props[propKey])
			return false;
	}
	return true;
};
/* UTILITY FUNCTIONS */
/* UTILITY TYPES */
type ObjectKey = string | number | symbol;

type TypeOf =
	| 'undefined'
	| 'object'
	| 'boolean'
	| 'number'
	| 'bigint'
	| 'string'
	| 'symbol'
	| 'function';
/* UTILITY TYPES */

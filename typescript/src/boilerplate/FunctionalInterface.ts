// interface example
export interface FunctionalInterface {
	undefinedProperty: undefined;
	objectProperty: object;
	booleanProperty: boolean;
	numberProperty: number;
	bigintProperty: bigint;
	stringProperty: string;
	symbolProperty: Symbol;
	functionProperty: Function;
}
// mapping interface properties into javascript types
const properties: Record<keyof FunctionalInterface, TypeOf> = {
	undefinedProperty: 'undefined',
	objectProperty: 'object',
	booleanProperty: 'boolean',
	numberProperty: 'number',
	bigintProperty: 'bigint',
	stringProperty: 'string',
	symbolProperty: 'symbol',
	functionProperty: 'function',
};

export const instanceofFunctionalInterface = <T extends object>(
	complexClass: T
): complexClass is T & FunctionalInterface =>
	satisfiesPropertiesTypes(complexClass, properties);

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

instanceofFunctionalInterface(null);

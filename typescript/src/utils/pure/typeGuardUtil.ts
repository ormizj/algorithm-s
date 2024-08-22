export const satisfiesProperties = <T extends object>(
	obj: object,
	props: string[]
): obj is T => props.every((prop) => prop in obj);

export const satisfiesPropertiesTypes = <T extends object>(
	obj: object,
	props: Record<ObjectKey, TypeOf>
): obj is T => {
	for (const propKey in props) {
		if (!Object.hasOwn(props, propKey)) continue;
		if (!(propKey in obj) || typeof props[propKey] !== typeof obj[propKey])
			return false;
	}
	return true;
};

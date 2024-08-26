export const satisfiesProperties = <T extends object>(
	obj: object,
	props: string[]
): obj is T => props.every((prop) => prop in obj);

export const satisfiesPropertiesTypes = <T extends object>(
	obj: object,
	props: TypeMap<TypeOf>
): obj is T => {
	for (const propKey in props) {
		if (!Object.hasOwn(props, propKey)) continue;
		if (
			!(propKey in obj) ||
			typeof obj[propKey as keyof typeof obj] !== props[propKey]
		)
			return false;
	}
	return true;
};

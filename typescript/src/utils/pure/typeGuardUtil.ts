export const satisfiesProperties = <T extends object>(
	obj: object,
	props: string[]
): obj is T => props.every((prop) => prop in obj);

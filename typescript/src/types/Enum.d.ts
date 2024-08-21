type Enum<T extends object> = {
	[K in keyof T]: T[K];
};

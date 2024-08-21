type ObjectIdentity<T extends object> = {
	[K in keyof T]: T[K];
};

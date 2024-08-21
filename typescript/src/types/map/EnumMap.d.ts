type EnumMap<E extends object, T> = {
	-readonly [K in keyof E]: T;
};

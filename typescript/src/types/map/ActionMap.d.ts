interface ActionMap<T> {
	[K: string]: () => T;
}

interface ActionObject<T> {
	[K: string]: () => T;
}

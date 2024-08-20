interface ActionRecord<T> {
	[K: string]: () => T;
}

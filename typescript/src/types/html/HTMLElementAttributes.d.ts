type HTMLElementAttributes = {
	[K in HTMLElementType]: Partial<HTMLElementTagNameMap[K]>;
}[HTMLElementType];

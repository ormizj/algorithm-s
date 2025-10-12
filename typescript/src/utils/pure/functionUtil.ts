const getParamNames = (_function: () => unknown) => {
	const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
	const ARGUMENT_NAMES = /([^\s,]+)/g;

	const functionString = _function.toString().replace(STRIP_COMMENTS, '');
	const result: string[] | null = functionString
		.slice(functionString.indexOf('(') + 1, functionString.indexOf(')'))
		.match(ARGUMENT_NAMES);

	if (result === null) return [];
	return result;
};

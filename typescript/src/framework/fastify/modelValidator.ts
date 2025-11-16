import type { FastifyReply, FastifyRequest } from 'fastify';

export function entityExistsValidator<T extends { Body: unknown }>(
	entityName: string,
	existFn: (...args: unknown[]) => Promise<boolean>
) {
	return async (request: FastifyRequest<T>, reply: FastifyReply) => {
		const paramKeys = getParamNames(existFn);
		const paramValues = paramKeys.map((param) => request.body[param]);

		const exists = await existFn(...paramValues);
		if (!exists) {
			return reply.code(404).send({
				error: `${entityName} not found`,
				message: `${entityName} with ${recordFormatter(paramKeys, paramValues)} does not exist`,
			});
		}
	};
}

const recordFormatter = (paramKeys: string[], paramValues: string[]) => {
	const record = {};
	for (let i = 0; i < paramKeys.length; i++) {
		record[paramKeys[i]] = paramValues[i];
	}

	return Object.entries(record)
		.map(([key, value]) => `${key}: ${value}`)
		.join(', ');
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getParamNames = (_function: Function) => {
	const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
	const ARGUMENT_NAMES = /([^\s,]+)/g;

	const functionString = _function.toString().replace(STRIP_COMMENTS, '');
	const result: string[] | null = functionString
		.slice(functionString.indexOf('(') + 1, functionString.indexOf(')'))
		.match(ARGUMENT_NAMES);

	if (result === null) return [];
	return result;
};


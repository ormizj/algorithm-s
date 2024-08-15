/**
 * @param tryFn function to run, will ALWAYS run at least one time
 * @param tries
 * @param shouldRetryFn
 * @throws {Error}
 */
export const retryHandler = async <T>(
    tryFn: () => T | Promise<T>,
    tries: number,
    shouldRetryFn?: (error: Error) => boolean | Promise<boolean>
) => {
    do {
        try {
            return await tryFn();
        } catch (e) {
            const shouldRetry = shouldRetryFn
                ? await shouldRetryFn(e as Error)
                : true;
            if (!shouldRetry || tries <= 1) throw e;
        }
    } while (--tries > 0);

    throw new Error('retryHandlerHttp: Unexpected Error'); // supposedly unreachable code
};
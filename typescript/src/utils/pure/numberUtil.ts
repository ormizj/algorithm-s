export const toFixed = (
    number: number,
    decimals = 0,
    { base = 10, roundFn = 'round' as 'round' | 'floor' | 'ceil' } = {}
) => {
    const pow = Math.pow(base, decimals);
    return Math[roundFn](number * pow) / pow;
};

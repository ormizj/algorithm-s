export const toFixed = (
    number: number,
    decimals = 0,
    { base = 10, roundFn = 'round' as 'round' | 'floor' | 'ceil' } = {}
) => {
    const pow = Math.pow(base, decimals);
    return Math[roundFn](number * pow) / pow;
};

export const toFixedString = (
    number: Parameters<typeof toFixed>[0],
    decimals: Parameters<typeof toFixed>[1],
    { base, roundFn }: Parameters<typeof toFixed>[2] = {}
) => {
    return toFixed(number, decimals, { base, roundFn }).toFixed(decimals);
};
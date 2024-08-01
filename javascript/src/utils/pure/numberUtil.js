export const isNumber = (num) => typeof num === 'number';

export const toNumber = (num) => Number(num);

export const isBetween = (num = 0, min = 0, max = 0) => num >= min && num <= max;

export const toDigits = (num = 0) => {
    let digits = [];

    do {
        digits.push(num % 10);
        num = Math.trunc(num / 10);
    } while (num > 0)

    return digits;
}

export const toFixed = (number = 0, decimals = 0, { base = 10, roundFn = 'round' } = {}) => {
    const pow = Math.pow(base, decimals);
    return Math[roundFn](number * pow) / pow;
};

export const random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const numToDigits = (num = 0) => {
    let digits = [];

    do {
        digits.push(num % 10);
        num = Math.trunc(num / 10);
    } while (num > 0)

    return digits;
}

// "floor" rounds upward (if 0.5 turns to 1)
export const numToFixed = (num = 0, digit = 0, { base = 10, roundFunc = 'floor' } = {}) => {
    const pow = Math.pow(base, digit);
    return Math[roundFunc](num * pow) / pow;
};

export const numIsBetween = (num = 0, min = 0, max = 0) => num >= min && num <= max;
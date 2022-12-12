export const numToDigits = (num = 0) => {
    let digits = [];

    do {
        digits.push(num % 10);
        num = Math.trunc(num / 10);
    } while (num > 0)

    return digits;
}
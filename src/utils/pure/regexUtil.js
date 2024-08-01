/**
 * Tests regex, ignores modifiers (Backspace, Tab, etc.)
 *
 * @param {RegExp} regex
 * @param input
 */
export const handleModifier = (regex, input) => regex.test(input) && input.length === 1;

/** returns regex for numeric values (0-9) */
export const number = () => new RegExp('^\\d+$');

/** finds non number values, for html input type "number" */
export const inputNumber = () => new RegExp('[-+eE]');

export const lowerCaseLetters = () => /[a-z]/;
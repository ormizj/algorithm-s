/**
 * Tests for regex of inputs, ignores tests on modifiers (Backspace, Tab, etc.)
 *
 * @param {RegExp} regex
 * @param input
 */
export const regHandleModifier = (regex, input) => regex.test(input) && input.length === 1;

/** returns regex for numeric values (0-9) */
export const regNumber = () => new RegExp('^\\d+$');

/** finds non number values, for html input type "number" */
export const regInputNumber = () => new RegExp('[-+eE]');

export const expLowerCaseLetters = () => /[a-z]/;
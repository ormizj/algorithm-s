import type { Ref } from 'vue';
import { ref, watch } from 'vue';

interface ValidationInput<T> {
	ref: Ref<T>;
	error: Ref<string>;
	dirty?: Ref<boolean>;

	/**
	 * Validation function for the input,
	 * the input will be considered valid if
	 * 1. {false} is NOT returned
	 * 2. error is an empty {string}
	 *
	 * @param ref of the current input
	 * @param setError function to set the error, this function always returns {false}
	 */
	validate(ref: Ref<T>, setError: (newError: string) => boolean): boolean;
}

interface InitializedValidationInput<T> extends ValidationInput<T> {
	dirty: Ref<boolean>;

	validate(): boolean;

	reset(): void;
}

type FormInputFields<T = unknown> = {
	[K in keyof T]: ValidationInput<T[K]>;
};

type InitializedFormInputFields<T> = {
	[K in keyof T]: InitializedValidationInput<T[K]>;
};

export default class FormInputs<T extends FormInputFields> {
	private readonly inputs: InitializedFormInputFields<T>;

	constructor(inputs: FormInputFields<T>) {
		this.inputs = this.getInitializedInputs(
			inputs
		) as InitializedFormInputFields<T>; // initInputs, should ensure that "this.inputs" will satisfy "InitializedFormInput"
	}

	/**
	 * validates all the inputs and adding/removing errors as needed
	 */
	validateInputs(): boolean {
		let foundError = false;
		for (const inputKey in this.inputs) {
			if (!Object.hasOwn(this.inputs, inputKey)) continue;
			if (!this.inputs[inputKey].validate()) {
				foundError = true;
			}
		}
		return !foundError;
	}

	resetInputs(): void {
		for (const inputKey in this.inputs) {
			if (!Object.hasOwn(this.inputs, inputKey)) continue;
			this.inputs[inputKey].reset();
		}
	}

	/**
	 * @returns {true} if there are currently any errors
	 */
	hasErrors(): boolean {
		for (const inputKey in this.inputs) {
			if (!Object.hasOwn(this.inputs, inputKey)) continue;
			if (this.inputs[inputKey].error.value !== '') return true;
		}
		return false;
	}

	getInputs() {
		return this.inputs;
	}

	private getInitializedInputs(inputs: FormInputFields<T>) {
		for (const inputKey in inputs) {
			if (!Object.hasOwn(inputs, inputKey)) continue;
			const input = inputs[inputKey];
			this.initInputDirty(input);
			this.initInputValidate(input);
			this.initInputReset(input);
		}
		return inputs;
	}

	private initInputDirty(input: ValidationInput<T[Extract<keyof T, string>]>) {
		if (!input.dirty) input.dirty = ref(false);
		watch(input.ref, () => {
			if (!input.dirty) input.dirty = ref(false);
			input.dirty.value = true;
		});
	}

	private initInputValidate(
		input: ValidationInput<T[Extract<keyof T, string>]>
	) {
		const setError = (newError: string): boolean => {
			input.error.value = newError;
			return newError === '';
		};
		const boundValidate = input.validate.bind(null, input.ref, setError);
		input.validate = () => {
			const isValid = boundValidate();
			if (isValid) setError('');
			return isValid;
		};
	}

	private initInputReset(input: ValidationInput<T[Extract<keyof T, string>]>) {
		const newInput = input as InitializedValidationInput<
			T[Extract<keyof T, string>]
		>;
		const initialValue = input.ref.value;
		newInput.reset = () => {
			input.ref.value = initialValue;
		};
	}
}

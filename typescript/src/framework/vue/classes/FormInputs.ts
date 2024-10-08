import type { Ref } from 'vue';
import { ref, watch } from 'vue';

interface ValidationInput<T> {
	value: T;
	error?: string;
	dirty?: boolean;

	/**
	 * Validation function for the input, the input will be considered valid if no error is set
	 *
	 * @param value of the current input
	 * @param setError function to set the error, empty string will clear input error
	 */
	validate(
		ref: Ref<T>,
		setError: (newError: string) => boolean
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	): boolean | void;
}

interface InitializedValidationInput<T>
	extends Omit<ValidationInput<T>, 'value' | 'error' | 'dirty'> {
	ref: Ref<T>;

	error: Ref<string>;

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
		this.inputs = this.getInitializedInputs(inputs);
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

	cleanInputsDirtyState(): void {
		for (const inputKey in this.inputs) {
			if (!Object.hasOwn(this.inputs, inputKey)) continue;
			this.inputs[inputKey].dirty.value = false;
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
			const initializedInput = this.initInitializedValidationInput(
				inputs[inputKey]
			);
			this.initInputDirty(initializedInput);
			this.initInputValidate(initializedInput);
			this.initInputReset(initializedInput);
		}
		return inputs as unknown as InitializedFormInputFields<T>;
	}

	private initInitializedValidationInput(
		input: ValidationInput<T[Extract<keyof T, string>]>
	) {
		const initializedInput = input as unknown as InitializedValidationInput<
			T[Extract<keyof T, string>]
		>;

		initializedInput.ref = ref(input.value as Ref<T[Extract<keyof T, string>]>);
		initializedInput.error = ref(input.error ?? '');
		initializedInput.dirty = ref(input.dirty ?? false);

		return initializedInput;
	}

	private initInputDirty(
		input: InitializedValidationInput<T[Extract<keyof T, string>]>
	) {
		watch(input.ref, () => {
			if (!input.dirty) input.dirty = ref(false);
			input.dirty.value = true;
		});
	}

	private initInputValidate(
		input: InitializedValidationInput<T[Extract<keyof T, string>]>
	) {
		const setError = (newError: string): boolean => {
			input.error.value = newError;
			return newError === '';
		};

		// @ts-expect-error transforming validationInput to initializedValidationInput
		const boundValidate = input.validate.bind(null, input.ref, setError);
		input.validate = () => {
			const isValid = boundValidate();
			if (isValid !== false) setError('');
			return isValid;
		};
	}

	private initInputReset(
		input: InitializedValidationInput<T[Extract<keyof T, string>]>
	) {
		const initialValue = input.ref.value;
		input.reset = () => {
			input.ref.value = initialValue;
		};
	}
}

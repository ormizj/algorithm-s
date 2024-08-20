import type { Ref } from 'vue';
import { ref, watch } from 'vue';

interface ValidationInput<T> {
	ref: Ref<T>;
	error: Ref<string>;
	dirty?: Ref<boolean>;
	validate(
		ref: Ref<T>,
		setError: (newError: string) => false | undefined
	): false | undefined;
}

type FormInputFields<T = unknown> = {
	[K in keyof T]: ValidationInput<T[K]>;
};

type InitializedFormInputFields<T> = {
	[K in keyof T]: ValidationInput<T[K]> & {
		dirty: Ref<boolean>;
		validate(): false | undefined;
	};
};

export default class FormInputs<T extends FormInputFields> {
	private readonly inputs: InitializedFormInputFields<T>;

	constructor(inputs: FormInputFields<T>) {
		this.inputs = this.getInitializedInputs(
			inputs
		) as InitializedFormInputFields<T>;
	}

	validateInputs(): boolean {
		let foundError = false;
		for (const inputKey in this.inputs) {
			if (!Object.hasOwn(this.inputs, inputKey)) continue;
			if (this.inputs[inputKey].validate() === false) {
				foundError = true;
			}
		}
		return !foundError;
	}

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
			this.initInputValidation(input);
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

	private initInputValidation(
		input: ValidationInput<T[Extract<keyof T, string>]>
	) {
		const setError = (newError: string): false | undefined => {
			input.error.value = newError;
			return newError === '' ? undefined : false;
		};
		const boundValidate = input.validate.bind(null, input.ref, setError);
		input.validate = () => {
			const isValid = boundValidate();
			if (isValid !== false) setError('');
			return isValid;
		};
	}
}

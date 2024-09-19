import type { Ref } from 'vue';
import { ref, watch } from 'vue';

interface ValidationInput<T> {
    value: T;
    error?: string;
    dirty?: boolean;

    /**
     * Validation function for the input,
     * the input will be considered valid if
     * 1. {false} is NOT returned
     * 2. error is an empty {string}
     *
     * @param value of the current input
     * @param setError function to set the error, this function always returns {false}
     */
    validate(value: T, setError: (newError: string) => boolean): boolean;
}

interface InitializedValidationInput<T>
    extends Omit<ValidationInput<T>, 'value' | 'error' | 'dirty'> {
    value: Ref<T>;

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
            const initializedInput = this.validationInputToInitializedValidationInput(
                inputs[inputKey]
            );
            this.initInputDirty(initializedInput);
            this.initInputValidate(initializedInput);
            this.initInputReset(initializedInput);
        }
        return inputs as unknown as InitializedFormInputFields<T>;
    }

    private validationInputToInitializedValidationInput(
        input: ValidationInput<T[Extract<keyof T, string>]>
    ) {
        const initializedInput = input as unknown as InitializedValidationInput<
            T[Extract<keyof T, string>]
        >;

        initializedInput.value = ref(
            input.value as Ref<
                T[Extract<keyof T, string>],
                T[Extract<keyof T, string>]
            >
        );
        initializedInput.error = ref(input.error ?? '');
        initializedInput.dirty = ref(input.dirty ?? false);

        return initializedInput;
    }

    private initInputDirty(
        input: InitializedValidationInput<T[Extract<keyof T, string>]>
    ) {
        watch(input.value, () => {
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
        const boundValidate = input.validate.bind(null, input.value, setError);
        input.validate = () => {
            const isValid = boundValidate();
            if (isValid) setError('');
            return isValid;
        };
    }

    private initInputReset(
        input: InitializedValidationInput<T[Extract<keyof T, string>]>
    ) {
        const initialValue = input.value.value;
        input.reset = () => {
            input.value.value = initialValue;
        };
    }
}

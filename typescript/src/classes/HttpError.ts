export default class HttpError extends Error {
    public readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}

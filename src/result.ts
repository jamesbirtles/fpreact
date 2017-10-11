export class Result {
    constructor(private value: any, public err?: Error) {}

    get ok(): boolean {
        return this.err == null;
    }

    get<T = any>(): T {
        return this.value as T;
    }
}

export function r(value: any, err?: Error): Result {
    return new Result(value, err);
}

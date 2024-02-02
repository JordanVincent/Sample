export function assertUnreachable(label: string, value: never): never {
  throw new Error(`Unknown ${label} "${value}"`);
}

// https://mariusschulz.com/blog/assertion-functions-in-typescript
type NonNullable<T> = T extends null | undefined ? never : T;
export function assertNonNullish<TValue>(
  value: TValue,
  message?: string,
): asserts value is NonNullable<TValue> {
  if (value === null || value === undefined) {
    throw Error(message || 'Value is null or undefined');
  }
}

export function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw Error(`${value} is not a string`);
  }
}

export function assertNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw Error(`${value} is not a number`);
  }
}

export function assertObject(value: unknown): asserts value is object {
  if (typeof value !== 'object') {
    throw Error(`${value} is not a object`);
  }
}

export function assertEquals<T>(
  value: unknown,
  expected: T,
): asserts value is T {
  if (value !== expected) {
    throw Error(`${value} is not equal to ${expected}`);
  }
}

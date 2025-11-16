type UnwrapAsyncMethod<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

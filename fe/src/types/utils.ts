export type VarParamFunction<T> = (...args: any[]) => T

export type RecursiveRecord<K extends string, T> = Record<K, T> | { [key: string]: RecursiveRecord<K, T> }

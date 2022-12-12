export const vTypeOf = (any) => {
    if (any === null || any === undefined) return 'undefined';

    if (Array.isArray(any)) return 'array';

    if (any !== any) return 'nan';
    return typeof any;
}

export const deepClone = (any) => structuredClone(any);
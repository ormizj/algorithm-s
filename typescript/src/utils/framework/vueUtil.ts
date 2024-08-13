export const isRouteActive = (path: string) => {
    const route = useRoute();
    return route.path.startsWith(path);
};

export const toRawClone = <T>(toClone: T) => <T>structuredClone(toRaw(toClone));

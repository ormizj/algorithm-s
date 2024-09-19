export const useIsHydrating = () => {
    const isHydrating = ref(true);
    onNuxtReady(() => {
        isHydrating.value = false;
    });
    return isHydrating;
};

export const onPageLoadingEnd = (function_: () => void) => {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.hookOnce('page:loading:end', function_);
};

export const onPageLoadingStart = (function_: () => void) => {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.hookOnce('page:loading:start', function_);
};

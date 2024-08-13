export const useIsHydrating = () => {
    const isHydrating = ref(true);
    onNuxtReady(() => {
        isHydrating.value = false;
    });
    return isHydrating;
};



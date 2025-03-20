export const addDragScroll = (element: HTMLElement) => {
    const dragStart = (event: PointerEvent) => element.setPointerCapture(event.pointerId);
    const dragEnd = (event: PointerEvent) => element.releasePointerCapture(event.pointerId);
    const drag = (event: PointerEvent) => element.hasPointerCapture(event.pointerId) && (element.scrollLeft -= event.movementX);

    element.addEventListener("pointerdown", dragStart);
    element.addEventListener("pointerup", dragEnd);
    element.addEventListener("pointermove", drag);
};

export const hasScroll = (element: HTMLElement) => {
    return element.scrollWidth > element.clientWidth;
};
/*

#validateIndex(index, canBeEmptyIndex = true) {
    const maxIndex = canBeEmptyIndex ? this.length : this.length - 1;
    if (index === undefined || index > maxIndex) return maxIndex;
    return index;
}

#defineProperty = (index) => {
    Object.defineProperty(this, index, {
        get() {
            return this.elementMap[index];
        },
        set(element) {
            if (this.elementMap[index]) {
                this.#deleteFromMaps(index);
            }
            this.#insertToMaps(element, index, false);
        }
    });
}

*/
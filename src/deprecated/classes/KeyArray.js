#validateIndex(index, canBeEmptyIndex = true) {
    const maxIndex = canBeEmptyIndex ? this.length : this.length - 1;
    if (index === undefined || index > maxIndex) return maxIndex;
    return index;
}
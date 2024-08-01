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

fixed the last index skip present in the {reduceRight} function (problem also occurs in the {Array.reduceRight} method)  
@param {(accumulator, currentValue, currentIndex=0, instance = KeyArray) => any} callback, "instance" will return the instance of {KeyArray}, not an {Array}
@returns
@see reduceRight

reduceRightFix(callback, initialValue = null) {
    let index;
    let accumulator;
    let missingIndex;

    if (initialValue === null) {
        accumulator = this.getLast();
        index = this.size() - 1;
        missingIndex = 1;
    } else {
        accumulator = initialValue;
        index = this.size();
        missingIndex = 0;
    }

    while (--index >= 0) {
        const element = this.elementMap.get(index);
        accumulator = callback(accumulator, element, index + missingIndex, this.$);
    }

    return accumulator;
}

*/
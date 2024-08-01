export const arrCloneShallow = (arr = []) => [...arr];

export const arrUpToIndex = (arr = [], index = 0) => {
    const tempArr = [];
    for (let i = 0; i <= index; i++) {
        tempArr.push(arr[i]);
    }
    return tempArr;
}

export const arrFromIndex = (arr = [], index = 0) => {
    const tempArr = [];
    while (index < arr.length) {
        tempArr.push(arr[index]);
        index++;
    }
    return tempArr;
}
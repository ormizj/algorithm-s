type NestedObject = {
    [key: string]: NestedObject | string | number;
};
const printAll = (obj: NestedObject) => {
    // initialize the queue with the root object
    const queue: NestedObject[] = [obj];

    while (queue.length > 0) {
        // dequeue the first item
        const current = queue.shift();

        for (const key in current) {
            // ensure the property belongs to the object
            if (current.hasOwnProperty(key)) {
                const value = current[key];

                if (typeof value === 'object' && value !== null) {
                    // if the value is an object, enqueue it for further processing
                    queue.push(value);
                } else {
                    // if the value is not an object, print it
                    console.log(value);
                }
            }
        }
    }
};

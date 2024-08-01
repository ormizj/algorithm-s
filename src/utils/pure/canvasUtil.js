export const clone = (can) => {
    //create a new canvas
    const newCan = document.createElement('canvas');
    const ctx = newCan.getContext('2d');

    //set dimensions
    newCan.width = can.width;
    newCan.height = can.height;

    //apply the canvas to the new one
    ctx.drawImage(can, 0, 0);

    //return the new canvas
    return newCan;
}

export const replicate = (can, otherCan) => {
    //get canvas context
    const context = otherCan.getContext('2d');

    //set dimensions
    otherCan.width = can.width;
    otherCan.height = can.height;

    //apply the canvas to the new one
    context.drawImage(can, 0, 0);
}

export const toImg = (can) => {
    const img = document.createElement('img');

    img.src = can.toDataURL().replace("image/png", "image/octet-stream");

    return img;
}
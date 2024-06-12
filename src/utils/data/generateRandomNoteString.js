/* export function generateRandomNoteString(data) {
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const randomIndex = getRandomItem(Object.keys(data));
    const randomKey = getRandomItem(Object.keys(data[randomIndex]));
    const note = randomKey;
    const frequency = data[randomIndex][randomKey];

    return {
        note: note,
        string: randomIndex,
        frequency: frequency,
    };
} */

function getRandomInt(min, max) {
    const crypto = window.crypto || window.msCrypto; // for IE 11
    const range = max - min;
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1); // Convert to a floating-point number between 0 and 1
    return Math.floor(randomNumber * range) + min;
}

function getRandomItem(array) {
    return array[getRandomInt(0, array.length)];
}

export function generateRandomNoteString(data) {
    const keys = Object.keys(data);
    const randomIndex = getRandomItem(keys);
    const subKeys = Object.keys(data[randomIndex]);
    const randomKey = getRandomItem(subKeys);
    const note = randomKey;
    const frequency = data[randomIndex][randomKey];

    return {
        note: note,
        string: randomIndex,
        frequency: frequency,
    };
}

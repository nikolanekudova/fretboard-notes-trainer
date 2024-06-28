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

function getSharpOrFlat(note) {
    // random number – zero or one
    const zeroOrOneNumber = Math.floor(Math.random() * 2);

    // return sharp or flat note 
    return note.split(" / ")[zeroOrOneNumber];
}

export function generateRandomNoteString(data) {
    const keys = Object.keys(data);
    const randomIndex = getRandomItem(keys);
    const subKeys = Object.keys(data[randomIndex]);
    const randomKey = getRandomItem(subKeys);
    let note = randomKey;
    const frequency = data[randomIndex][randomKey];

    if (note.includes("♯")) {
        note = getSharpOrFlat(note);
    }

    return {
        note: note,
        string: randomIndex,
        frequency: frequency,
    };
}

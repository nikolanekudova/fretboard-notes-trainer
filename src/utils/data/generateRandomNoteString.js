export function generateRandomNoteString(data) {
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
}
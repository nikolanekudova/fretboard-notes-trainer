export function getTrainerData(data, strings, notes, chromaticNatural) {
    // "deep copy" of data – because of chromatic / natural filter
    let allData = JSON.parse(JSON.stringify(data));

    // delete strings based on state – if false, delete string
    for (const string in strings) {
        if (strings[string] == false) {
            delete allData[string];
        }
    }

    // delete notes based on state – if false, delete note
    for (const [note, state] of Object.entries(notes)) {
        if (state === false) {
            for (const string in allData) {
                let obj = allData[string];

                for (const key in obj) {
                    if (key === note) {
                        delete obj[key];
                    }
                }
            }
        }
    }

    // delete notes with # or ♭ if user want only natural notes
    if (chromaticNatural == "natural") {
        for (const string in allData) {
            let obj = allData[string];

            for (const key in obj) {
                if (key.includes("#") || key.includes("♭")) {
                    delete obj[key];
                }
            }
        }
    }

    console.log(allData);
    return allData;
}
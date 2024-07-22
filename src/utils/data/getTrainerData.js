export function getTrainerData(data, strings, notes, chromaticNatural, queryNotes) {
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
                if (key.includes("♯") || key.includes("♭")) {
                    delete obj[key];
                }
            }
        }
    }

    // delete query notes
    if (queryNotes == false) {
        for (const string in allData) {
            // handle cases for "E1" and "E6"
            if (string === "E1" || string === "E6") {
                if (allData[string].hasOwnProperty("E")) {
                    delete allData[string]["E"];
                }
            } else if (allData[string].hasOwnProperty(string)) {
                delete allData[string][string];
            }
        }
    }
    
    return allData;
}
import React, { useState, useEffect } from "react";
import { data } from "../data";
import soundEffect from "../assets/correct.mp3";

export function TrainerPage(appStart, setAppStart) {
    const [frequency, setFrequency] = useState(0);
    const [noteStringFrequency, setNoteStringFrequency] = useState({
        note: "",
        string: 0,
        frequency: -100,
    });
    const [showCorrect, setShowCorrect] = useState(false);
    const [showFrequency, setShowFrequency] = useState(false);
    const [strings, setStrings] = useState({
        E1: true,
        B: true,
        G: true,
        D: true,
        A: true,
        E6: true,
    });
    const [notes, setNotes] = useState({
        C: true,
        "C# / D♭": true,
        D: true,
        "D# / E♭": true,
        E: true,
        F: true,
        "F# / G♭": true,
        G: true,
        "G# / A♭": true,
        A: true,
        "A# / B♭": true,
        B: true,
    });
    const [chromaticNatural, setChromaticNatural] = useState("chromatic");

    function playSound() {
        var audio = new Audio(soundEffect);

        audio.play();
    }

    function getTrainerData() {
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
                        if (key.includes(note)) {
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

    // generate new random note and string when inputs change
    useEffect(() => {
        let dataToGetRandom = getTrainerData();

        setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
    }, [strings]);

    useEffect(() => {
        let dataToGetRandom = getTrainerData();

        setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
    }, [notes]);

    useEffect(() => {
        let dataToGetRandom = getTrainerData();

        setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
    }, [chromaticNatural]);

    useEffect(() => {
        // frequency from microphone is +-10 Hz from prescribed
        if (Math.abs(noteStringFrequency.frequency - frequency) <= 10) {
            playSound();
            setShowCorrect(true);

            setTimeout(() => {
                setShowCorrect(false);
            }, 2000);

            let dataToGetRandom = getTrainerData();
            setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
        }
    }, [frequency]);

    useEffect(() => {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let microphoneStream = null;
        let analyserNode = audioCtx.createAnalyser();
        let audioData = new Float32Array(analyserNode.fftSize);

        let dataToGetRandom = getTrainerData();
        setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
        startPitchDetection();

        function startPitchDetection() {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    microphoneStream = audioCtx.createMediaStreamSource(stream);
                    microphoneStream.connect(analyserNode);

                    audioData = new Float32Array(analyserNode.fftSize);

                    setInterval(() => {
                        analyserNode.getFloatTimeDomainData(audioData);

                        let pitch = autoCorrelate(
                            audioData,
                            audioCtx.sampleRate
                        );

                        // ignore pitch over 1000 Hz
                        if (pitch < 1000) {
                            setFrequency(pitch);
                        }
                    }, 500); // check pitch every 0.5 s
                })
                .catch((err) => {
                    console.log(err);

                    alert("You have to enable the microphone. 🎤");
                    stopTuner();
                });
        }

        function autoCorrelate(buf, sampleRate) {
            // ACF2+ algorithm
            let SIZE = buf.length;
            let rms = 0;

            for (let i = 0; i < SIZE; i++) {
                let val = buf[i];
                rms += val * val;
            }

            rms = Math.sqrt(rms / SIZE);
            if (rms < 0.00055)
                // not enough signal
                return;

            let r1 = 0,
                r2 = SIZE - 1,
                thres = 0.2;
            for (let i = 0; i < SIZE / 2; i++)
                if (Math.abs(buf[i]) < thres) {
                    r1 = i;
                    break;
                }
            for (let i = 1; i < SIZE / 2; i++)
                if (Math.abs(buf[SIZE - i]) < thres) {
                    r2 = SIZE - i;
                    break;
                }

            buf = buf.slice(r1, r2);
            SIZE = buf.length;

            let c = new Array(SIZE).fill(0);
            for (let i = 0; i < SIZE; i++)
                for (let j = 0; j < SIZE - i; j++)
                    c[i] = c[i] + buf[j] * buf[j + i];

            let d = 0;
            while (c[d] > c[d + 1]) d++;
            let maxval = -1,
                maxpos = -1;
            for (let i = d; i < SIZE; i++) {
                if (c[i] > maxval) {
                    maxval = c[i];
                    maxpos = i;
                }
            }
            let T0 = maxpos;
            let x1 = c[T0 - 1],
                x2 = c[T0],
                x3 = c[T0 + 1];
            let a = (x1 + x3 - 2 * x2) / 2;
            let b = (x3 - x1) / 2;

            if (a) T0 = T0 - b / (2 * a);

            return Math.round(sampleRate / T0);
        }
    }, []);

    function generateRandomNoteString(data) {
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

    function stopTuner() {
        appStart.setAppStart(false);
        location.reload(); // stop function is not working
    }

    function changeChromaticNatural() {
        if (chromaticNatural === "chromatic") {
            setChromaticNatural("natural");
        } else {
            setChromaticNatural("chromatic");
        }
    }

    return (
        <div>
            {showCorrect && (
                <div className="correct-page-wrapper">
                    <div>✅</div>
                </div>
            )}
            <div className="trainer-page-wrapper">
                <button onClick={stopTuner}>Stop Trainer 🛑</button>
                <div className="notes-strings-text">
                    {noteStringFrequency.note} note on{" "}
                    {noteStringFrequency.string} string
                </div>
                <div className="inputs-wrapper">
                    <div>
                        <div className="header-inputs">Strings</div>
                        <div className="strings-wrapper">
                            <label>
                                <input
                                    type="checkbox"
                                    name="stringE1"
                                    checked={strings.E1}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            E1: !prevState.E1,
                                        }))
                                    }
                                />
                                E1
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="stringB"
                                    checked={strings.B}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            B: !prevState.B,
                                        }))
                                    }
                                />
                                B
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="stringG"
                                    checked={strings.G}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            G: !prevState.G,
                                        }))
                                    }
                                />
                                G
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="stringD"
                                    checked={strings.D}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            D: !prevState.D,
                                        }))
                                    }
                                />
                                D
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="stringA"
                                    checked={strings.A}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            A: !prevState.A,
                                        }))
                                    }
                                />
                                A
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="stringE6"
                                    checked={strings.E6}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            E6: !prevState.B,
                                        }))
                                    }
                                />
                                E6
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="header-inputs">Notes</div>
                        <div className="notes-wrapper">
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteC"
                                        checked={notes.C}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                C: !prevState.C,
                                            }))
                                        }
                                    />
                                    C
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteD"
                                        checked={notes.D}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                D: !prevState.D,
                                            }))
                                        }
                                    />
                                    D
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteE"
                                        checked={notes.E}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                E: !prevState.E,
                                            }))
                                        }
                                    />
                                    E
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteF"
                                        checked={notes.F}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                F: !prevState.F,
                                            }))
                                        }
                                    />
                                    F
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteG"
                                        checked={notes.G}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                G: !prevState.G,
                                            }))
                                        }
                                    />
                                    G
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteA"
                                        checked={notes.A}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                A: !prevState.A,
                                            }))
                                        }
                                    />
                                    A
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="noteB"
                                        checked={notes.B}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                B: !prevState.B,
                                            }))
                                        }
                                    />
                                    B
                                </label>
                            </div>
                            {chromaticNatural === "chromatic" && (
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={notes["C# / D♭"]}
                                            onChange={() =>
                                                setNotes((prevState) => ({
                                                    ...prevState,
                                                    ["C# / D♭"]:
                                                        !prevState["C# / D♭"],
                                                }))
                                            }
                                        />
                                        C♯
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={notes["D# / E♭"]}
                                            onChange={() =>
                                                setNotes((prevState) => ({
                                                    ...prevState,
                                                    ["D# / E♭"]:
                                                        !prevState["D# / E♭"],
                                                }))
                                            }
                                        />
                                        D♯
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={notes["F# / G♭"]}
                                            onChange={() =>
                                                setNotes((prevState) => ({
                                                    ...prevState,
                                                    ["F# / G♭"]:
                                                        !prevState["F# / G♭"],
                                                }))
                                            }
                                        />
                                        F♯
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={notes["G# / A♭"]}
                                            onChange={() =>
                                                setNotes((prevState) => ({
                                                    ...prevState,
                                                    ["G# / A♭"]:
                                                        !prevState["G# / A♭"],
                                                }))
                                            }
                                        />
                                        G♯
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={notes["A# / B♭"]}
                                            onChange={() =>
                                                setNotes((prevState) => ({
                                                    ...prevState,
                                                    ["A# / B♭"]:
                                                        !prevState["A# / B♭"],
                                                }))
                                            }
                                        />
                                        A♯
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="header-inputs">Scale</div>
                        <div className="scale-wrapper">
                            <label>
                                <input
                                    type="radio"
                                    name="chromatic"
                                    checked={chromaticNatural === "chromatic"}
                                    onChange={changeChromaticNatural}
                                />
                                Chromatic
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="natural"
                                    checked={chromaticNatural === "natural"}
                                    onChange={changeChromaticNatural}
                                />
                                Natural
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="frequency-input-wrapper">
                <label>
                    <input
                        type="checkbox"
                        name="showFrequency"
                        checked={showFrequency}
                        onChange={() =>
                            setShowFrequency((prevState) => !prevState)
                        }
                    />
                    Show Frequency
                </label>
                {showFrequency && (
                    <div className="frequency">
                        <div className="frequency-wrapper">
                            <div className="frequency-text">
                                Your Frequency:
                            </div>
                            <div>{frequency}</div>
                        </div>
                        <div className="frequency-wrapper">
                            <div className="frequency-text">Should be:</div>
                            <div>{noteStringFrequency.frequency}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

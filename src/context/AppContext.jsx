import React, { createContext, useState, useRef } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [frequency, setFrequency] = useState(0);
    const [noteStringFrequency, setNoteStringFrequency] = useState({
        note: "",
        string: 0,
        frequency: -100,
        volume: "❗️",
    });
    const [showCorrect, setShowCorrect] = useState(false);
    const [showEndMessage, setShowEndMessage] = useState(false);
    const [showInputs, setShowInputs] = useState(false);
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
        "C♯ / D♭": true,
        D: true,
        "D♯ / E♭": true,
        E: true,
        F: true,
        "F♯ / G♭": true,
        G: true,
        "G♯ / A♭": true,
        A: true,
        "A♯ / B♭": true,
        B: true,
    });
    const [chromaticNatural, setChromaticNatural] = useState("chromatic");
    const [queryNotes, setQueryNotes] = useState(true);
    const [timeLimit, setTimeLimit] = useState("no-limit");
    const [correctFrequency, setCorrectFrequency] = useState(false);
    const [microphoneSensitivity, setMicrophoneSensitivity] =
        useState("medium");
    const microphoneSensitivityRef = useRef(0.005);
    const [results, setResults] = useState([]);

    return (
        <AppContext.Provider
            value={{
                frequency,
                setFrequency,
                noteStringFrequency,
                setNoteStringFrequency,
                showCorrect,
                setShowCorrect,
                showEndMessage,
                setShowEndMessage,
                showInputs,
                setShowInputs,
                strings,
                setStrings,
                notes,
                setNotes,
                chromaticNatural,
                setChromaticNatural,
                queryNotes,
                setQueryNotes,
                timeLimit,
                setTimeLimit,
                correctFrequency,
                setCorrectFrequency,
                microphoneSensitivity,
                setMicrophoneSensitivity,
                microphoneSensitivityRef,
                results,
                setResults,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

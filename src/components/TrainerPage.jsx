import React, { useState, useEffect, useRef } from "react";
import { data } from "../data";
import soundEffect from "../assets/correct.mp3";
import { CorrectPage } from "./CorrectPage";
import { autoCorrelate } from "../utils/sound/autoCorrelate";
import { getTrainerData } from "../utils/data/getTrainerData";
import { playSound } from "../utils/playSound";
import { generateRandomNoteString } from "../utils/data/generateRandomNoteString";
import { Inputs } from "./Inputs";

export function TrainerPage(appStart, setAppStart) {
    const [frequency, setFrequency] = useState(0);
    const [noteStringFrequency, setNoteStringFrequency] = useState({
        note: "",
        string: 0,
        frequency: -100,
        volume: "❗️",
    });
    const [showCorrect, setShowCorrect] = useState(false);
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
    const [correctFrequency, setCorrectFrequency] = useState(false);
    const [microphoneSensitivity, setMicrophoneSensitivity] = useState("medium");
    const microphoneSensitivityRef = useRef(0.005);

    function calculateMicrophoneSensitivity(sensitivity) {
        switch (sensitivity) {
            case "low":
                return 0.05;
            case "medium":
                return 0.005;
            case "high":
                return 0.0005;
            default:
                return 0.005;
        }
    }

    function newNoteStringAndCheck() {
        // check if new random string and note are the same, if true, generate new
        let dataToGetRandom = getTrainerData(
            data,
            strings,
            notes,
            chromaticNatural,
            queryNotes
        );
        let newRandomNoteString = generateRandomNoteString(dataToGetRandom);

        if (
            newRandomNoteString.string == noteStringFrequency.string &&
            newRandomNoteString.note == noteStringFrequency.note
        ) {
            newRandomNoteString = generateRandomNoteString(dataToGetRandom);
        }

        return newRandomNoteString;
    }

    // generate new random note and string when inputs change
    useEffect(() => {
        setNoteStringFrequency(newNoteStringAndCheck());
    }, [strings, notes, chromaticNatural, queryNotes]);

    // Update the sensitivity number whenever the sensitivity value changes
    useEffect(() => {
        const sensitivityValue = calculateMicrophoneSensitivity(microphoneSensitivity);

        microphoneSensitivityRef.current = sensitivityValue;
    }, [microphoneSensitivity]);

    // check frequency from microphone
    useEffect(() => {
        // frequency from microphone is +-10 Hz from prescribed
        if (Math.abs(noteStringFrequency.frequency - frequency) <= 10) {
            // because of showing false correct
            if (correctFrequency === false) {
                playSound(soundEffect);
                setShowCorrect(true);
                setCorrectFrequency(true);

                setTimeout(() => {
                    setShowCorrect(false);
                    setCorrectFrequency(false);

                    setNoteStringFrequency(newNoteStringAndCheck());
                }, 1500);
            }
        }
    }, [frequency]);

    useEffect(() => {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let microphoneStream = null;
        let analyserNode = audioCtx.createAnalyser();
        let audioData = new Float32Array(analyserNode.fftSize);

        setNoteStringFrequency(newNoteStringAndCheck());
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
                            audioCtx.sampleRate,
                            microphoneSensitivityRef.current
                        );

                        // ignore pitch over 1000 Hz
                        if (pitch < 1000) {
                            setFrequency(pitch);
                        }

                        checkVolume();
                    }, 500); // check pitch every 0.5 s
                })
                .catch((err) => {
                    console.log(err);

                    alert("You have to enable the microphone. 🎤");
                    stopTuner();
                });

            function checkVolume() {
                analyserNode.getFloatTimeDomainData(audioData);
                const rms = calculateRMS(audioData);

                setNoteStringFrequency((prevState) => ({
                    ...prevState,
                    volume: rms,
                }));
            }
        }
    }, []);

    function calculateRMS(audioData) {
        let rms = 0;

        for (let i = 0; i < audioData.length; i++) {
            rms += audioData[i] * audioData[i];
        }

        rms = Math.sqrt(rms / audioData.length);

        return rms;
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
            {showCorrect && <CorrectPage />}
            <div className="trainer-page-wrapper">
                <div className="table-wrapper">
                    <div className="table-row-wrapper">
                        <div>Your Frequency</div>
                        <div>{frequency}</div>
                    </div>
                    <div className="table-row-wrapper">
                        <div>Target Frequency</div>
                        <div>{noteStringFrequency.frequency}</div>
                    </div>
                    <div className="table-row-wrapper">
                        <div>Your Volume</div>
                        <div className="volume-bar-container">
                            <div
                                className={`volume-bar ${
                                    noteStringFrequency.volume < microphoneSensitivityRef.current
                                        ? "volume-weak"
                                        : ""
                                }`}
                                style={{
                                    height: `${
                                        noteStringFrequency.volume * 700
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="table-row-wrapper">
                        <div>Microphone Sensitivity</div>
                        <div className="sensitivity-row-wrapper">
                            <label className="sensitivity-label-input">
                                <input
                                    type="radio"
                                    name="low"
                                    checked={microphoneSensitivity === "low"}
                                    onChange={() =>
                                        setMicrophoneSensitivity("low")
                                    }
                                />
                                Low
                            </label>
                            <label className="sensitivity-label-input">
                                <input
                                    type="radio"
                                    name="medium"
                                    checked={microphoneSensitivity === "medium"}
                                    onChange={() =>
                                        setMicrophoneSensitivity("medium")
                                    }
                                />
                                Medium
                            </label>
                            <label className="sensitivity-label-input">
                                <input
                                    type="radio"
                                    name="high"
                                    checked={microphoneSensitivity === "high"}
                                    onChange={() =>
                                        setMicrophoneSensitivity("high")
                                    }
                                />
                                High
                            </label>
                        </div>
                    </div>
                </div>
                <div className="notes-strings-text">
                    {noteStringFrequency.note} note on{" "}
                    {noteStringFrequency.string} string
                </div>
                <button onClick={stopTuner}>Stop Trainer 🛑</button>
                <Inputs
                    strings={strings}
                    setStrings={setStrings}
                    notes={notes}
                    setNotes={setNotes}
                    chromaticNatural={chromaticNatural}
                    changeChromaticNatural={changeChromaticNatural}
                    queryNotes={queryNotes}
                    setQueryNotes={setQueryNotes}
                />
            </div>
        </div>
    );
}

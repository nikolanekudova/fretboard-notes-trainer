import React, { useState, useEffect } from "react";
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

    // generate new random note and string when inputs change
    useEffect(() => {
        let dataToGetRandom = getTrainerData(
            data,
            strings,
            notes,
            chromaticNatural
        );

        setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
    }, [strings, notes, chromaticNatural]);

    // check frequency from microphone
    useEffect(() => {
        // frequency from microphone is +-10 Hz from prescribed
        if (Math.abs(noteStringFrequency.frequency - frequency) <= 10) {
            playSound(soundEffect);
            setShowCorrect(true);

            setTimeout(() => {
                setShowCorrect(false);
            }, 2000);

            let dataToGetRandom = getTrainerData(
                data,
                strings,
                notes,
                chromaticNatural
            );
            setNoteStringFrequency(generateRandomNoteString(dataToGetRandom));
        }
    }, [frequency]);

    useEffect(() => {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let microphoneStream = null;
        let analyserNode = audioCtx.createAnalyser();
        let audioData = new Float32Array(analyserNode.fftSize);

        let dataToGetRandom = getTrainerData(
            data,
            strings,
            notes,
            chromaticNatural
        );
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
    }, []);

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
                <button onClick={stopTuner}>Stop Trainer 🛑</button>
                <div className="notes-strings-text">
                    {noteStringFrequency.note} note on{" "}
                    {noteStringFrequency.string} string
                </div>
                <Inputs
                    strings={strings}
                    setStrings={setStrings}
                    notes={notes}
                    setNotes={setNotes}
                    chromaticNatural={chromaticNatural}
                    changeChromaticNatural={changeChromaticNatural}
                />
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
import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { data } from "../data";
import soundEffect from "../assets/correct.mp3";
import { InfoPage } from "./InfoPage";
import { autoCorrelate } from "../utils/sound/autoCorrelate";
import { getTrainerData } from "../utils/data/getTrainerData";
import { playSound } from "../utils/playSound";
import { generateRandomNoteString } from "../utils/data/generateRandomNoteString";
import {calculateMicrophoneSensitivity} from "../utils/sound/calculateMicrophoneSensitivity";
import {calculateRMS} from "../utils/sound/calculateRMS";

export function TrainerPage({ setTrainerStart }) {
    const {
        frequency,
        setFrequency,
        noteStringFrequency,
        setNoteStringFrequency,
        showCorrect,
        setShowCorrect,
        showEndMessage,
        setShowEndMessage,
        strings,
        notes,
        chromaticNatural,
        queryNotes,
        timeLimit,
        correctFrequency,
        setCorrectFrequency,
        microphoneSensitivity,
        setMicrophoneSensitivity,
        microphoneSensitivityRef,
    } = useContext(AppContext);
    
    const [remainingTime, setRemainingTime] = useState(60);
    const intervalRef = useRef(null);

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

    // Update the sensitivity number whenever the sensitivity value changes
    useEffect(() => {
        const sensitivityValue = calculateMicrophoneSensitivity(
            microphoneSensitivity
        );

        microphoneSensitivityRef.current = sensitivityValue;
    }, [microphoneSensitivity]);

    // check frequency from microphone
    useEffect(() => {
        // frequency from microphone is +-5 Hz from prescribed
        if (Math.abs(noteStringFrequency.frequency - frequency) <= 5) {
            // because of showing false correct
            if (correctFrequency === false) {
                //playSound(soundEffect);
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
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    function startTimer(timeLimit) {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setRemainingTime(timeLimit);

        intervalRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    setShowEndMessage(true);

                    setTimeout(() => {
                        setShowEndMessage(false);

                        clearInterval(intervalRef.current);
                        stopTuner();
    
                        return 0;
                    }, 2000);

                }

                return prevTime - 1;
            });
        }, 1000);
    }

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

                    if (timeLimit != "no-limit") {
                        startTimer(timeLimit);
                    }

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

    function stopTuner() {
        setTrainerStart(false);
        location.reload(); // stop function is not working
    }

    return (
        <div>
            {showCorrect && <InfoPage message={"✅"} />}
            {showEndMessage && <InfoPage message={"The timer is up! ⏰"} />}
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
                                    noteStringFrequency.volume <
                                    microphoneSensitivityRef.current
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
                    {timeLimit != "no-limit" && (
                        <div className="table-row-wrapper">
                            <div>Remaining Time</div>
                            <div>{remainingTime}</div>
                        </div>
                    )}
                </div>
                <div className="notes-strings-text">
                    {noteStringFrequency.note} note on{" "}
                    {noteStringFrequency.string} string
                </div>
                <button onClick={stopTuner}>Stop Trainer 🛑</button>
            </div>
        </div>
    );
}

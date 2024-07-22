import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { data } from "../data";
import { CorrectPage } from "./CorrectPage";
import { autoCorrelate } from "../utils/sound/autoCorrelate";
import { generateRandomNoteString } from "../utils/data/generateRandomNoteString";

export function GamePage({ setGameStart }) {
    const {
        frequency,
        setFrequency,
        noteStringFrequency,
        setNoteStringFrequency,
        showCorrect,
        setShowCorrect,
        correctFrequency,
        setCorrectFrequency,
        microphoneSensitivity,
        setMicrophoneSensitivity,
        microphoneSensitivityRef,
        results,
        setResults,
    } = useContext(AppContext);
    const [remainingTime, setRemainingTime] = useState(60);
    const intervalRef = useRef(null);
    const gameStoppedRef = useRef(false);
    const [score, setScore] = useState(0);
    const [notesInTime, setNotesInTime] = useState([60]);

    const scoreRef = useRef(0);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const notesInTimeRef = useRef([60]);
    useEffect(() => {
        notesInTimeRef.current = notesInTime;
    }, [notesInTime]);

    // Clear interval on component unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    function startTimer() {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setRemainingTime(60);

        intervalRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    stopGame();

                    return 0;
                }

                return prevTime - 1;
            });
        }, 1000);
    }

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
        let newRandomNoteString = generateRandomNoteString(data);

        // check if new random string and note are the same, if true, generate new
        if (
            newRandomNoteString.string == noteStringFrequency.string &&
            newRandomNoteString.note == noteStringFrequency.note
        ) {
            newRandomNoteString = generateRandomNoteString(data);
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
        // frequency from microphone is +-10 Hz from prescribed
        if (Math.abs(noteStringFrequency.frequency - frequency) <= 10) {
            // because of showing false correct
            if (correctFrequency === false) {
                //playSound(soundEffect);
                setShowCorrect(true);
                setCorrectFrequency(true);
                setScore((prev) => prev + 1);

                setNotesInTime([...notesInTime, remainingTime]);

                setTimeout(() => {
                    setShowCorrect(false);
                    setCorrectFrequency(false);

                    setNoteStringFrequency(newNoteStringAndCheck());
                }, 1000);
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

                    startTimer();

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

    function getAverageTime(timesArray) {
        // adding zero because of average time
        let timesArrayWithZero = timesArray;
        timesArrayWithZero.push(0);

        let elapsedTimes = [];

        for (let i = 1; i < timesArrayWithZero.length; i++) {
            const elapsedTime = timesArrayWithZero[i - 1] - timesArrayWithZero[i];
            elapsedTimes.push(elapsedTime);
        }

        const sumElapsedTimes = elapsedTimes.reduce(
            (sum, time) => sum + time,
            0
        );
        const averageElapsedTime = sumElapsedTimes / elapsedTimes.length;
        const roundedAverageElapsedTime = Math.round(averageElapsedTime * 10) / 10

        return roundedAverageElapsedTime;
    }

    function getCurrectDate() {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    function calculateAndSendToLocalStorage(currentScore, currentNotesInTime) {
        const averageElapsedTime = getAverageTime(currentNotesInTime);
        const currentDate = getCurrectDate();
        const newResult = {
            date: currentDate,
            correctNotes: currentScore,
            averageTime: averageElapsedTime || 0,
        };

        setResults((prevResults) => {
            const updatedResults = [newResult, ...prevResults];

            localStorage.setItem("results", JSON.stringify(updatedResults));

            return updatedResults;
        });
    }

    function stopGame() {
        const currentScore = scoreRef.current;
        const currentNotesInTime = notesInTimeRef.current;

        // Check if game is already stopped
        if (!gameStoppedRef.current) {
            calculateAndSendToLocalStorage(currentScore, currentNotesInTime);

            // Set gameStopped to true to prevent further calls
            gameStoppedRef.current = true;
        }

        setGameStart(false);
        location.reload(); // stop function is not working
    }

    function cancelGame() {
        setGameStart(false);
        location.reload(); // stop function is not working
    }

    return (
        <div>
            {showCorrect && <CorrectPage />}

            <div className="game-page-wrapper">
                <div className="table-wrapper">
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
                    <div className="table-row-wrapper">
                        <div>Your score</div>
                        <div>{score}</div>
                    </div>
                    <div className="table-row-wrapper">
                        <div>Remaining Time</div>
                        <div>{remainingTime}</div>
                    </div>
                </div>
                <div className="notes-strings-text">
                    {noteStringFrequency.note} note on{" "}
                    {noteStringFrequency.string} string
                </div>
                <button onClick={cancelGame}>Cancel Game 🏳️</button>
            </div>
        </div>
    );
}

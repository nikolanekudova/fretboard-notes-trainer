import React, { useState, useEffect } from "react";
import { data } from "../data";
import soundEffect from "../assets/correct.mp3"
import { CorrectPage } from "./CorrectPage";

export function TrainerPage(appStart, setAppStart) {
    const [frequency, setFrequency] = useState(0);
    const [noteStringFrequency, setNoteStringFrequency] = useState({
        note: "",
        string: 0,
        frequency: -100,
    });
    const [showCorrect, setShowCorrect] = useState(false);

    function playSound() {
        var audio = new Audio(soundEffect);

        audio.play();
    }

    useEffect(() => {
        if (Math.abs(noteStringFrequency.frequency - frequency) <= 10) {
            playSound();
            setShowCorrect(true);

            setTimeout(() => {
                setShowCorrect(false);
            }, 2000);

            setNoteStringFrequency(generateRandomNoteString(data));
        }
    }, [frequency]);

    useEffect(() => {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let microphoneStream = null;
        let analyserNode = audioCtx.createAnalyser();
        let audioData = new Float32Array(analyserNode.fftSize);

        setNoteStringFrequency(generateRandomNoteString(data));
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

                        let pitch = autoCorrelate(audioData, audioCtx.sampleRate);

                        if (pitch < 1000) {
                            setFrequency(pitch);
                        }
                    }, 500);
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
                rms += val*val;
            }

            rms = Math.sqrt(rms/SIZE);
            if (rms < 0.00015) // not enough signal
                return;
        
            let r1 = 0, r2 = SIZE-1, thres = 0.2;
            for (let i = 0; i < SIZE/2; i++)
                if (Math.abs(buf[i]) < thres) { r1 = i; break; }
            for (let i = 1; i < SIZE/2; i++)
                if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }
        
            buf = buf.slice(r1,r2);
            SIZE = buf.length;
        
            let c = new Array(SIZE).fill(0);
            for (let i = 0; i < SIZE; i++)
                for (let j = 0; j < SIZE-i; j++)
                    c[i] = c[i] + buf[j] * buf[j + i];
        
            let d = 0; while (c[d] > c[d + 1]) d++;
            let maxval = -1, maxpos = -1;
            for (let i = d; i < SIZE; i++) {
                if (c[i] > maxval) {
                    maxval = c[i];
                    maxpos = i;
                }
            }
            let T0 = maxpos;
            let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
            let a = (x1 + x3 - 2*x2) / 2;
            let b = (x3 - x1) / 2;

            if (a) T0 = T0 - b / (2 * a);
        
            return Math.round(sampleRate/T0);
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
        location.reload();
    }

    return (
        <div>
            {showCorrect && (
                <CorrectPage />
            )}
            <div className="trainer-page-wrapper">
                <button onClick={stopTuner}>Stop Trainer 🛑</button>
                <div className="notes-strings-text">
                    {noteStringFrequency.note} note on {noteStringFrequency.string}{" "}
                    string
                </div>
                <div className="frequency">
                    <div className="frequency-wrapper">
                        <div className="frequency-text">Your Frequency:</div>
                        <div>{frequency}</div>
                    </div>
                    <div className="frequency-wrapper">
                        <div className="frequency-text">Should be:</div>
                        <div>{noteStringFrequency.frequency}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
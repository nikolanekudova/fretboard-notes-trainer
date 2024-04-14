import React, { useState, useEffect } from "react";
import createTuner from "@pedroloch/tuner";
import { data } from "../data";

export function TrainerPage(appStart, setAppStart) {
    const tuner = createTuner();
    const [noteStringFrequency, setNoteStringFrequency] = useState({
        note: "",
        string: 0,
        frequency: 0,
    });

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
        tuner.stop();
        appStart.setAppStart(false);

        console.log(tuner.isOn);

        // tuner does not stop!!!
        location.reload();
    }

    function getDataFromTuner() {
        tuner.getData((tunerData) => {
            setNoteStringFrequency(prevState => {
                const freqencyDiff = Math.abs(
                    tunerData.frequency - prevState.frequency
                );
    
                if (freqencyDiff <= 5) {
                    console.log("Note match!");

                    return generateRandomNoteString(data);
                } else {
                    return prevState; // Keep the current state
                }
            });
        });
    }

    tuner.start();

    useEffect(() => {
        const newNoteString = generateRandomNoteString(data);
        setNoteStringFrequency(newNoteString);
    
        getDataFromTuner();
    }, []);

    return (
        <div className="trainer-page-wrapper">
            <button onClick={stopTuner}>Stop Trainer 🛑</button>
            <div className="notes-strings-text">
                {noteStringFrequency.note} note on {noteStringFrequency.string}{" "}
                string
            </div>
        </div>
    );
}

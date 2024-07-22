import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Inputs } from "./Inputs";
import { CountdownPage } from "./CountdownPage";

export function StartPage({
    setTrainerStart,
    setGameStart,
    trainerOrGame,
    setTrainerOfGame,
}) {
    const { showInputs, setShowInputs, results, setResults } =
        useContext(AppContext);

    const [showCountdown, setShowCountdown] = useState(false);

    const bestAverageTime = results.length
        ? Math.min(...results.map((result) => result.averageTime))
        : null;

    function startTrainer() {
        setTrainerOfGame("trainer");
        setShowInputs(true);
    }

    function startGame() {
        setShowCountdown(true);
    }

    // on mount get data from local storage
    useEffect(() => {
        const dataFromStorage = JSON.parse(localStorage.getItem("results"));

        if (dataFromStorage) {
            setResults(dataFromStorage);
        }
    }, []);

    return (
        <div>
            {showInputs && (
                <Inputs
                    setTrainerStart={setTrainerStart}
                    setGameStart={setGameStart}
                    trainerOrGame={trainerOrGame}
                />
            )}
            {showCountdown && (
                <CountdownPage
                    setShowCountdown={setShowCountdown}
                    setTrainerOfGame={setTrainerOfGame}
                    setGameStart={setGameStart}
                />
            )}
            <div className="start-page-btns-wrapper">
                <button onClick={startTrainer}>Start Trainer 🎶</button>
                <button onClick={startGame}>Start Game 🎮</button>
            </div>
            <h3 className="h3-game-results">Your Game Results</h3>
            <div className="table-wrapper result-table">
                <div className="table-row-wrapper">
                    <div>Date</div>
                    <div>Correct Notes</div>
                    <div>⌀ Time For Note</div>
                </div>
                {results.map((result, index) => (
                    <div
                        className={`table-row-wrapper ${
                            result.averageTime === bestAverageTime
                                ? "best-average-time"
                                : ""
                        }`}
                        key={index}
                    >
                        <div>{result.date}</div>
                        <div>{result.correctNotes}</div>
                        <div>{result.averageTime} s</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

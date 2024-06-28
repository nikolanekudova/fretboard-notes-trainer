import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Inputs } from "./Inputs";

export function StartPage({
    setTrainerStart,
    setGameStart,
    trainerOrGame,
    setTrainerOfGame
}) {
    const { showInputs, setShowInputs } = useContext(AppContext);

    function startTrainer() {
        setTrainerOfGame("trainer");
        setShowInputs(true);
    }

    function startGame() {
        setTrainerOfGame("game");
        setShowInputs(true);
    }

    return (
        <div>
            {showInputs && (
                <Inputs
                    setTrainerStart={setTrainerStart}
                    setGameStart={setGameStart}
                    trainerOrGame={trainerOrGame}
                />
            )}
            <div className="start-page-btns-wrapper">
                <button onClick={startTrainer}>Start Trainer 🎶</button>
                <button onClick={startGame}>Start Game 🎮</button>
            </div>
        </div>
    );
}

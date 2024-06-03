import React from "react";

export function StartPage({ trainerStart, setTrainerStart, gameStart, setGameStart} ) {
    function startTrainer() {
        setTrainerStart(true);
    }

    function startGame() {
        setGameStart(true);
    }

    return (
        <div className="start-page-btns-wrapper">
            <button onClick={startTrainer}>Start Trainer 🎶</button>
            <button onClick={startGame}>Start Game 🎮</button>
        </div>
    );
}

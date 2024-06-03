import React from "react";

export function GamePage({ setGameStart }) {
    function stopGame() {
        setGameStart(false);
        location.reload(); // stop function is not working
    }

    return (
        <div>
            <button onClick={stopGame}>Cancel Game 🙉</button>
        </div>
    )
}
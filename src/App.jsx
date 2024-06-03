import { useState } from "react";
import { StartPage } from "./components/StartPage";
import { TrainerPage } from "./components/TrainerPage";
import { GamePage } from "./components/GamePage";

export default function App() {
    const [trainerStart, setTrainerStart] = useState(false);
    const [gameStart, setGameStart] = useState(false);

    return (
        <div className="page-wrapper">
            <h1>Fretboard Notes Trainer 🎸</h1>
            {trainerStart === false && gameStart === false && (
                <StartPage
                    trainerStart={trainerStart}
                    setTrainerStart={setTrainerStart}
                    gameStart={gameStart}
                    setGameStart={setGameStart}
                />
            )}
            {trainerStart === true && (
                <TrainerPage
                    trainerStart={trainerStart}
                    setTrainerStart={setTrainerStart}
                />
            )}
            {gameStart === true && (
                <GamePage gameStart={gameStart} setGameStart={setGameStart} />
            )}
        </div>
    );
}

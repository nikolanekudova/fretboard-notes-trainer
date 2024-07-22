import { useState } from "react";
import { StartPage } from "./components/StartPage";
import { TrainerPage } from "./components/TrainerPage";
import { AppProvider } from "./context/AppContext";
import { GamePage } from "./components/GamePage";

export default function App() {
    const [trainerStart, setTrainerStart] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [trainerOrGame, setTrainerOfGame] = useState("trainer");

    return (
        <AppProvider>
            <div
                className={`${
                    trainerStart === false && gameStart === false
                        ? "background-wrapper"
                        : "background-wrapper-light"
                }`}
            >
                <div className="page-wrapper">
                    <div>
                        <h1>Fretboard Notes Trainer 🎸</h1>
                        {trainerStart === false && gameStart === false && (
                            <p className="about-trainer">
                                Practice makes perfect! Practice your guitar
                                fretboard notes or, if you're confident, play a
                                points-based game.
                            </p>
                        )}
                    </div>
                    {trainerStart === false && gameStart === false && (
                        <StartPage
                            setTrainerStart={setTrainerStart}
                            setGameStart={setGameStart}
                            trainerOrGame={trainerOrGame}
                            setTrainerOfGame={setTrainerOfGame}
                        />
                    )}
                    {trainerStart === true && (
                        <TrainerPage
                            setTrainerStart={setTrainerStart}
                        />
                    )}
                    {gameStart === true && (
                        <GamePage
                            gameStart={gameStart}
                            setGameStart={setGameStart}
                        />
                    )}
                </div>
            </div>
        </AppProvider>
    );
}

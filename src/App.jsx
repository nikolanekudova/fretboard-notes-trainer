import { useState } from "react";
import { StartPage } from "./components/StartPage";
import { TrainerPage } from "./components/TrainerPage";

function App() {
    const [appStart, setAppStart] = useState(false);

    return (
        <div className={`${appStart === false ? "background-wrapper" : "background-wrapper-light"}`}>
            <div className="page-wrapper">
                <div>
                    <h1>Fretboard Notes Trainer 🎸</h1>
                    {appStart === false && (
                        <p className="about-trainer">
                            Practice makes perfect. Practice your guitar
                            fretboard notes or, if you're confident, play a
                            points-based game (sorry, gameplay is in progress 👀).
                        </p>
                    )}
                </div>
                {appStart === false && (
                    <StartPage appStart={appStart} setAppStart={setAppStart} />
                )}
                {appStart === true && (
                    <TrainerPage
                        appStart={appStart}
                        setAppStart={setAppStart}
                    />
                )}
            </div>
        </div>
    );
}

export default App;

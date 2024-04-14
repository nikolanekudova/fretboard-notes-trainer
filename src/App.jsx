import { useState } from "react";
import { StartPage } from "./components/StartPage";
import { TrainerPage } from "./components/TrainerPage";

function App() {
    const [appStart, setAppStart] = useState(false);

    return (
        <div className="page-wrapper">
            <h1>Fretboard Notes Trainer 🎸</h1>
            {appStart === false && (
                <StartPage appStart={appStart} setAppStart={setAppStart} />
            )}
            {appStart === true && (
                <TrainerPage appStart={appStart} setAppStart={setAppStart} />
            )}
        </div>
    );
}

export default App;
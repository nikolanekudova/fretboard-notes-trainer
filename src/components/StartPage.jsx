import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Inputs } from "./Inputs";

export function StartPage({ appStart, setAppStart }) {
    const { showInputs, setShowInputs } = useContext(AppContext);

    return (
        <div>
            {showInputs && (
                <Inputs appStart={appStart} setAppStart={setAppStart} />
            )}
            <button onClick={() => setShowInputs(true)}>
                Start Trainer 🎶
            </button>
        </div>
    );
}

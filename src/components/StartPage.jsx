import React from "react";

export function StartPage(appStart, setAppStart) {
    function startApp() {
        appStart.setAppStart(true);
    }

    return (
        <div>
            <button onClick={startApp}>Start Trainer 🎶</button>
        </div>
    );
}

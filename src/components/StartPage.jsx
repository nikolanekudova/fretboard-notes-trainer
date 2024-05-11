import React from "react";

export function StartPage(appStart, setAppStart) {
    function startApp() {
        appStart.setAppStart(true);

        console.log("app started");
    }

    return (
        <div>
            <button onClick={startApp}>Start Trainer 🎶</button>
        </div>
    );
}

import React from "react";

export function StartPage(appStart, setAppStart) {
    function getLocalStream() {
        navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((stream) => {
                window.localStream = stream;
                window.localAudio.srcObject = stream;
                window.localAudio.autoplay = true;
            })
            .catch((err) => {
                console.error(`you got an error: ${err}`);
            });
    }

    function startApp() {
        appStart.setAppStart(true);
        getLocalStream();

        console.log("app started");
    }

    return (
        <div>
            <button onClick={startApp}>Start Trainer 🎶</button>
        </div>
    );
}

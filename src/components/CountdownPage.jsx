import React, { useEffect, useRef, useState } from "react";

export function CountdownPage({
    setShowCountdown,
    setGameStart,
    setTrainerOfGame,
}) {
    const [countdown, setCountdown] = useState(3);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    
        intervalRef.current = setInterval(() => {
            setCountdown((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
    
                    setTrainerOfGame("game");
                    setGameStart(true);
                    setShowCountdown(false);
                }
    
                return prevTime - 1;
            });
        }, 1000);
    }, [])
    
    return (
        <div className="countdown-page-wrapper">
            <div>{countdown}</div>
        </div>
    );
}

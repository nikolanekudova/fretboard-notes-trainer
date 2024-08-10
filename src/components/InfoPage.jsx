import React from "react";

export function InfoPage({ message }) {
    return (
        // <div className="correct-page-wrapper">
        <div className={message == "✅" ? "correct-page-wrapper" : "end-page-wrapper"}>
            <div>{message}</div>
        </div>
    );
}

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

export function Inputs({ setTrainerStart, setGameStart, trainerOrGame }) {
    const {
        strings,
        setStrings,
        notes,
        setNotes,
        chromaticNatural,
        setChromaticNatural,
        queryNotes,
        setQueryNotes,
        setShowInputs,
    } = useContext(AppContext);

    function startTrainer() {
        setShowInputs(false);

        if (trainerOrGame === "trainer") {
            setTrainerStart(true);
        } else {
            setGameStart(true);
        }
    }

    function changeChromaticNatural() {
        setChromaticNatural((prevState) => 
            prevState === "chromatic" ? "natural" : "chromatic"
        );
    }

    return (
        <div className="background-inputs-wrapper">
            <div className="inputs-wrapper">
                <h3>Set your {trainerOrGame} 🎸</h3>
                <div>
                    <div className="header-inputs">Strings</div>
                    <div className="strings-wrapper">
                        {Object.keys(strings).map((string) => (
                            <label key={string}>
                                <input
                                    type="checkbox"
                                    checked={strings[string]}
                                    onChange={() =>
                                        setStrings((prevState) => ({
                                            ...prevState,
                                            [string]: !prevState[string],
                                        }))
                                    }
                                />
                                {string}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="header-inputs">Notes</div>
                    <div className="notes-wrapper">
                        {Object.keys(notes)
                            .filter(
                                (note) =>
                                    chromaticNatural === "chromatic" ||
                                    !note.includes("#")
                            )
                            .map((note) => (
                                <label key={note}>
                                    <input
                                        type="checkbox"
                                        checked={notes[note]}
                                        onChange={() =>
                                            setNotes((prevState) => ({
                                                ...prevState,
                                                [note]: !prevState[note],
                                            }))
                                        }
                                    />
                                    {note}
                                </label>
                            ))}
                    </div>
                </div>
                <div>
                    <div className="header-inputs">Scale</div>
                    <div className="scale-wrapper">
                        <label>
                            <input
                                type="radio"
                                name="chromatic"
                                value="chromatic"
                                checked={chromaticNatural === "chromatic"}
                                onChange={changeChromaticNatural}
                            />
                            Chromatic
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="natural"
                                value="natural"
                                checked={chromaticNatural === "natural"}
                                onChange={changeChromaticNatural}
                            />
                            Natural
                        </label>
                    </div>
                </div>
                <div>
                    <div className="header-inputs">Query Notes</div>
                    <div className="scale-wrapper">
                        <label>
                            <input
                                type="checkbox"
                                checked={queryNotes}
                                onChange={() =>
                                    setQueryNotes((prevState) => !prevState)
                                }
                            />
                            Notes on 12th fret
                        </label>
                    </div>
                </div>
                <div className="inputs-btns-wrapper">
                    <button onClick={startTrainer}>Start 💣</button>
                    <button onClick={() => setShowInputs(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

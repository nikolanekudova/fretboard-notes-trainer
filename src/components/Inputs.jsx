import React from "react";

export function Inputs({
    strings = {},
    setStrings,
    notes = {},
    setNotes,
    chromaticNatural,
    changeChromaticNatural,
}) {
    return (
        <div className="inputs-wrapper">
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
                            checked={chromaticNatural === "chromatic"}
                            onChange={changeChromaticNatural}
                        />
                        Chromatic
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="natural"
                            checked={chromaticNatural === "natural"}
                            onChange={changeChromaticNatural}
                        />
                        Natural
                    </label>
                </div>
            </div>
        </div>
    );
}

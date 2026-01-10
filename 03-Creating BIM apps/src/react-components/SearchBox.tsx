import * as React from "react";

export function SearchBox() {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <bim-label className="material-icons-outlined">search</bim-label>
            <input type="text" placeholder="Search To-Do by name" />
        </div>
    );
}

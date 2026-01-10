import * as React from "react";

export function SearchBox() {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <span className="material-icons-outlined">search</span>
            <input type="text" placeholder="Search To-Do by name" />
        </div>
    );
}

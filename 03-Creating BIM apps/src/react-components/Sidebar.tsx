import * as React from "react";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside>
            <div id="sidebar">
                <img
                    id="company-logo"
                    src="/asset/company-logo.svg"
                    alt="Construction Company"
                />
                <ul id="nav-buttons">
                    <li id="projects-btn" onClick={() => navigate("/")}
                        role="button" tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                navigate("/");
                            }
                        }}
                    >
                        <span className="material-icons-outlined">home</span> Projects
                    </li>
                    <li id="security-btn">
                        <span className="material-icons-outlined">fingerprint</span> Security
                    </li>
                </ul>
            </div>
        </aside>
    );
}

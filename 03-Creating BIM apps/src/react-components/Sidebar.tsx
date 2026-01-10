import * as React from "react";
import { useNavigate } from "react-router-dom";
import { appIcons } from "../globals";

type BeamButtonElement = HTMLElement & {
    onclick: ((event: MouseEvent) => void) | null;
};

interface BeamButtonProps extends React.HTMLAttributes<HTMLElement> {
    label?: string;
    icon?: string;
    onclick?: (event: MouseEvent) => void;
}

function BeamButton({ onclick, ...props }: BeamButtonProps) {
    const ref = React.useRef<BeamButtonElement | null>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.onclick = onclick ?? null;
        }
    }, [onclick]);

    return <beam-button ref={ref} {...props}></beam-button>;
}

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
                    <BeamButton
                        id="projects-btn"
                        icon={appIcons.projects}
                        label="Projects"
                        onclick={() => navigate("/")}
                    ></BeamButton>
                    <BeamButton
                        id="security-btn"
                        icon={appIcons.security}
                        label="Security"
                    ></BeamButton>
                </ul>
            </div>
        </aside>
    );
}

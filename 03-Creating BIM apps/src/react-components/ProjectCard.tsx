import * as React from "react";
import { Project } from "../classes/Project";
import { appIcons } from "../globals";

interface ProjectCardProps {
    project: Project;
    onSelect: () => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
    return (
        <div className="project-card" onClick={onSelect}>
            <div className="card-header">
                <bim-label
                    className="project-icon"
                    style={{ backgroundColor: project.iconColor }}
                >
                    {project.getInitials()}
                </bim-label>
                <div>
                    <bim-label>{project.name}</bim-label>
                    <bim-label>{project.description}</bim-label>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                    <bim-label icon={appIcons.status} style={{ color: "#969696" }}>
                        Status
                    </bim-label>
                    <bim-label>{project.status}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label icon={appIcons.role} style={{ color: "#969696" }}>
                        Role
                    </bim-label>
                    <bim-label>{project.userRole}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label icon={appIcons.cost} style={{ color: "#969696" }}>
                        Cost
                    </bim-label>
                    <bim-label>{project.cost}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label icon={appIcons.progress} style={{ color: "#969696" }}>
                        Progress
                    </bim-label>
                    <bim-label>{project.progress}%</bim-label>
                </div>
            </div>
        </div>
    );
}

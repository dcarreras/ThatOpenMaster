import * as React from "react";
import { useNavigate } from "react-router-dom";
import { IProject, Project } from "../classes/Project";
import { ProjectCard } from "./ProjectCard";

interface ProjectsPageProps {
    projects: Project[];
    onOpenNewProject: () => void;
    onImportProjects: (projects: IProject[]) => void;
    onExportProjects: (filename: string) => void;
    onError: (message: string) => void;
}

export function ProjectsPage({
    projects,
    onOpenNewProject,
    onImportProjects,
    onExportProjects,
    onError
}: ProjectsPageProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredProjects = React.useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return projects;
        }
        return projects.filter((project) => {
            return project.name.toLowerCase().includes(query);
        });
    }, [projects, searchQuery]);

    const handleExport = () => {
        const filename = window.prompt("Enter the filename for the export:", "projects");
        if (!filename) {
            return;
        }
        onExportProjects(filename);
        alert("Projects exported successfully!");
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(reader.result as string) as IProject[];
                    if (!Array.isArray(parsed)) {
                        throw new Error("The selected file does not contain a project list.");
                    }
                    onImportProjects(parsed);
                    alert("Projects imported successfully!");
                } catch (error) {
                    const message = error instanceof Error
                        ? error.message
                        : "An error occurred during import.";
                    onError(message);
                }
            };
            reader.readAsText(file);
        };

        input.click();
    };

    return (
        <div className="page" id="projects-page" style={{ display: "block" }}>
            <header>
                <div className="projects-header">
                    <bim-label className="bim-h2">Projects</bim-label>
                    <div className="projects-search">
                        <span className="material-icons-outlined">search</span>
                        <input
                            type="search"
                            placeholder="Search projects by name..."
                            aria-label="Search projects by name"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                </div>
                <div className="projects-actions">
                    <button
                        id="import-projects-btn"
                        className="material-symbols-outlined action-icon"
                        onClick={handleImport}
                    >
                        download
                    </button>
                    <button
                        id="export-projects-btn"
                        className="material-symbols-outlined action-icon"
                        onClick={handleExport}
                    >
                        upload
                    </button>
                    <button id="new-project-btn" onClick={onOpenNewProject}>
                        Add New Project
                    </button>
                </div>
            </header>

            <div id="projects-list">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={() => navigate(`/projects/${project.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}

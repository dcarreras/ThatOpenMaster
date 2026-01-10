import * as React from "react";
import { useNavigate } from "react-router-dom";
import { IProject, Project } from "../classes/Project";
import { appIcons } from "../globals";
import { ProjectCard } from "./ProjectCard";

interface ProjectsPageProps {
    projects: Project[];
    onOpenNewProject: () => void;
    onImportProjects: (projects: IProject[]) => void;
    onExportProjects: (filename: string) => void;
    onError: (message: string) => void;
}

type BimButtonElement = HTMLElement & {
    onclick: ((event: MouseEvent) => void) | null;
};

interface BimButtonProps extends React.HTMLAttributes<HTMLElement> {
    label?: string;
    icon?: string;
    onclick?: (event: MouseEvent) => void;
}

function BimButton({ onclick, ...props }: BimButtonProps) {
    const ref = React.useRef<BimButtonElement | null>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.onclick = onclick ?? null;
        }
    }, [onclick]);

    return <bim-button ref={ref} {...props} />;
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
                    <beam-label className="bim-h2">Projects</beam-label>
                    <div className="projects-search">
                        <beam-text-input
                            icon={appIcons.search}
                            placeholder="Search projects by name..."
                            aria-label="Search projects by name"
                            debounce="1000"
                            value={searchQuery}
                            onInput={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.currentTarget as HTMLElement & { value?: string };
                                setSearchQuery(target.value ?? "");
                            }}
                        ></beam-text-input>
                    </div>
                </div>
                <div className="projects-actions">
                    <BimButton
                        id="import-projects-btn"
                        icon={appIcons.download}
                        label="Download"
                        onclick={handleImport}
                    />
                    <BimButton
                        id="export-projects-btn"
                        icon={appIcons.upload}
                        label="Upload"
                        onclick={handleExport}
                    />
                    <BimButton
                        id="new-project-btn"
                        icon={appIcons.create}
                        label="Add New Project"
                        onclick={onOpenNewProject}
                    />
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

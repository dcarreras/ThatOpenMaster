import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { IProject, ITodo, Project } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { ErrorDialog } from "./react-components/ErrorDialog";
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage";
import { ProjectFormDialog } from "./react-components/ProjectFormDialog";
import { ProjectsPage } from "./react-components/ProjectsPage";
import { Sidebar } from "./react-components/Sidebar";

const initialProjectsUrl = new URL("../export/projects_test_260103.json", import.meta.url);

export function App() {
    const projectsManagerRef = React.useRef(new ProjectsManager());
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const refreshProjects = React.useCallback(() => {
        setProjects(projectsManagerRef.current.getAllProjects());
    }, []);

    React.useEffect(() => {
        let isMounted = true;
        const loadInitialProjects = async () => {
            try {
                const response = await fetch(initialProjectsUrl);
                if (!response.ok) {
                    throw new Error(`Failed to load initial projects: ${response.status}`);
                }
                const projectsData = await response.json();
                if (!Array.isArray(projectsData)) {
                    throw new Error("Initial projects file is not an array.");
                }
                projectsManagerRef.current.importProjects(projectsData as IProject[]);
                if (isMounted) {
                    refreshProjects();
                }
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : "Failed to load initial projects.";
                setErrorMessage(message);
            }
        };

        void loadInitialProjects();

        return () => {
            isMounted = false;
        };
    }, [refreshProjects]);

    const handleOpenNewProject = () => {
        setEditingProjectId(null);
        setIsFormOpen(true);
    };

    const handleOpenEditProject = (projectId: string) => {
        setEditingProjectId(projectId);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProjectId(null);
    };

    const handleSaveProject = (data: IProject) => {
        try {
            if (editingProjectId) {
                projectsManagerRef.current.updateProject(editingProjectId, data);
            } else {
                projectsManagerRef.current.newProject(data);
            }
            refreshProjects();
            handleCloseForm();
        } catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred.";
            setErrorMessage(message);
        }
    };

    const handleImportProjects = (projectsData: IProject[]) => {
        try {
            projectsManagerRef.current.importProjects(projectsData);
            refreshProjects();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error importing projects.";
            setErrorMessage(message);
        }
    };

    const handleExportProjects = (filename: string) => {
        try {
            const data = projectsManagerRef.current.exportProjects();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error exporting projects.";
            setErrorMessage(message);
        }
    };

    const handleAddTodo = (projectId: string, todo: ITodo) => {
        try {
            projectsManagerRef.current.addTodo(projectId, todo);
            refreshProjects();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error adding todo.";
            setErrorMessage(message);
        }
    };

    const handleUpdateTodo = (projectId: string, todoIndex: number, updates: ITodo) => {
        try {
            projectsManagerRef.current.updateTodo(projectId, todoIndex, updates);
            refreshProjects();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error updating todo.";
            setErrorMessage(message);
        }
    };

    const editingProject = editingProjectId
        ? projects.find((project) => project.id === editingProjectId) ?? null
        : null;

    return (
        <>
            <Sidebar />
            <main id="content">
                <ProjectFormDialog
                    isOpen={isFormOpen}
                    project={editingProject}
                    onClose={handleCloseForm}
                    onSubmit={handleSaveProject}
                    onValidationError={(message) => setErrorMessage(message)}
                />
                <ErrorDialog
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProjectsPage
                                projects={projects}
                                onOpenNewProject={handleOpenNewProject}
                                onImportProjects={handleImportProjects}
                                onExportProjects={handleExportProjects}
                                onError={(message) => setErrorMessage(message)}
                            />
                        }
                    />
                    <Route
                        path="/projects/:projectId"
                        element={
                            <ProjectDetailsPage
                                projects={projects}
                                onEditProject={handleOpenEditProject}
                                onAddTodo={handleAddTodo}
                                onUpdateTodo={handleUpdateTodo}
                            />
                        }
                    />
                </Routes>
            </main>
        </>
    );
}

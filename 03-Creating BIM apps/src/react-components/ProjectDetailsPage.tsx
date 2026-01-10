import * as React from "react";
import { useParams } from "react-router-dom";
import { ITodo, Project } from "../classes/Project";
import { SearchBox } from "./SearchBox";
import { ThreeViewer } from "./ThreeViewer";

interface ProjectDetailsPageProps {
    projects: Project[];
    onEditProject: (projectId: string) => void;
    onAddTodo: (projectId: string, todo: ITodo) => void;
    onUpdateTodo: (projectId: string, todoIndex: number, updates: ITodo) => void;
}

export function ProjectDetailsPage({
    projects,
    onEditProject,
    onAddTodo,
    onUpdateTodo
}: ProjectDetailsPageProps) {
    const { projectId } = useParams();
    const project = projects.find((item) => item.id === projectId) ?? null;

    if (!project) {
        return (
            <div className="page" id="project-details" style={{ display: "flex" }}>
                <header>
                    <div>
                        <h2>Project not found</h2>
                        <p style={{ color: "#969696" }}>Select a project from the list.</p>
                    </div>
                </header>
            </div>
        );
    }

    const finishDate = project.finishDate instanceof Date
        ? project.finishDate
        : new Date(project.finishDate);
    const finishDateText = isNaN(finishDate.getTime())
        ? String(project.finishDate)
        : finishDate.toISOString().slice(0, 10);

    const progressValue = Number(project.progress);
    const clampedProgress = Math.min(100, Math.max(0, isNaN(progressValue) ? 0 : progressValue));

    const handleAddTodo = () => {
        const title = window.prompt("Enter the To-Do name:");
        const trimmedTitle = title ? title.trim() : "";
        if (!trimmedTitle) {
            return;
        }

        const dueDateInput = window.prompt("Enter a due date (YYYY-MM-DD) or leave blank:");
        const trimmedDate = dueDateInput ? dueDateInput.trim() : "";
        const statusInput = window.prompt("Enter status (pending, in-progress, done):", "pending");
        const trimmedStatus = statusInput ? statusInput.trim() : "";

        onAddTodo(project.id, {
            title: trimmedTitle,
            dueDate: trimmedDate ? trimmedDate : undefined,
            status: trimmedStatus ? trimmedStatus : undefined
        });
    };

    const renderTodoItems = () => {
        const todos = project.todos ?? [];
        return todos.map((todo, index) => {
            const statusValue = todo.status ? todo.status : "pending";
            let statusClass = statusValue.trim().toLowerCase().replace(/\s+/g, "-");
            if (!(["pending", "in-progress", "done"].includes(statusClass))) {
                statusClass = "pending";
            }
            const statusLabel = statusClass === "in-progress"
                ? "In Progress"
                : statusClass.charAt(0).toUpperCase() + statusClass.slice(1);
            const dateLabel = todo.dueDate ? todo.dueDate : "No date";

            return (
                <div
                    key={`${project.id}-todo-${index}`}
                    className={`todo-item todo-${statusClass}`}
                    style={{ color: "white" }}
                    onClick={() => {
                        const titleInput = window.prompt("Update the To-Do name:", todo.title);
                        if (titleInput === null) {
                            return;
                        }
                        const dateInput = window.prompt(
                            "Update the due date (YYYY-MM-DD) or leave blank:",
                            todo.dueDate ?? ""
                        );
                        if (dateInput === null) {
                            return;
                        }
                        const statusInput = window.prompt(
                            "Update status (pending, in-progress, done):",
                            todo.status ?? "pending"
                        );
                        if (statusInput === null) {
                            return;
                        }
                        onUpdateTodo(project.id, index, {
                            title: titleInput,
                            dueDate: dateInput,
                            status: statusInput
                        });
                    }}
                >
                    <div className="todo-row">
                        <span className="material-icons-outlined todo-icon">
                            construction
                        </span>
                        <div className="todo-text">
                            <p className="todo-title">{todo.title}</p>
                        </div>
                        <div className="todo-meta">
                            <p className="todo-date">{dateLabel}</p>
                            <p className="todo-status">{statusLabel}</p>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="page" id="project-details" style={{ display: "flex" }}>
            <header>
                <div>
                    <h2 id="detail-project-title">{project.name}</h2>
                    <p id="detail-project-description" style={{ color: "#969696" }}>
                        {project.description}
                    </p>
                </div>
                <button id="edit-project-btn" onClick={() => onEditProject(project.id)}>
                    Edit Project
                </button>
            </header>
            <div className="main-page-content">
                <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
                    <div className="dashboard-card" style={{ padding: "30px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: 30 }}>
                            <p
                                id="detail-project-icon"
                                style={{
                                    fontSize: 24,
                                    color: "white",
                                    backgroundColor: project.iconColor,
                                    borderRadius: "50%",
                                    width: 50,
                                    height: 50,
                                    textAlign: "center",
                                    lineHeight: "50px",
                                    padding: 10,
                                    cursor: "pointer",
                                    display: "inline-block"
                                }}
                            >
                                {project.getInitials()}
                            </p>
                            <button className="btn-secondary">
                                <p>Click Here</p>
                            </button>
                        </div>
                        <div style={{ padding: 30 }}>
                            <h2 id="detail-project-name">{project.name}</h2>
                            <p id="detail-project-summary">{project.description}</p>
                        </div>
                        <div style={{ display: "flex", columnGap: 30, padding: 30 }}>
                            <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-medium)" }}>Status</p>
                                <p id="detail-project-status">{project.status}</p>
                            </div>
                            <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-medium)" }}>Cost</p>
                                <p id="detail-project-cost">{project.cost.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-medium)" }}>Role</p>
                                <p id="detail-project-role">{project.userRole}</p>
                            </div>
                            <div>
                                <p style={{ color: "#969696", fontSize: "var(--font-medium)" }}>Finish Date</p>
                                <p id="detail-project-finish-date">{finishDateText}</p>
                            </div>
                        </div>
                        <div
                            style={{
                                marginTop: 20,
                                backgroundColor: "var(--background-100)",
                                borderRadius: 14,
                                padding: 30,
                                fontSize: 14
                            }}
                        >
                            <div
                                id="myProgress"
                                style={{
                                    width: `${clampedProgress}%`,
                                    height: 40,
                                    backgroundColor: "#2ecc71",
                                    borderRadius: 10,
                                    color: "#ecf0f1",
                                    lineHeight: "40px",
                                    textAlign: "center"
                                }}
                            >
                                {clampedProgress}%
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div
                            style={{
                                padding: "20px 30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <h4>To-Do</h4>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <SearchBox />
                                <span
                                    id="add-todo-btn"
                                    className="material-icons-outlined"
                                    style={{ cursor: "pointer" }}
                                    title="Add To-Do"
                                    role="button"
                                    onClick={handleAddTodo}
                                >
                                    add
                                </span>
                            </div>
                        </div>
                        <div
                            id="todo-list"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around"
                            }}
                        >
                            {renderTodoItems()}
                        </div>
                    </div>
                </div>
                <ThreeViewer />
            </div>
        </div>
    );
}

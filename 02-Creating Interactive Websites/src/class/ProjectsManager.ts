import { IProject, Project, ITodo }   from "./Project"

export class ProjectsManager{
    //Lista de proyectos
    list: Project[] = []
    ui : HTMLElement

    //Constructor de la clase
    constructor(container: HTMLElement){
        this.ui = container
    }

    //Metodo para crear un nuevo proyecto
    newProject(data: IProject) {
        const trimmedName = data.name.trim();
        if (trimmedName.length < 5) {
            throw new Error("Project name must be at least 5 characters long.");
        }

        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)
        
        // Adding an event listener to the project UI to handle clicks
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page");
            const detailsPage = document.getElementById("project-details");
            if (!(projectsPage && detailsPage)) { return; }
            this.updateProjectDetails(project);
            projectsPage.style.display = "none";
            detailsPage.style.display = "flex";
        });

        this.ui.append(project.ui)
        this.list.push(project)

        return project
    }

    updateProject(id: string, data: IProject) {
        const project = this.getProject(id);
        if (!project) {
            throw new Error("Project not found.");
        }

        const trimmedName = data.name.trim();
        if (trimmedName.length < 5) {
            throw new Error("Project name must be at least 5 characters long.");
        }

        const incomingId = typeof data.id === "string" ? data.id.trim() : "";
        if (incomingId && incomingId !== project.id) {
            const idInUse = this.list.some((existing) => existing.id === incomingId);
            if (idInUse) {
                throw new Error(`A project with the id "${incomingId}" already exists`);
            }
            project.id = incomingId;
        }

        const nameInUse = this.list.some((existing) => {
            return existing.id !== project.id && existing.name.trim() === trimmedName;
        });
        if (nameInUse) {
            throw new Error(`A project with the name "${trimmedName}" already exists`);
        }

        project.name = trimmedName;
        project.description = data.description;
        project.status = data.status;
        project.userRole = data.userRole;
        project.finishDate = data.finishDate;
        project.cost = data.cost;
        project.progress = data.progress;
        if (data.todos !== undefined) {
            project.setTodos(data.todos);
        }
        project.updateIconColor();
        project.updateUI();
        this.updateProjectDetails(project);

        return project;
    }

    addTodo(projectId: string, todo: ITodo) {
        const project = this.getProject(projectId);
        if (!project) {
            throw new Error("Project not found.");
        }
        project.addTodo(todo);
        this.updateProjectDetails(project);
        return project;
    }

    updateTodo(projectId: string, todoIndex: number, updates: ITodo) {
        const project = this.getProject(projectId);
        if (!project) {
            throw new Error("Project not found.");
        }
        project.updateTodo(todoIndex, updates);
        this.updateProjectDetails(project);
        return project;
    }

    private updateProjectDetails(project: Project) {
        const detailsPage = document.getElementById("project-details");
        if (detailsPage) {
            detailsPage.dataset.projectId = project.id;
        }

        const title = document.getElementById("detail-project-title");
        if (title) {
            title.textContent = project.name;
        }

        const description = document.getElementById("detail-project-description");
        if (description) {
            description.textContent = project.description;
        }

        const name = document.getElementById("detail-project-name");
        if (name) {
            name.textContent = project.name;
        }

        const summary = document.getElementById("detail-project-summary");
        if (summary) {
            summary.textContent = project.description;
        }

        const icon = document.getElementById("detail-project-icon");
        if (icon) {
            icon.textContent = project.getInitials();
            icon.style.backgroundColor = project.iconColor;
        }

        const status = document.getElementById("detail-project-status");
        if (status) {
            status.textContent = project.status;
        }

        const role = document.getElementById("detail-project-role");
        if (role) {
            role.textContent = project.userRole;
        }

        const cost = document.getElementById("detail-project-cost");
        if (cost) {
            cost.textContent = project.cost.toLocaleString();
        }

        const finishDate = document.getElementById("detail-project-finish-date");
        if (finishDate) {
            const dateValue = project.finishDate instanceof Date
                ? project.finishDate
                : new Date(project.finishDate);
            finishDate.textContent = isNaN(dateValue.getTime())
                ? String(project.finishDate)
                : dateValue.toISOString().slice(0, 10);
        }

        const progressBar = document.getElementById("myProgress") as HTMLElement | null;
        if (progressBar) {
            const progressValue = Number(project.progress);
            const clampedProgress = Math.min(100, Math.max(0, isNaN(progressValue) ? 0 : progressValue));
            progressBar.textContent = `${clampedProgress}%`;
            progressBar.style.width = `${clampedProgress}%`;
        }

        this.renderProjectTodos(project);
    }

    private renderProjectTodos(project: Project) {
        const list = document.getElementById("todo-list");
        if (!list) {
            return;
        }

        list.innerHTML = "";
        const todos = project.todos ?? [];
        todos.forEach((todo, index) => {
            const statusValue = todo.status ? todo.status : "pending";
            let statusClass = statusValue.trim().toLowerCase().replace(/\s+/g, "-");
            if (!["pending", "in-progress", "done"].includes(statusClass)) {
                statusClass = "pending";
            }
            const statusLabel = statusClass === "in-progress"
                ? "In Progress"
                : statusClass.charAt(0).toUpperCase() + statusClass.slice(1);
            const item = document.createElement("div");
            item.className = `todo-item todo-${statusClass}`;
            item.style.color = "white";
            const dateLabel = todo.dueDate ? todo.dueDate : "No date";
            item.innerHTML = `
                <div class="todo-row">
                    <span class="material-icons-outlined todo-icon">
                        construction
                    </span>
                    <div class="todo-text">
                        <p class="todo-title">${todo.title}</p>
                    </div>
                    <div class="todo-meta">
                        <p class="todo-date">${dateLabel}</p>
                        <p class="todo-status">${statusLabel}</p>
                    </div>
                </div>
            `;
            item.addEventListener("click", () => {
                const titleInput = prompt("Update the To-Do name:", todo.title);
                if (titleInput === null) {
                    return;
                }
                const dateInput = prompt("Update the due date (YYYY-MM-DD) or leave blank:", todo.dueDate ?? "");
                if (dateInput === null) {
                    return;
                }
                const statusInput = prompt("Update status (pending, in-progress, done):", todo.status ?? "pending");
                if (statusInput === null) {
                    return;
                }
                this.updateTodo(project.id, index, {
                    title: titleInput,
                    dueDate: dateInput,
                    status: statusInput
                });
            });
            list.appendChild(item);
        });
    }
   
    //Metodo para obtener un proyecto por su id
    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id;
        });
        return project || null; // Devuelve el proyecto encontrado o null si no se encuentra
    }

    //Metodo para obtener los nombres de los proyectos
    getProjectNames(): string[] {
        return this.list.map(project => project.name);
    }

    //Metodo para verificar si un nombre de proyecto ya existe
    checkProjectNameExists(name: string): boolean {
        return this.getProjectNames().includes(name);
    }

    //Metodo para eliminar un proyecto por su id
    deleteProject(id: string ){
        const project = this.getProject(id)
        if (!project){ return}  // Si no se encuentra el proyecto, salimos del método
        project.ui.remove() // Eliminamos la interfaz del proyecto

        const remaining = this.list.filter((project) => {
            return project.id !== id 
        })
        this.list = remaining

    }

    //Metodo para calcular el costo total de los proyectos
    calculateTotalCost(): number {
        return this.list.reduce((total, project) => total + project.cost, 0);
    }

    //Metodo para exportar la lista de proyectos a un archivo JSON
    exportToJSON(filename: string = "projects") {
        try {
            function replacer(key, value) {
                // Filtrando la propiedad 'ui'
                if (key === "ui") {
                    return undefined;
                }
                return value;
            }
            const jsonString = JSON.stringify(this.list, replacer, 2); // Convierte la lista de proyectos a una cadena JSON
            const blob = new Blob([jsonString], { type: "application/json" }); // Crea un blob con la cadena JSON
            const url = URL.createObjectURL(blob); // Crea una URL para el blob
            const a = document.createElement("a"); // Crea un nuevo elemento de anclaje
            a.href = url; // Establece la URL del blob en el elemento de anclaje
            a.download = filename; // Establece el nombre del archivo en el elemento de anclaje
            a.click(); // Simula un clic en el elemento de anclaje
            URL.revokeObjectURL(url); // Revoca la URL del blob
        } catch (error) {
            console.error("Error al exportar la lista de proyectos a JSON:", error);
        }
    }

    //Metodo para importar la lista de proyectos desde un archivo JSON
    importFromJSON(file: File) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const projects: IProject[] = JSON.parse(event.target?.result as string);
                projects.forEach(project => {
                    const projectId = typeof project.id === "string" ? project.id.trim() : "";
                    const existingProject = projectId
                        ? this.getAllProjects().find(existing => existing.id === projectId)
                        : null;
                    if (existingProject) {
                        this.updateProject(existingProject.id, project);
                        return;
                    }
                    const trimmedName = project.name ? project.name.trim() : "";
                    const existingByName = trimmedName
                        ? this.getAllProjects().find(existing => existing.name.trim() === trimmedName)
                        : null;
                    if (existingByName) {
                        this.updateProject(existingByName.id, project);
                        return;
                    }
                    this.newProject(project);
                });
            } catch (error) {
                console.error("Error importing projects:", error);
                alert(error.message); // Mostrar el mensaje de error al usuario
            }
        };
        reader.readAsText(file);
    }

    // Método para obtener todos los proyectos
    getAllProjects(): IProject[] {
        return this.list;
    }

}

import { IProject, Project, ITodo } from "./Project";

export class ProjectsManager {
    //Lista de proyectos
    private list: Project[] = [];

    //Metodo para crear un nuevo proyecto
    newProject(data: IProject) {
        const trimmedName = data.name.trim();
        if (trimmedName.length < 5) {
            throw new Error("Project name must be at least 5 characters long.");
        }

        const incomingId = typeof data.id === "string" ? data.id.trim() : "";
        if (incomingId) {
            const idInUse = this.list.some((project) => project.id === incomingId);
            if (idInUse) {
                throw new Error(`A project with the id "${incomingId}" already exists`);
            }
        }

        const nameInUse = this.list.some((project) => {
            return project.name.trim().toLowerCase() === trimmedName.toLowerCase();
        });
        if (nameInUse) {
            throw new Error(`A project with the name "${trimmedName}" already exists`);
        }

        const project = new Project({
            ...data,
            name: trimmedName,
            id: incomingId ? incomingId : data.id
        });
        this.list.push(project);

        return project;
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
            return existing.id !== project.id
                && existing.name.trim().toLowerCase() === trimmedName.toLowerCase();
        });
        if (nameInUse) {
            throw new Error(`A project with the name "${trimmedName}" already exists`);
        }

        const nameChanged = project.name.trim() !== trimmedName;
        project.name = trimmedName;
        project.description = data.description;
        project.status = data.status;
        project.userRole = data.userRole;
        const finishDateValue = data.finishDate instanceof Date
            ? data.finishDate
            : new Date(data.finishDate);
        project.finishDate = isNaN(finishDateValue.getTime()) ? new Date() : finishDateValue;
        project.cost = Number(data.cost) || 0;
        project.progress = Number(data.progress) || 0;
        if (data.todos !== undefined) {
            project.setTodos(data.todos);
        }
        if (data.iconColor) {
            project.iconColor = data.iconColor;
        } else if (nameChanged) {
            project.updateIconColor();
        }

        return project;
    }

    addTodo(projectId: string, todo: ITodo) {
        const project = this.getProject(projectId);
        if (!project) {
            throw new Error("Project not found.");
        }
        project.addTodo(todo);
        return project;
    }

    updateTodo(projectId: string, todoIndex: number, updates: ITodo) {
        const project = this.getProject(projectId);
        if (!project) {
            throw new Error("Project not found.");
        }
        project.updateTodo(todoIndex, updates);
        return project;
    }

    //Metodo para obtener un proyecto por su id
    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id;
        });
        return project || null;
    }

    //Metodo para obtener los nombres de los proyectos
    getProjectNames(): string[] {
        return this.list.map((project) => project.name);
    }

    //Metodo para verificar si un nombre de proyecto ya existe
    checkProjectNameExists(name: string): boolean {
        return this.getProjectNames().includes(name);
    }

    //Metodo para eliminar un proyecto por su id
    deleteProject(id: string) {
        const remaining = this.list.filter((project) => {
            return project.id !== id;
        });
        this.list = remaining;
    }

    //Metodo para calcular el costo total de los proyectos
    calculateTotalCost(): number {
        return this.list.reduce((total, project) => total + project.cost, 0);
    }

    importProjects(projects: IProject[]) {
        projects.forEach((project) => {
            const projectId = typeof project.id === "string" ? project.id.trim() : "";
            const existingProject = projectId
                ? this.getAllProjects().find((existing) => existing.id === projectId)
                : null;
            if (existingProject) {
                this.updateProject(existingProject.id, project);
                return;
            }
            const trimmedName = project.name ? project.name.trim() : "";
            const existingByName = trimmedName
                ? this.getAllProjects().find((existing) => existing.name.trim() === trimmedName)
                : null;
            if (existingByName) {
                this.updateProject(existingByName.id, project);
                return;
            }
            this.newProject(project);
        });
    }

    exportProjects(): IProject[] {
        return this.list.map((project) => project.toJSON());
    }

    // Modo para obtener todos los proyectos
    getAllProjects(): Project[] {
        return [...this.list];
    }
}

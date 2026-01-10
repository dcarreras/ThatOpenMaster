//Importacion de uuid para generar un id unico para cada proyecto
import { v4 as uuidv4 } from "uuid";

//Tipos para representar el estado y el rol de un usuario
export type ProjectStatus = "pending" | "active" | "finished";
export type UserRole =
    | "architect"
    | "structural engineer"
    | "mechanical engineer"
    | "electrical engineer"
    | "developer";

export type TodoStatus = "pending" | "in-progress" | "done";

export interface ITodo {
    title: string;
    dueDate?: string;
    status?: string;
}

//Interface para representar un proyecto
export interface IProject {
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date | string;
    cost: number;
    progress: number;
    todos?: ITodo[];
    id?: string;
    iconColor?: string;
}

//Clase para representar un proyecto
export class Project implements IProject {
    //Propiedades para satisfacer la interface IProject
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;
    cost: number;
    progress: number;
    todos: ITodo[];
    id: string;
    iconColor: string;

    private static iconColors = [
        "#ca8134",
        "#2ecc71",
        "#3498db",
        "#9b59b6",
        "#e74c3c",
        "#f1c40f"
    ];
    private static maxIconColors = 6;

    private static initialsColorMap: Record<string, string> = {};
    private static nextColorIndex = 0;

    private static getColorForInitials(initials: string): string {
        const key = initials.toUpperCase();
        if (Project.initialsColorMap[key]) {
            return Project.initialsColorMap[key];
        }
        const colors = Project.iconColors.slice(0, Project.maxIconColors);
        const color = colors[Project.nextColorIndex % colors.length];
        Project.nextColorIndex += 1;
        Project.initialsColorMap[key] = color;
        return color;
    }

    // Constructor para inicializar un proyecto con los datos proporcionados
    constructor(data: IProject) {
        const trimmedName = data.name ? data.name.trim() : "";
        this.name = trimmedName;
        this.description = data.description ?? "";
        this.status = data.status;
        this.userRole = data.userRole;
        const dateValue = data.finishDate instanceof Date
            ? data.finishDate
            : new Date(data.finishDate);
        this.finishDate = isNaN(dateValue.getTime()) ? new Date() : dateValue;
        this.cost = Number(data.cost) || 0;
        this.progress = Number(data.progress) || 0;
        this.todos = data.todos
            ? data.todos.map((todo) => Project.normalizeTodoInput(todo))
            : [];
        const incomingId = typeof data.id === "string" ? data.id.trim() : "";
        this.id = incomingId ? incomingId : uuidv4();
        const incomingColor = typeof data.iconColor === "string" ? data.iconColor.trim() : "";
        this.iconColor = incomingColor
            ? incomingColor
            : Project.getColorForInitials(this.getInitials());
    }

    // Metodo para calcular las iniciales del proyecto
    getInitials(): string {
        const words = this.name.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            return "NA";
        }
        if (words.length === 1) {
            return words[0].slice(0, 2);
        }
        return words.slice(0, 2).map((word) => word[0]).join("");
    }

    updateIconColor() {
        this.iconColor = Project.getColorForInitials(this.getInitials());
    }

    private static getTodayString(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    private static normalizeTodoStatus(value?: string): TodoStatus {
        const normalized = value ? value.trim().toLowerCase() : "";
        if (normalized === "in progress" || normalized === "in-progress" || normalized === "inprogress") {
            return "in-progress";
        }
        if (normalized === "done" || normalized === "completed" || normalized === "complete") {
            return "done";
        }
        return "pending";
    }

    private static normalizeTodoInput(todo: ITodo): ITodo {
        const title = todo.title ? todo.title.trim() : "";
        const dueDateValue = todo.dueDate ? todo.dueDate.trim() : "";
        return {
            title: title || "Untitled To-Do",
            dueDate: dueDateValue ? dueDateValue : Project.getTodayString(),
            status: Project.normalizeTodoStatus(todo.status)
        };
    }

    addTodo(todo: ITodo) {
        this.todos.push(Project.normalizeTodoInput(todo));
    }

    setTodos(todos: ITodo[]) {
        this.todos = todos.map((todo) => Project.normalizeTodoInput(todo));
    }

    updateTodo(index: number, updates: ITodo) {
        const current = this.todos[index];
        if (!current) {
            return;
        }
        const titleValue = updates.title ? updates.title.trim() : "";
        const dueDateValue = updates.dueDate !== undefined
            ? updates.dueDate.trim()
            : (current.dueDate ? current.dueDate.trim() : "");
        const statusValue = updates.status !== undefined ? updates.status : current.status;

        this.todos[index] = {
            title: titleValue || current.title || "Untitled To-Do",
            dueDate: dueDateValue ? dueDateValue : Project.getTodayString(),
            status: Project.normalizeTodoStatus(statusValue)
        };
    }

    toJSON(): IProject {
        return {
            name: this.name,
            description: this.description,
            status: this.status,
            userRole: this.userRole,
            finishDate: this.finishDate.toISOString(),
            cost: this.cost,
            progress: this.progress,
            todos: this.todos,
            id: this.id,
            iconColor: this.iconColor
        };
    }
}

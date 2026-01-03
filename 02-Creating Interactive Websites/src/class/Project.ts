//Importacion de uuid para generar un id unico para cada proyecto
import { v4 as uuidv4} from 'uuid' 

//Tipos para representar el estado y el rol de un usuario
export type ProjectStatus = "pending" | "active" | "finished";
export type UserRole = "architect" | "structural engineer" | "mechanical engineer" | "electrical engineer" |"developer";

export interface ITodo {
    title: string;
    dueDate?: string;
}

//Interface para representar un proyecto
export interface IProject {
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;
    cost: number;
    progress: number;
    todos?: ITodo[];
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
    ui: HTMLDivElement;
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
        // Iterar sobre los datos proporcionados y asignarlos a las propiedades correspondientes
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                this[key] = data[key];
            }
        }
        this.todos = data.todos ? [...data.todos] : [];
        this.id = uuidv4();
        const initials = this.getInitials();
        this.iconColor = Project.getColorForInitials(initials);
        this.setUI();
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

    addTodo(todo: ITodo) {
        const dueDateValue = todo.dueDate ? todo.dueDate.trim() : "";
        const dueDate = dueDateValue ? dueDateValue : Project.getTodayString();
        this.todos.push({
            title: todo.title,
            dueDate
        });
    }

    private getCardHTML(): string {
        const initials = this.getInitials();
        return `
            <div class="card-header">
                <span class="project-icon" style="background-color: ${this.iconColor};">${initials}</span>
                <div>
                    <h5>${this.name}</h5>
                    <p>${this.description}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                    <p style="color: #969696;">Status</p>
                    <p>${this.status}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Role</p>
                    <p>${this.userRole}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Cost</p>
                    <p>${this.cost}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Progress</p>
                    <p>${this.progress}%</p>
                </div>
            </div>
        `;
    }

    updateUI() {
        if (!this.ui) { return; }
        this.ui.innerHTML = this.getCardHTML();
    }

    //Metodo para establecer la interfaz de usuario del proyecto (DOM)
    setUI() {  
        if(this.ui){return}
        this.ui = document.createElement("div");
        this.ui.className = "project-card";
        this.updateUI();
    }
}

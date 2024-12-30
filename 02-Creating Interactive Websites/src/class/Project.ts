//Importacion de uuid para generar un id unico para cada proyecto
import { v4 as uuidv4} from 'uuid' 

//Tipos para representar el estado y el rol de un usuario
export type ProjectStatus = "pending" | "active" | "finished";
export type UserRole = "architect" | "structural engineer" | "mechanical engineer" | "electrical engineer" |"developer";

//Interface para representar un proyecto
export interface IProject {
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;
    cost: number;
    progress: number;
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
    ui: HTMLDivElement;
    id: string;


    constructor(data: IProject) {
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.userRole = data.userRole;
        this.finishDate = data.finishDate;
        this.cost = data.cost;
        this.progress = data.progress;
        this.id = uuidv4();
        this.setUI();
    }

    //Metodo para establecer la interfaz de usuario del proyecto (DOM)
    setUI() {  
        if(this.ui){return}
        this.ui = document.createElement("div");
        this.ui.className = "project-card";
        this.ui.innerHTML = `
            <div class="card-header">
                <p style="background-color: #ca8134; padding: 10px; border-radius: 8px;">PC1</p>
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
}

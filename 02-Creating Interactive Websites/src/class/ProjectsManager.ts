import { IProject, Project }   from "./Project"

export class ProjectsManager{
    list: Project[] = []
    ui : HTMLElement

    constructor(container: HTMLElement){
        this.ui = container
    }

    newProject(data: IProject) {
        try {
            this.validateProjectData(data); // Validamos los datos del proyecto
            
            const project = new Project(data);
            this.list.push(project);
            this.ui.append(project.ui);
            return project;
        } catch (error) {
            console.error("Error al crear el proyecto:", error.message); // Manejo del error
            alert(`Error: ${error.message}`); // Muestra el mensaje de error al usuario
            throw error; // Vuelve a lanzar el error para que pueda ser manejado en otro lugar si es necesario
        }
    }
    
    //Manejo de errores con Try Catch on un Metodo especifico.
    private validateProjectData(data: IProject) {
        if (!data.name || data.name.trim() === "") {
            throw new Error("El nombre del proyecto no puede estar vacío."); // Lanzamos un error si el nombre está vacío
        }
        
        if (this.checkProjectNameExists(data.name)) {
            throw new Error(`El nombre del proyecto "${data.name}" ya está en uso.`); // Lanzamos un error si el nombre ya existe
        }
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            project.id === id
        })
        return project || null; // Devuelve el proyecto encontrado o null si no se encuentra
    }

    getProjectNames(): string[] {
        return this.list.map(project => project.name);
    }

    
    checkProjectNameExists(name: string): boolean {
        return this.getProjectNames().includes(name);
    }

    

    deleteProject(id: string ){
        const project = this.getProject(id)
        if (!project){ return}  // Si no se encuentra el proyecto, salimos del método
        project.ui.remove() // Eliminamos la interfaz del proyecto

        const remaining = this.list.filter((project) => {
            return project.id !== id 
        })
        this.list = remaining

    }

    //Funcion para calcular el costo de todos los proyectos usando reduce
    calculateTotalCost(): number {
        return this.list.reduce((total, project) => total + project.cost, 0);
    }

    exportToJSON(){}

    improtToJSON(){}

}
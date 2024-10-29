import { IProject, Project }   from "./Project"

export class ProjectsManager{
    list: Project[] = []
    ui : HTMLElement

    constructor(container: HTMLElement){
        this.ui = container
    }

    newProject(data: IProject) {
        const project = new Project(data)
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            project.id === id
        })
        return project || null; // Devuelve el proyecto encontrado o null si no se encuentra
    }

    getProjectByName(name:String){
        const project = this.list.find((project)=> project.name === name); // Buscamos el proyecto por nombre
        return project || null; // Devuelve el proyecto encontrado o null si no se encuentra
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
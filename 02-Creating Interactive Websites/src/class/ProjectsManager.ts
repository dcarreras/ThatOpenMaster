import { IProject, Project }   from "./Project"

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
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)
        this.ui.append(project.ui)
        this.list.push(project)
        return project
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
            console.log("Current projects list:", this.list); // Verifica la lista de proyectos
            const jsonString = JSON.stringify(this.list, null, 2); // Convierte la lista de proyectos a una cadena JSON
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
                    // Verificar si el proyecto ya existe
                    if (this.getAllProjects().some(existingProject => existingProject.name === project.name)) {
                        throw new Error(`Project with name "${project.name}" already exists.`);
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
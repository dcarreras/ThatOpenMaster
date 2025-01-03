//Importacion de las clases y interfaces necesarias
import { Project, IProject, UserRole, ProjectStatus } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

//Funcion para mostrar un modal
function showModal(id: string) {
    const modal = document.getElementById(id);
    if (modal && modal instanceof HTMLDialogElement) {
        modal.showModal();
    } else {
        console.warn("The provided modal wasn't found. ID:", id);
    }
}

function closeModal(id: string) {
    const modal = document.getElementById(id);
    if (modal && modal instanceof HTMLDialogElement) {
        modal.close();
    } else {
        console.warn("The provided modal wasn't found. ID:", id);
    }
}

//Funcion para alternar la visibilidad de un modal
function toggleModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
        if (modal.open) { // Check if the modal is open
            modal.close(); // Close the modal
        } else {
            modal.showModal(); // Open the modal
        }
    } else {
        console.warn("The provided modal wasn't found. ID:", id);
    }
}

console.log("Script loaded");

//Elemento para contener la lista de proyectos
const projectListUI = document.getElementById("projects-list") as HTMLElement;
//Instancia de la clase ProjectsManager
const projectsManager = new ProjectsManager(projectListUI);

const newProjectBtn = document.getElementById("new-project-btn");
//Evento para alternar la visibilidad del modal de nuevo proyecto
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {
        toggleModal("new-project-modal");
    });
} else {
    console.warn("new-project-btn was not found");
}

const projectForm = document.getElementById('new-project-form') as HTMLFormElement;

const errorPopup = document.getElementById("error-popup") as HTMLDialogElement;
const errorMessage = document.getElementById("error-message") as HTMLElement;
const nextErrorBtn = document.getElementById("next-error-btn") as HTMLButtonElement;
const closeErrorBtn = document.getElementById("close-error-btn") as HTMLButtonElement;

let errorStep = 0; // Variable para rastrear el paso actual del error

//Evento para manejar el envio del formulario de nuevo proyecto
if (projectForm) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(projectForm);
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: new Date(formData.get("finishDate") as string),
            cost: parseFloat(formData.get("cost") as string) || 0,
            progress: parseInt(formData.get("progress") as string) || 0
        };
        
        // Validar que los campos numéricos no sean NaN
        if (isNaN(projectData.cost) || isNaN(projectData.progress)) {
            errorMessage.textContent = "Please enter valid numbers for cost and progress.";
            errorPopup.showModal();
            return;
        }

        //Intentar crear un nuevo proyecto
        try {
            const project = projectsManager.newProject(projectData);
            projectForm.reset();
            closeModal("new-project-modal");
        } catch (error) {
            console.error(error); // Mostrar el error en la consola
            errorMessage.textContent = error.message; // Mostrar el mensaje de error en el popup
            errorPopup.showModal(); // Mostrar el popup
            errorStep = 0; // Reiniciar el paso de error
        }
    });

    // Manejar el botón "Next"
    if (nextErrorBtn) {
        nextErrorBtn.addEventListener("click", () => {
            errorStep++;
            switch (errorStep) {
                case 1:
                    errorMessage.textContent = "Please check the project name it's not repeated"; // Mensaje para el paso 1
                    break;
                default:
                    errorPopup.close(); // Cerrar el popup si no hay más pasos
                    break;
            }
        });
    }

    // Manejar el botón "Close"
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener("click", () => {
            errorPopup.close(); // Cerrar el popup cuando se hace clic en cerrar
        });
    }
} else {
    console.warn("new-project-form was not found. Please check the id");
}

//Elemento para contener el boton de cancelar
const cancelBtn = document.getElementById("cancel-btn");
//Evento para cerrar el modal de nuevo proyecto
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        closeModal("new-project-modal"); // Cerrar el modal cuando se hace clic en cancelar
    });
} else {
    console.warn("Cancel Button was not found");
}

//Crear un proyecto por defecto
const defaultProjectData: IProject = {
    name: "PC-Default",
    description: "This is a default project",
    status: "pending", 
    userRole: "architect", 
    finishDate: new Date(),
    cost: 10000,
    progress: 0
};

//Crear y renderizar un proyecto por defecto solo si no existe
function renderDefaultProject() {
    console.log("Checking for existing default project...");

    const allProjects = projectsManager.getAllProjects();
    console.log("Current projects:", allProjects);

    const existingProject = allProjects.find(project => project.name === defaultProjectData.name);
    if (!existingProject) {
        console.log("No existing default project found. Creating a new one.");
        const defaultProject = projectsManager.newProject(defaultProjectData);
        // Renderizar el proyecto usando su propio método setUI
        const projectsList = document.getElementById("projects-list");
        if (projectsList) {
            projectsList.appendChild(defaultProject.ui);
        }
    } else {
        console.warn("Default project already exists and will not be duplicated.");
    }
}

renderDefaultProject();

//Elemento para contener el boton de EXPORTAR
const exportProjectsBtn = document.getElementById('export-projects-btn') as HTMLButtonElement;

// Verificar si el botón existe
if (exportProjectsBtn) {
    console.log('Export button found'); // Log para verificar que el botón fue encontrado
    exportProjectsBtn.addEventListener('click', () => {
        // Deshabilitar el botón para evitar múltiples clics
        exportProjectsBtn.disabled = true;
        // Pedir al usuario un nombre de archivo
        const filename = prompt("Enter the filename for the export:", "projects");

        if (filename) {
            try {
                console.log('Exportar proyectos'); // Log para verificar que el evento de clic se dispara
                projectsManager.exportToJSON(filename); // Llamada al método exportToJSON
                alert("Projects exported successfully!"); // Confirmación de éxito
            } catch (error) {
                alert("An error occurred during export. Please try again."); // Mensaje de error al usuario
            }
        }

        // Rehabilitar el botón después de la exportación
        exportProjectsBtn.disabled = false;
    });
} else {
    console.warn("Export button was not found");
}

//Elemento para contener el boton de IMPORTAR
const importProjectsBtn = document.getElementById('import-projects-btn') as HTMLButtonElement;

// Verificar si el botón existe
if (importProjectsBtn) {
    console.log('Import button found'); // Log para verificar que el botón fue encontrado
    importProjectsBtn.addEventListener('click', () => {
        // Crear un input de tipo archivo para seleccionar el archivo JSON
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        // Manejar el evento de cambio cuando se selecciona un archivo
        input.onchange = (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    console.log('Importar proyectos'); // Log para verificar que el evento de clic se dispara
                    projectsManager.importFromJSON(file); // Llamada al método importFromJSON
                    alert("Projects imported successfully!"); // Confirmación de éxito
                } catch (error) {
                    alert("An error occurred during import. Please try again."); // Mensaje de error al usuario
                }
            }
        };

        // Simular un clic en el input de archivo
        input.click();
    });
} else {
    console.warn("Import button was not found");
}

document.addEventListener('DOMContentLoaded', () => {
    const projectsPage = document.getElementById('projects-page');
    const detailsPage = document.getElementById('project-details');
    const projectsBtn = document.getElementById('projects-btn');

    if (!projectsPage) {
        console.error('Projects page not found');
    }
    if (!detailsPage) {
        console.error('Details page not found');
    }
    if (!projectsBtn) {
        console.error('Projects button not found');
    }

    if (!projectsPage || !detailsPage || !projectsBtn) {
        return;
    }

    console.log('Button and pages found');

    projectsBtn.addEventListener('click', () => {
        console.log('Projects button clicked');
        projectsPage.style.display = 'block';
        detailsPage.style.display = 'none';
    });
});

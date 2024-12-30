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
    name: "Default Project",
    description: "This is a default project",
    status: "pending", 
    userRole: "architect", 
    finishDate: new Date(),
    cost: 10000,
    progress: 0
};

//Crear un proyecto por defecto
const defaultProject = projectsManager.newProject(defaultProjectData);

//Funcion para renderizar la tarjeta de proyecto
function renderProjectCard(project: IProject) {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    
    projectCard.innerHTML = `
        <div class="card-header">
            <p style="background-color: #ca8134; padding: 10px; border-radius: 8px;">${project.name}</p>
            <div>
                <h5>${project.name}</h5>
                <p>${project.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${project.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${project.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${project.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Progress</p>
                <p>${project.progress}%</p>
            </div>
        </div>
    `;

    // Add the card to the projects list container
    const projectsList = document.getElementById("projects-list");
    if (projectsList) {
        projectsList.appendChild(projectCard);
    }
}

// Call the function to render the default project
renderProjectCard(defaultProject);

//Elemento para contener el boton de exportar
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



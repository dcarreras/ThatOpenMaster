import { Project, IProject, UserRole, ProjectStatus } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

// Function to show a modal
function showModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal();
  } else {
    console.warn("The provided modal wasn't found. ID:", id);
  }
}

// Function to close a modal
function closeModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close();
  } else {
    console.warn("The provided modal wasn't found. ID:", id);
  }
}

// New function to toggle the visibility of a modal
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

const projectListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectListUI);

// This document object is provided by the browser, and its main purpose is to help us 
const newProjectBtn = document.getElementById("new-project-btn");
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
      cost: parseFloat(formData.get("cost") as string),
      progress: parseInt(formData.get("progress") as string)
    };
    
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

// Add a click event to cancel the button 
const cancelBtn = document.getElementById("cancel-btn");
if(cancelBtn){
  cancelBtn.addEventListener("click",() =>{
    closeModal("new-project-modal"); // Close the modal when clicking cancel
  });
}else{
  console.warn("Cancel Button was not found")
}

// Create a default project card programmatically
const defaultProjectData: IProject = {
  name: "Default Project",
  description: "This is a default project",
  status: "pending", // Corrected to use the string value instead of the type
  userRole: "architect", // Corrected to use the string value instead of the type
  finishDate: new Date(),
  cost: 10000,
  progress: 0
};

const defaultProject = projectsManager.newProject(defaultProjectData);

// Function to render the project card
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

// Call the function to render the default project
renderProjectCard(defaultProject);

}



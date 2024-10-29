import { Project, IProject, UserRole, ProjectStatus } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

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

// Nueva función para alternar la visibilidad del modal
function toggleModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement;
  if (modal) {
    if (modal.open) { // Verifica si el modal está abierto
      modal.close(); // Cierra el modal
    } else {
      modal.showModal(); // Abre el modal
    }
  } else {
    console.warn("The provided modal wasn't found. ID:", id);
  }
}


const projectListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectListUI);

//This document object is provided by the browser, asnd it's main purpose to help us 
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal");
  });
} else {
  console.warn("new-project-btn was not found");
}

const projectForm = document.getElementById('new-project-form') as HTMLFormElement;

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
    const project = projectsManager.newProject(projectData);
    projectForm.reset();
    closeModal("new-project-modal");
  });

} else {
  console.warn("new-project-form was not found. Please check the id");
}

// Agregar un evento click para cancelar el boton 
const cancelBtn = document.getElementById("cancel-btn");
if(cancelBtn){
  cancelBtn.addEventListener("click",() =>{
    closeModal("new-project-modal"); // cierra el modal al hacer click en cancelar
  });
}else{
  console.warn("Cancel Button was not found")
}

// Crear una tarjeta de proyecto predeterminada programáticamente
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

// Función para renderizar la tarjeta del proyecto
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

// Agregar la tarjeta al contenedor de proyectos
const projectsList = document.getElementById("projects-list");
if (projectsList) {
  projectsList.appendChild(projectCard);
}

// Llamar a la función para renderizar el proyecto predeterminado
renderProjectCard(defaultProject);

}



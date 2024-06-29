import { Project } from "./class/Project";

function showModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    showModal("new-project-modal");
  });
} else {
  console.warn("new-project-btn was not found");
}

const projectForm = document.getElementById('formId') as HTMLFormElement;

if (projectForm) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);
    const projectData = {
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
      userRole: formData.get("userRole"),
      finishDate: formData.get("finishDate"),
    };
    const project = new Project(projectData);
    console.log(project);
  });
} else {
  console.warn("new-project-form was not found. Please check the id");
}


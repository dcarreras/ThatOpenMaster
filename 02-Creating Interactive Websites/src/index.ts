import { Project, IProject, UserRole, ProjectStatus} from "./class/Project";

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
    const projectData : IProject = {
      name: formData.get("name") as string,
      description: formData.get("description")as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate")as string),
    };
    const project = new Project(projectData);
    console.log(project);
  });
} else {
  console.warn("new-project-form was not found. Please check the id");
}


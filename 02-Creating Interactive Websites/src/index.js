import { Project } from "./class/Project"


// Definición de la función: showModal
function showModal(id){
    const modal = document.getElementById(id)
    if(modal){
        modal.showModal() // Muestra el modal si existe
    } else{
        console.warn("The provided modal wasn't found with the ID:", id)
    }
}

// Recuperar el botón para crear un nuevo proyecto
const newProjectBtn = document.getElementById("new-project-btn")
if(newProjectBtn){
    // Añadir evento de click al botón para mostrar el modal
    newProjectBtn.addEventListener("click",()=>{showModal("new-project-modal")}) 
}else{
    console.warn("new-project-btn was not found") // Advertir si el botón no se encuentra
}

// Recuperar el formulario para un nuevo proyecto
const projectForm = document.getElementById("new-project-form")
if(projectForm){
    // Añadir evento de submit al formulario
    projectForm.addEventListener("submit", (e)=>{
        e.preventDefault() // Evitar el envío normal del formulario
        const formData = new FormData(projectForm) // Crear FormData a partir del formulario
        // Crear un objeto proyecto con los datos del formulario
        const projectData = {
            name: formData.get("name"), // Asumiendo que hay un campo 'name' en el formulario
            description: formData.get("description"), // Obtener la descripción
            status: formData.get("status"), // Obtener el estado
            userRole: formData.get("userRole"), // Obtener el rol del usuario
            finishDate: formData.get("finishDate") // Obtener la fecha de finalización           
        };
        const project = new Project(projectData)
        console.log(project)
    })
}else{
    console.warn("new-project-form was not found. Please check the id") // Advertir si el formulario no se encuentra
}

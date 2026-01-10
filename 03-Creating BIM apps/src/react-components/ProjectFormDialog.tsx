import * as React from "react";
import { IProject, Project, ProjectStatus, UserRole } from "../classes/Project";

interface ProjectFormDialogProps {
    isOpen: boolean;
    project: Project | null;
    onClose: () => void;
    onSubmit: (data: IProject) => void;
    onValidationError: (message: string) => void;
}

interface FormValues {
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: string;
    cost: string;
    progress: string;
}

const emptyForm: FormValues = {
    name: "",
    description: "",
    status: "pending",
    userRole: "architect",
    finishDate: "",
    cost: "",
    progress: ""
};

const roleOptions: { value: UserRole; label: string }[] = [
    { value: "architect", label: "Architect" },
    { value: "structural engineer", label: "Structural Engineer" },
    { value: "mechanical engineer", label: "Mechanical Engineer" },
    { value: "electrical engineer", label: "Electrical Engineer" },
    { value: "developer", label: "Developer" }
];

const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "finished", label: "Finished" }
];

export function ProjectFormDialog({
    isOpen,
    project,
    onClose,
    onSubmit,
    onValidationError
}: ProjectFormDialogProps) {
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);
    const [formValues, setFormValues] = React.useState<FormValues>(emptyForm);

    React.useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) {
            return;
        }
        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else if (dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }
        if (project) {
            const finishDateValue = project.finishDate instanceof Date
                ? project.finishDate
                : new Date(project.finishDate);
            const finishDate = isNaN(finishDateValue.getTime())
                ? ""
                : finishDateValue.toISOString().slice(0, 10);
            setFormValues({
                name: project.name,
                description: project.description,
                status: project.status,
                userRole: project.userRole,
                finishDate,
                cost: String(project.cost),
                progress: String(project.progress)
            });
        } else {
            setFormValues(emptyForm);
        }
    }, [project, isOpen]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const costValue = Number(formValues.cost);
        const progressValue = Number(formValues.progress);
        if (Number.isNaN(costValue) || Number.isNaN(progressValue)) {
            onValidationError("Please enter valid numbers for cost and progress.");
            return;
        }
        const finishDate = formValues.finishDate
            ? new Date(formValues.finishDate)
            : new Date();

        onSubmit({
            name: formValues.name,
            description: formValues.description,
            status: formValues.status,
            userRole: formValues.userRole,
            finishDate,
            cost: costValue,
            progress: progressValue
        });
    };

    return (
        <dialog id="new-project-modal" ref={dialogRef} onClose={onClose}>
            <form id="new-project-form" onSubmit={handleSubmit}>
                <bim-label className="bim-h2">
                    {project ? "Edit Project" : "New Project"}
                </bim-label>
                <div className="input-list">
                    <div className="form-field-container">
                        <label
                            htmlFor="project-name"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                domain
                            </bim-label>
                            Name
                        </label>
                        <input
                            name="name"
                            id="project-name"
                            type="text"
                            placeholder="What's the name of your project?"
                            style={{ paddingLeft: 30 }}
                            value={formValues.name}
                            onChange={handleChange}
                        />
                        <bim-label
                            className="bim-h5"
                            style={{
                                fontFamily: "unset",
                                color: "grey",
                                fontSize: 10,
                                fontStyle: "italic",
                                paddingTop: 5
                            }}
                        >
                            TIP: Give it a short name
                        </bim-label>
                    </div>

                    <div className="form-field-container">
                        <label
                            htmlFor="project-description"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                sort
                            </bim-label>
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="project-description"
                            cols={30}
                            rows={5}
                            placeholder="Enter Project Description"
                            value={formValues.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-field-container">
                        <label
                            htmlFor="project-role"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                person
                            </bim-label>
                            Role
                        </label>
                        <select
                            name="userRole"
                            id="project-role"
                            value={formValues.userRole}
                            onChange={handleChange}
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field-container">
                        <label
                            htmlFor="project-status"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                question_mark
                            </bim-label>
                            Status
                        </label>
                        <select
                            name="status"
                            id="project-status"
                            value={formValues.status}
                            onChange={handleChange}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field-container">
                        <label
                            htmlFor="finish-date"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                event
                            </bim-label>
                            Finish Date
                        </label>
                        <input
                            name="finishDate"
                            id="finish-date"
                            type="date"
                            style={{
                                color: "white",
                                backgroundColor: "var(--background-200)",
                                padding: 15,
                                borderRadius: 8,
                                border: "none",
                                fontSize: "var(--font-base)"
                            }}
                            value={formValues.finishDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field-container">
                        <label
                            htmlFor="project-cost"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                attach_money
                            </bim-label>
                            Cost
                        </label>
                        <input
                            name="cost"
                            id="project-cost"
                            type="number"
                            placeholder="Enter Project Cost"
                            style={{ paddingLeft: 30 }}
                            value={formValues.cost}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field-container">
                        <label
                            htmlFor="project-progress"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Sublima, sans-serif",
                                color: "white"
                            }}
                        >
                            <bim-label className="material-icons-outlined" style={{ marginRight: 5 }}>
                                trending_up
                            </bim-label>
                            Progress
                        </label>
                        <input
                            name="progress"
                            id="project-progress"
                            type="number"
                            placeholder="Enter Project Progress"
                            style={{ paddingLeft: 30 }}
                            min={0}
                            max={100}
                            value={formValues.progress}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <button
                            id="cancel-btn"
                            type="button"
                            style={{ backgroundColor: "transparent", color: "white" }}
                            onMouseOver={(event) => {
                                event.currentTarget.style.backgroundColor = "#444";
                            }}
                            onMouseOut={(event) => {
                                event.currentTarget.style.backgroundColor = "transparent";
                            }}
                            onClick={() => dialogRef.current?.close()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ backgroundColor: "green", color: "white" }}
                            onMouseOver={(event) => {
                                event.currentTarget.style.backgroundColor = "#0f0";
                            }}
                            onMouseOut={(event) => {
                                event.currentTarget.style.backgroundColor = "green";
                            }}
                        >
                            {project ? "Save" : "Accept"}
                        </button>
                    </div>
                </div>
            </form>
        </dialog>
    );
}

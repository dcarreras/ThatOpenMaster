export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface  IProject {
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;
}

export class Project implements IProject {
    name: string;
    description: string;
    status: "pending" | "active" | "finished";
    userRole: "architect" | "engineer" | "developer";
    finishDate: Date;
  
    constructor(data: IProject) {
      this.name = data.name;
      this.description = data.description;
      this.status = data.status;
      this.userRole = data.userRole;
      this.finishDate = data.finishDate;
      const card = document.createElement("div")
    }
  }
  
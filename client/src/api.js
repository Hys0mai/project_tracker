import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export const getProjects = () => api.get("/projects");
export const getProject = (publicId) => api.get(`/projects/${publicId}`);
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (publicId, data) =>
    api.put(`/projects/${publicId}`, data);
export const deleteProject = (publicId) => api.delete(`/projects/${publicId}`);
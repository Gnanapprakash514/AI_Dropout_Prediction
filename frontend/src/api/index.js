import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const predictStudent = (data) => api.post("/predict", data);
export const predictBulk = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/predict-bulk", form);
};
export const getStudents = () => api.get("/students");
export const getStudentPrediction = (studentId) => api.get(`/predictions/student/${studentId}`);
export const getPredictions = () => api.get("/predictions");
export const getDashboard = () => api.get("/dashboard");
export const getHighRisk = () => api.get("/high-risk");
export const postCounselling = (data) => api.post("/counselling", data);
export const postFollowup = (data) => api.post("/followup", data);

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------
// PRD Generator
// ---------------------------------------------

export async function generatePRD(): Promise<string> {
  const response = await api.post("/prd/generate");

  return response.data.prd;
}

export default api;
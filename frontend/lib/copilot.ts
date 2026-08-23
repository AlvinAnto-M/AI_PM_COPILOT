import api from "./api";

export async function askCopilot(
  message: string
): Promise<string> {
  try {
    const response = await api.post("/copilot", {
      message: message,
    });

    return response.data.answer;

  } catch (error: any) {
    console.error("Copilot API Error:", error);

    if (error.response) {
      console.error(
        "Backend response:",
        error.response.data
      );
    }

    throw error;
  }
}
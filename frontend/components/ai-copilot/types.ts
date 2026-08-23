export interface Message {
  id: number;
  sender: "user" | "assistant";
  text: string;
  timestamp?: string;
}

export interface SuggestedPrompt {
  id: number;
  title: string;
  prompt: string;
}
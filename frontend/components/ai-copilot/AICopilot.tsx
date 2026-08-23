"use client";

import { useState } from "react";

import { askCopilot } from "@/lib/copilot";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";
import TypingIndicator from "./TypingIndicator";

import { Message } from "./types";

export default function AICopilot() {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text:
        "👋 Hello! I'm your AI Product Manager Copilot.\n\n" +
        "I can help you:\n\n" +
        "• Generate Product Requirement Documents (PRDs)\n" +
        "• Generate User Stories\n" +
        "• Create Acceptance Criteria\n" +
        "• Prioritize Features\n" +
        "• Summarize Customer Feedback\n" +
        "• Analyze Issue Clusters\n\n" +
        "Select a suggested prompt above or ask me anything.",
    },
  ]);

  const [typing, setTyping] = useState(false);

  // -------------------------------------------------
  // Send Message
  // -------------------------------------------------

  const handleSendMessage = async (text: string) => {

    if (!text.trim()) return;

    // Add user message

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTyping(true);

    try {

      const answer = await askCopilot(text);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        sender: "assistant",
        text: answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {

      console.error(err);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "assistant",
        text: "❌ Sorry, I couldn't contact the AI Copilot.",
      };

      setMessages((prev) => [...prev, errorMessage]);

    } finally {

      setTyping(false);

    }
  };

  // -------------------------------------------------
  // Suggested Prompt
  // -------------------------------------------------

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[850px] flex flex-col">

      <ChatHeader />

      <div className="flex-1 overflow-hidden">

        <ChatMessages
          messages={messages}
        />

        {typing && <TypingIndicator />}

      </div>

      <SuggestedPrompts
        onSelectPrompt={handleSuggestedPrompt}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
      />

    </div>

  );

}
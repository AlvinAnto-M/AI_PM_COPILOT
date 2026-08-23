"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({
  onSendMessage,
}: ChatInputProps) {

  const [message, setMessage] = useState("");

  const handleSend = () => {

    const text = message.trim();

    if (!text) return;

    onSendMessage(text);

    setMessage("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (e.key === "Enter") {
      handleSend();
    }

  };

  return (

    <div className="border-t border-slate-200 bg-white p-4">

      <div className="flex gap-3">

        <input
          type="text"
          value={message}
          placeholder="Ask your AI Product Manager..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 flex items-center gap-2 transition"
        >

          <SendHorizonal size={18} />

          <span>Send</span>

        </button>

      </div>

    </div>

  );

}
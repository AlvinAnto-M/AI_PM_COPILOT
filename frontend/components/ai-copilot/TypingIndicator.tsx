"use client";

import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-5 py-3">

      {/* AI Avatar */}
      <div className="bg-blue-600 p-2 rounded-full">
        <Bot
          className="text-white"
          size={18}
        />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">

        <p className="text-sm text-slate-500 mb-2">
          AI is thinking...
        </p>

        <div className="flex gap-2">

          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>

          <span
            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>

          <span
            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>

        </div>

      </div>

    </div>
  );
}
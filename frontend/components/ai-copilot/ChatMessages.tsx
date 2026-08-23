"use client";

import { Bot, User } from "lucide-react";
import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({
  messages,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 p-5 h-[450px] overflow-y-auto bg-slate-50">

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >

          {/* AI Message */}

          {message.sender === "assistant" && (
            <div className="flex gap-3 max-w-[80%]">

              <div className="bg-blue-600 p-2 rounded-full h-fit">
                <Bot
                  className="text-white"
                  size={18}
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">

                <p className="text-slate-700 whitespace-pre-wrap">
                  {message.text}
                </p>

                {message.timestamp && (
                  <p className="text-xs text-slate-400 mt-2">
                    {message.timestamp}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* User Message */}

          {message.sender === "user" && (
            <div className="flex gap-3 max-w-full">

              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm max-w-4xl">
                <User
                  className="text-white"
                  size={18}
                />
              </div>

              <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm">

                <p className="whitespace-pre-wrap">
                  {message.text}
                </p>

                {message.timestamp && (
                  <p className="text-xs text-blue-100 mt-2">
                    {message.timestamp}
                  </p>
                )}

              </div>

            </div>
          )}

        </div>
      ))}

    </div>
  );
}
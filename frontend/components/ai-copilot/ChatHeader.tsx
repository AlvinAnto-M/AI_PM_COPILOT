"use client";

import { Bot, Sparkles, Circle } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="border-b border-slate-200 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        {/* Left Side */}
        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-3 rounded-xl">
            <Bot className="text-white" size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              AI Product Manager Copilot
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <Circle
                size={10}
                className="fill-green-500 text-green-500"
              />

              <span className="text-sm text-slate-600">
                Online
              </span>
            </div>
          </div>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border">

          <Sparkles
            className="text-purple-600"
            size={18}
          />

          <span className="text-sm font-medium text-slate-700">
            Gemini AI
          </span>

        </div>

      </div>

      {/* Description */}

      <p className="text-slate-500 text-sm mt-4">
        Ask about customer feedback, generate PRDs, create user stories,
        prioritize features, or analyze product issues.
      </p>

    </div>
  );
}
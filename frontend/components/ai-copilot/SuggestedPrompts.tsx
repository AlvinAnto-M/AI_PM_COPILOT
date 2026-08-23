"use client";

import { SuggestedPrompt } from "./types";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts: SuggestedPrompt[] = [
  {
    id: 1,
    title: "📄 Generate PRD",
    prompt: "Generate a Product Requirements Document for the uploaded customer feedback dataset.",
  },
  {
    id: 2,
    title: "📝 User Stories",
    prompt: "Generate user stories from the uploaded customer feedback.",
  },
  {
    id: 3,
    title: "✅ Acceptance Criteria",
    prompt: "Generate acceptance criteria for the identified issues.",
  },
  {
    id: 4,
    title: "🚀 Prioritize Features",
    prompt: "Prioritize product features using the RICE framework.",
  },
  {
    id: 5,
    title: "📊 Summarize Feedback",
    prompt: "Summarize the uploaded customer feedback.",
  },
  {
    id: 6,
    title: "🔥 High Priority Issues",
    prompt: "Show only the high priority issues from the uploaded dataset.",
  },
];

export default function SuggestedPrompts({
  onSelectPrompt,
}: SuggestedPromptsProps) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 p-4">

      <h3 className="text-sm font-semibold text-slate-600 mb-3">
        Suggested Prompts
      </h3>

      <div className="flex flex-wrap gap-3">

        {prompts.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectPrompt(item.prompt)}
            className="px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-blue-600 hover:text-white transition text-sm font-medium"
          >
            {item.title}
          </button>
        ))}

      </div>

    </div>
  );
}
"use client";

import {
  FileText,
  ListChecks,
  Target,
  MessageSquare,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface ProductModulesProps {
  onOpenModule?: (module: string) => void;
}

export default function ProductModules({
  onOpenModule,
}: ProductModulesProps) {
  const router = useRouter();

  const modules = [
    {
      id: "chat",
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description:
        "Ask questions about customer feedback, trends, clusters, and product insights.",
    },

    {
      id: "prd",
      icon: FileText,
      title: "PRD Generator",
      description:
        "Generate structured Product Requirement Documents using customer feedback and Generative AI.",
    },

    {
      id: "user-stories",
      icon: ListChecks,
      title: "User Stories & Acceptance Criteria",
      description:
        "Automatically generate user stories and detailed acceptance criteria from identified product issues.",
    },

    {
      id: "prioritization",
      icon: Target,
      title: "Feature Prioritization",
      description:
        "Prioritize product features using RICE, MoSCoW, and configurable weighted scoring frameworks.",
    },

    {
      id: "roadmap",
      icon: CalendarDays,
      title: "Product Roadmap",
      description:
        "Build an AI-powered product roadmap by organizing prioritized initiatives into immediate, near-term, and later milestones.",
    },
  ];

  const handleOpenModule = (module: string) => {
    // --------------------------------------------------
    // Product Roadmap
    // --------------------------------------------------

    if (module === "roadmap") {
      router.push("/roadmap");
      return;
    }

    // --------------------------------------------------
    // Other modules
    // --------------------------------------------------

    onOpenModule?.(module);
  };

  return (
    <section className="mt-8">
      {/* Header */}

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">
          Product Management Tools
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use AI-powered tools to transform customer feedback into actionable
          product decisions.
        </p>
      </div>

      {/* Modules */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => handleOpenModule(module.id)}
              className="group text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              {/* Icon + Arrow */}

              <div className="flex items-start justify-between">
                <div className="bg-blue-50 text-blue-600 rounded-xl p-3">
                  <Icon size={24} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                />
              </div>

              {/* Title */}

              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                {module.title}
              </h3>

              {/* Description */}

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {module.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
} 
"use client";

import {
  FileText,
  ListChecks,
  Target,
  MessageSquare,
  ArrowRight,
  Lightbulb,
  Map,
} from "lucide-react";

import Link from "next/link";

interface ProductModulesProps {
  onOpenModule?: (module: string) => void;
}

export default function ProductModules({
  onOpenModule,
}: ProductModulesProps) {
  const modules = [
    {
      id: "chat",
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description:
        "Ask questions about customer feedback, trends, clusters, and product insights.",
      route: "/",
    },

    {
      id: "prd",
      icon: FileText,
      title: "PRD Generator",
      description:
        "Generate structured Product Requirement Documents using customer feedback and Generative AI.",
      route: "/prd-generator",
    },

    {
      id: "user-stories",
      icon: ListChecks,
      title: "User Stories & Acceptance Criteria",
      description:
        "Automatically generate user stories and detailed acceptance criteria from identified product issues.",
      route: "/user-stories",
    },

    {
      id: "prioritization",
      icon: Target,
      title: "Feature Prioritization",
      description:
        "Prioritize product features using RICE, MoSCoW, and configurable weighted scoring frameworks.",
      route: "/prioritization",
    },

    {
      id: "roadmap",
      icon: Map,
      title: "Product Roadmap",
      description:
        "Create an evidence-based product roadmap by organizing prioritized initiatives into milestones.",
      route: "/roadmap",
    },

    {
      id: "strategy",
      icon: Lightbulb,
      title: "Product Strategy Reports",
      description:
        "Generate evidence-based product strategy reports for individual customer issue clusters.",
      route: "/strategy",
    },
  ];

  return (
    <section className="mt-8">
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Product Management Tools
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use AI-powered tools to transform customer feedback into actionable
          product decisions.
        </p>
      </div>

      {/* Module Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.id}
              href={module.route}
              className="group block text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
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
            </Link>
          );
        })}
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flag,
  Loader2,
  MessageSquare,
  RefreshCw,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import { getRoadmap, RoadmapItem } from "@/lib/roadmap";

interface RoadmapProps {
  onBack?: () => void;
}

export default function Roadmap({ onBack }: RoadmapProps) {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // Fetch Roadmap
  // ==========================================================

  async function fetchRoadmap() {
    try {
      setLoading(true);
      setError("");

      const response = await getRoadmap();

      if (response.success) {
        setRoadmap(response.roadmap);
      } else {
        setError("Unable to generate roadmap.");
      }
    } catch (err) {
      console.error("Failed to load roadmap:", err);

      setError("Failed to connect to the roadmap service.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // Initial Load
  // ==========================================================

  useEffect(() => {
    fetchRoadmap();
  }, []);

  // ==========================================================
  // Group Roadmap Items
  // ==========================================================

  const milestone1 = roadmap.filter(
    (item) => item.recommended_milestone === "Milestone 1"
  );

  const milestone2 = roadmap.filter(
    (item) => item.recommended_milestone === "Milestone 2"
  );

  const milestone3 = roadmap.filter(
    (item) => item.recommended_milestone === "Milestone 3"
  );

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={36}
            className="animate-spin text-blue-600"
          />

          <p className="text-slate-500">
            Generating product roadmap...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ==================================================
            Header
        ================================================== */}

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">

            {onBack && (
              <button
                onClick={onBack}
                className="mt-1 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <div>
              <div className="flex items-center gap-3">

                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={28} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Product Roadmap
                  </h1>

                  <p className="mt-1 text-slate-500">
                    AI-powered roadmap recommendations based on customer
                    feedback and product priorities.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Refresh */}

          <button
            onClick={fetchRoadmap}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* ==================================================
            Error
        ================================================== */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {/* ==================================================
            Summary Cards
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <SummaryCard
            icon={<Target size={22} />}
            title="Total Initiatives"
            value={roadmap.length}
          />

          <SummaryCard
            icon={<Flag size={22} />}
            title="Immediate"
            value={milestone1.length}
          />

          <SummaryCard
            icon={<Clock3 size={22} />}
            title="Near Term"
            value={milestone2.length}
          />

          <SummaryCard
            icon={<TrendingUp size={22} />}
            title="Later"
            value={milestone3.length}
          />

        </div>

        {/* ==================================================
            Roadmap
        ================================================== */}

        <div className="space-y-8">

          {/* Milestone 1 */}

          <MilestoneSection
            title="Milestone 1"
            subtitle="Immediate priorities"
            description="High-impact initiatives that should be addressed first."
            emptyMessage="No immediate priorities identified."
            emptyDescription="No issues currently meet the threshold for immediate action."
            items={milestone1}
            icon={<Flag size={22} />}
          />

          {/* Milestone 2 */}

          <MilestoneSection
            title="Milestone 2"
            subtitle="Near-term priorities"
            description="Important initiatives that should follow the immediate priorities."
            emptyMessage="No near-term priorities identified."
            emptyDescription="There are currently no initiatives recommended for the near-term."
            items={milestone2}
            icon={<Clock3 size={22} />}
          />

          {/* Milestone 3 */}

          <MilestoneSection
            title="Milestone 3"
            subtitle="Later priorities"
            description="Lower-priority initiatives that can be planned after higher-impact work."
            emptyMessage="No later priorities identified."
            emptyDescription="There are currently no initiatives recommended for later planning."
            items={milestone3}
            icon={<CalendarDays size={22} />}
          />

        </div>

        {/* ==================================================
            Empty State
        ================================================== */}

        {roadmap.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <CalendarDays
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-semibold text-slate-700">
              No roadmap initiatives yet
            </h2>

            <p className="mt-2 text-slate-500">
              Analyze customer feedback first to generate roadmap
              recommendations.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}

// ============================================================
// Summary Card
// ============================================================

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">

      <div className="flex items-center gap-3">

        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-800">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
}

// ============================================================
// Milestone Section
// ============================================================

function MilestoneSection({
  title,
  subtitle,
  description,
  emptyMessage,
  emptyDescription,
  items,
  icon,
}: {
  title: string;
  subtitle: string;
  description: string;
  emptyMessage: string;
  emptyDescription: string;
  items: RoadmapItem[];
  icon: React.ReactNode;
}) {
  return (
    <section>

      {/* Section Header */}

      <div className="flex items-center gap-3 mb-4">

        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>

          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

      </div>

      <p className="text-slate-500 mb-5">
        {description}
      </p>

      {/* ==================================================
          Items
      ================================================== */}

      {items.length === 0 ? (

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">

          <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <CheckCircle2
              size={24}
              className="text-slate-400"
            />
          </div>

          <p className="mt-4 text-slate-600 font-medium">
            {emptyMessage}
          </p>

          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            {emptyDescription}
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {items.map((item) => (
            <RoadmapCard
              key={item.cluster_id}
              item={item}
            />
          ))}

        </div>

      )}

    </section>
  );
}

// ============================================================
// Roadmap Card
// ============================================================

function RoadmapCard({
  item,
}: {
  item: RoadmapItem;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

      {/* Top */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600 text-white font-bold">
            {item.rank}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              {item.initiative}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Cluster #{item.cluster_id}
            </p>
          </div>

        </div>

        {/* Score */}

        <div className="text-right">

          <p className="text-xs text-slate-400 uppercase tracking-wide">
            Roadmap Score
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {item.roadmap_score.toFixed(1)}
          </p>

        </div>

      </div>

      {/* Metrics */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <Metric
          icon={<MessageSquare size={17} />}
          label="Feedback"
          value={item.feedback_count}
        />

        <Metric
          icon={<Target size={17} />}
          label="Priority"
          value={
            item.priority_score !== null
              ? item.priority_score.toFixed(1)
              : "N/A"
          }
        />

        <Metric
          icon={<TrendingUp size={17} />}
          label="RICE"
          value={
            item.rice_score !== null
              ? item.rice_score.toFixed(1)
              : "N/A"
          }
        />

        <Metric
          icon={<AlertTriangle size={17} />}
          label="Escalated"
          value={item.escalated_count}
        />

      </div>

      {/* Priority Distribution */}

      <div className="mt-5 flex flex-wrap gap-2">

        <Badge
          label="High"
          value={item.priority.high}
        />

        <Badge
          label="Medium"
          value={item.priority.medium}
        />

        <Badge
          label="Low"
          value={item.priority.low}
        />

      </div>

      {/* Recommendation */}

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-5">

        <div className="flex items-start gap-3">

          <CheckCircle2
            size={20}
            className="mt-0.5 text-green-600"
          />

          <div>

            <p className="font-semibold text-slate-700">
              Recommended: {item.timeframe}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {item.reason}
            </p>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between">

        <span className="text-sm text-slate-500">

          Recommended for{" "}

          <span className="font-semibold text-slate-700">
            {item.recommended_milestone}
          </span>

        </span>

        <ChevronRight
          size={20}
          className="text-slate-400"
        />

      </div>

    </div>
  );
}

// ============================================================
// Metric
// ============================================================

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        {icon}

        <span className="text-xs">
          {label}
        </span>

      </div>

      <p className="mt-1 text-lg font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

// ============================================================
// Badge
// ============================================================

function Badge({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-600">
      {label}: {value}
    </span>
  );
}
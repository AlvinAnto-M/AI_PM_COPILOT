"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileText,
  Lightbulb,
  Loader2,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import {
  generateProductStrategy,
  getStrategyClusters,
  StrategyCluster,
  ProductStrategy,
} from "@/lib/strategy";


// ============================================================
// Component
// ============================================================

export default function StrategyReports() {
  const [clusters, setClusters] = useState<StrategyCluster[]>([]);

  const [selectedCluster, setSelectedCluster] =
    useState<number | null>(null);

  const [strategy, setStrategy] =
    useState<ProductStrategy | null>(null);

  const [loadingClusters, setLoadingClusters] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  // ==========================================================
  // Load Clusters
  // ==========================================================

  useEffect(() => {
    async function loadClusters() {
      try {
        setLoadingClusters(true);
        setError(null);

        const data =
          await getStrategyClusters();

        setClusters(data);

        // Automatically select first cluster
        if (data.length > 0) {
          setSelectedCluster(data[0].cluster_id);
        }

      } catch (err) {
        console.error(
          "Failed to load strategy clusters:",
          err
        );

        setError(
          "Unable to load issue clusters."
        );

      } finally {
        setLoadingClusters(false);
      }
    }

    loadClusters();
  }, []);


  // ==========================================================
  // Generate Strategy
  // ==========================================================

  async function handleGenerate() {
    if (selectedCluster === null) {
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      setStrategy(null);

      const result =
        await generateProductStrategy(
          selectedCluster
        );

      if (!result.success) {
        throw new Error(
          "Strategy generation failed."
        );
      }

      setStrategy(
        result.strategy
      );

    } catch (err) {
      console.error(
        "Strategy generation failed:",
        err
      );

      setError(
        "Unable to generate the Product Strategy Report. Please try again."
      );

    } finally {
      setGenerating(false);
    }
  }


  // ==========================================================
  // Selected Cluster
  // ==========================================================

  const selectedClusterData =
    clusters.find(
      (cluster) =>
        cluster.cluster_id === selectedCluster
    );


  // ==========================================================
  // Loading State
  // ==========================================================

  if (loadingClusters) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2
              size={22}
              className="animate-spin"
            />

            <span>
              Loading issue clusters...
            </span>
          </div>
        </div>
      </main>
    );
  }


  // ==========================================================
  // Main UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ================================================== */}
        {/* Header */}
        {/* ================================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-5"
          >
            <ArrowLeft size={17} />

            Back
          </button>

          <div className="flex items-start gap-4">

            <div className="bg-blue-100 text-blue-600 rounded-2xl p-3">
              <Lightbulb size={28} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Product Strategy Reports
              </h1>

              <p className="mt-2 text-slate-500 max-w-3xl">
                Generate evidence-based product strategy reports
                for individual customer issue clusters.
              </p>

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* Error */}
        {/* ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}


        {/* ================================================== */}
        {/* Generator Card */}
        {/* ================================================== */}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <FileText
              className="text-blue-600"
              size={23}
            />

            <div>

              <h2 className="text-xl font-semibold text-slate-900">
                Generate Product Strategy
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Select an issue cluster to generate a
                cluster-specific strategy report.
              </p>

            </div>

          </div>


          {/* Cluster Selection */}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Issue Cluster
              </label>

              <select
                value={
                  selectedCluster ?? ""
                }
                onChange={(event) => {
                  setSelectedCluster(
                    Number(event.target.value)
                  );

                  setStrategy(null);
                  setError(null);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                {clusters.map((cluster) => (
                  <option
                    key={cluster.cluster_id}
                    value={cluster.cluster_id}
                  >
                    {cluster.theme} (
                    {cluster.feedback_count} feedback)
                  </option>
                ))}

              </select>

            </div>


            {/* Generate Button */}

            <button
              type="button"
              disabled={
                selectedCluster === null ||
                generating
              }
              onClick={handleGenerate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >

              {generating ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Generating...
                </>
              ) : (
                <>
                  <Zap size={18} />

                  Generate Strategy
                </>
              )}

            </button>

          </div>


          {/* Selected Cluster Information */}

          {selectedClusterData && (

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

              <Metric
                icon={Users}
                label="Feedback"
                value={
                  selectedClusterData.feedback_count
                }
              />

              <Metric
                icon={Target}
                label="High Priority"
                value={
                  selectedClusterData.high_priority
                }
              />

              <Metric
                icon={ShieldAlert}
                label="Escalated"
                value={
                  selectedClusterData.escalated_count
                }
              />

              <Metric
                icon={TrendingUp}
                label="RICE Score"
                value={
                  selectedClusterData.rice_score
                }
              />

            </div>

          )}

        </section>


        {/* ================================================== */}
        {/* Empty State */}
        {/* ================================================== */}

        {!strategy && !generating && (

          <section className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="mx-auto w-fit bg-blue-50 text-blue-600 rounded-2xl p-4 mb-4">

              <Lightbulb size={30} />

            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              Product Strategy Report
            </h2>

            <p className="mt-2 text-slate-500 max-w-xl mx-auto">
              Select an issue cluster above and generate a
              strategy report based on the actual customer
              feedback and product analysis.
            </p>

          </section>

        )}


        {/* ================================================== */}
        {/* Strategy Report */}
        {/* ================================================== */}

        {generating && (

          <section className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <Loader2
              size={32}
              className="animate-spin text-blue-600 mx-auto"
            />

            <h2 className="mt-5 text-xl font-semibold text-slate-800">
              Generating Product Strategy...
            </h2>

            <p className="mt-2 text-slate-500">
              Analyzing customer feedback and product signals.
            </p>

          </section>

        )}


        {strategy && (

          <StrategyReport
            strategy={strategy}
          />

        )}

      </div>

    </main>
  );
}


// ============================================================
// Metric Component
// ============================================================

interface MetricProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

function Metric({
  icon: Icon,
  label,
  value,
}: MetricProps) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">

      <div className="flex items-center gap-2 text-slate-500 text-sm">

        <Icon size={16} />

        {label}

      </div>

      <div className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </div>

    </div>
  );
}


// ============================================================
// Strategy Report Component
// ============================================================

interface StrategyReportProps {
  strategy: ProductStrategy;
}

function StrategyReport({
  strategy,
}: StrategyReportProps) {

  const evidence =
    strategy.customer_evidence;

  return (

    <div className="space-y-6">

      {/* ================================================== */}
      {/* Report Header */}
      {/* ================================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

        <div className="flex items-center gap-3">

          <div className="bg-blue-100 text-blue-600 rounded-xl p-3">
            <BarChart3 size={25} />
          </div>

          <div>

            <p className="text-sm text-blue-600 font-medium">
              Product Strategy Report
            </p>

            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {strategy.theme}
            </h2>

          </div>

        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

          <Metric
            icon={Users}
            label="Feedback"
            value={
              evidence.feedback_count
            }
          />

          <Metric
            icon={Target}
            label="Priority Score"
            value={
              evidence.priority_score
            }
          />

          <Metric
            icon={TrendingUp}
            label="RICE"
            value={
              evidence.rice_score
            }
          />

          <Metric
            icon={ShieldAlert}
            label="Escalated"
            value={
              evidence.escalated_count
            }
          />

        </div>

      </section>


      {/* ================================================== */}
      {/* Executive Summary */}
      {/* ================================================== */}

      <ReportSection
        title="Executive Summary"
        icon={FileText}
      >
        <p>
          {strategy.executive_summary}
        </p>
      </ReportSection>


      {/* ================================================== */}
      {/* Problem Definition */}
      {/* ================================================== */}

      <ReportSection
        title="Problem Definition"
        icon={Target}
      >
        <p>
          {strategy.problem_definition}
        </p>
      </ReportSection>


      {/* ================================================== */}
      {/* Customer Pain Points */}
      {/* ================================================== */}

      <ReportSection
        title="Customer Pain Points"
        icon={Users}
      >

        <BulletList
          items={
            strategy.customer_pain_points
          }
        />

      </ReportSection>


      {/* ================================================== */}
      {/* Customer Evidence */}
      {/* ================================================== */}

      <ReportSection
        title="Customer Evidence"
        icon={BarChart3}
      >

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <EvidenceMetric
            label="Feedback"
            value={
              evidence.feedback_count
            }
          />

          <EvidenceMetric
            label="High Priority"
            value={
              evidence.high_priority
            }
          />

          <EvidenceMetric
            label="Medium Priority"
            value={
              evidence.medium_priority
            }
          />

          <EvidenceMetric
            label="Low Priority"
            value={
              evidence.low_priority
            }
          />

          <EvidenceMetric
            label="Escalated"
            value={
              evidence.escalated_count
            }
          />

          <EvidenceMetric
            label="Reach"
            value={
              evidence.reach
            }
          />

          <EvidenceMetric
            label="Impact"
            value={
              evidence.impact
            }
          />

          <EvidenceMetric
            label="Effort"
            value={
              evidence.effort
            }
          />

        </div>


        {evidence.important_patterns &&
          evidence.important_patterns.length > 0 && (

            <div>

              <h3 className="font-semibold text-slate-800 mb-3">
                Important Patterns
              </h3>

              <BulletList
                items={
                  evidence.important_patterns
                }
              />

            </div>

          )}

      </ReportSection>


      {/* ================================================== */}
      {/* Strategic Importance */}
      {/* ================================================== */}

      <ReportSection
        title="Strategic Importance"
        icon={TrendingUp}
      >

        <p>
          {strategy.strategic_importance}
        </p>

      </ReportSection>


      {/* ================================================== */}
      {/* Product Goal */}
      {/* ================================================== */}

      <ReportSection
        title="Product Goal"
        icon={Target}
      >

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

          <p className="text-blue-900 font-medium leading-7">
            {strategy.product_goal}
          </p>

        </div>

      </ReportSection>


      {/* ================================================== */}
      {/* Strategic Objectives */}
      {/* ================================================== */}

      <ReportSection
        title="Strategic Objectives"
        icon={CheckCircle2}
      >

        <BulletList
          items={
            strategy.strategic_objectives
          }
        />

      </ReportSection>


      {/* ================================================== */}
      {/* Recommended Strategy */}
      {/* ================================================== */}

      <ReportSection
        title="Recommended Product Strategy"
        icon={Lightbulb}
      >

        <p>
          {strategy.recommended_product_strategy}
        </p>

      </ReportSection>


      {/* ================================================== */}
      {/* Key Initiatives */}
      {/* ================================================== */}

      <ReportSection
        title="Key Product Initiatives"
        icon={Zap}
      >

        <div className="space-y-4">

          {strategy.key_product_initiatives.map(
            (initiative, index) => (

              <div
                key={index}
                className="border border-slate-200 rounded-xl p-5"
              >

                <h3 className="font-semibold text-slate-900">
                  {index + 1}. {initiative.title}
                </h3>

                <p className="mt-2 text-slate-600 leading-7">
                  {initiative.description}
                </p>

                <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3">

                  <p className="text-sm text-emerald-800">
                    <span className="font-semibold">
                      Expected Customer Benefit:
                    </span>{" "}
                    {initiative.expected_customer_benefit}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </ReportSection>


      {/* ================================================== */}
      {/* Success Metrics */}
      {/* ================================================== */}

      <ReportSection
        title="Success Metrics"
        icon={TrendingUp}
      >

        <BulletList
          items={
            strategy.success_metrics
          }
        />

      </ReportSection>


      {/* ================================================== */}
      {/* Risks */}
      {/* ================================================== */}

      <ReportSection
        title="Risks & Considerations"
        icon={ShieldAlert}
      >

        <BulletList
          items={
            strategy.risks_and_considerations
          }
        />

      </ReportSection>


      {/* ================================================== */}
      {/* Expected Customer Impact */}
      {/* ================================================== */}

      <ReportSection
        title="Expected Customer Impact"
        icon={Users}
      >

        <BulletList
          items={
            strategy.expected_customer_impact
          }
        />

      </ReportSection>


      {/* ================================================== */}
      {/* Recommended Next Steps */}
      {/* ================================================== */}

      <ReportSection
        title="Recommended Next Steps"
        icon={CheckCircle2}
      >

        <BulletList
          items={
            strategy.recommended_next_steps
          }
        />

      </ReportSection>

    </div>
  );
}


// ============================================================
// Report Section
// ============================================================

interface ReportSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function ReportSection({
  title,
  icon: Icon,
  children,
}: ReportSectionProps) {

  return (

    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

      <div className="flex items-center gap-3 mb-5">

        <div className="bg-blue-50 text-blue-600 rounded-lg p-2">

          <Icon size={19} />

        </div>

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

      </div>

      <div className="text-slate-700 leading-7">
        {children}
      </div>

    </section>
  );
}


// ============================================================
// Bullet List
// ============================================================

function BulletList({
  items,
}: {
  items: string[];
}) {

  if (!items || items.length === 0) {

    return (
      <p className="text-slate-500">
        No information available.
      </p>
    );
  }

  return (

    <ul className="space-y-3">

      {items.map(
        (item, index) => (

          <li
            key={index}
            className="flex gap-3"
          >

            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

            <span className="leading-7">
              {item}
            </span>

          </li>

        )
      )}

    </ul>
  );
}


// ============================================================
// Evidence Metric
// ============================================================

function EvidenceMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {

  return (

    <div className="rounded-xl border border-slate-200 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}
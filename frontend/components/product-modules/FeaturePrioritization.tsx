"use client";

import { useEffect, useState } from "react";
import {
  Target,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  ShieldCheck,
} from "lucide-react";

import {
  getPrioritization,
  PrioritizedFeature,
} from "@/lib/prioritization";

export default function FeaturePrioritization() {
  const [features, setFeatures] = useState<PrioritizedFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPrioritization() {
    try {
      setLoading(true);
      setError("");

      const data = await getPrioritization();

      if (data.success) {
        setFeatures(data.prioritization || []);
      } else {
        setError(data.message || "Failed to load prioritization.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrioritization();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-4">

            <div className="bg-blue-50 text-blue-600 rounded-xl p-3">
              <Target size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Feature Prioritization
              </h1>

              <p className="mt-1 text-slate-500">
                Prioritize product opportunities using the RICE framework.
              </p>
            </div>

          </div>

          <button
            onClick={loadPrioritization}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>

        {/* RICE Explanation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">

          <div className="flex items-center gap-3 mb-4">

            <TrendingUp className="text-blue-600" />

            <h2 className="text-xl font-semibold text-slate-800">
              RICE Prioritization
            </h2>

          </div>

          <p className="text-slate-500 mb-5">
            Features are ranked using Reach, Impact, Confidence, and Effort.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                <span className="font-semibold">Reach</span>
              </div>

              <p className="text-sm text-slate-500 mt-2">
                Number of feedback records representing the issue.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" />
                <span className="font-semibold">Impact</span>
              </div>

              <p className="text-sm text-slate-500 mt-2">
                Estimated impact based on customer priority.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                <span className="font-semibold">Confidence</span>
              </div>

              <p className="text-sm text-slate-500 mt-2">
                Confidence based on available feedback volume.
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-orange-600" />
                <span className="font-semibold">Effort</span>
              </div>

              <p className="text-sm text-slate-500 mt-2">
                Estimated implementation complexity.
              </p>
            </div>

          </div>

          <div className="mt-5 p-4 bg-slate-50 rounded-xl text-center">

            <span className="font-semibold text-slate-700">
              RICE Score =
            </span>

            <span className="ml-2 text-blue-600 font-semibold">
              (Reach × Impact × Confidence) ÷ Effort
            </span>

          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-slate-500">
              Calculating feature priorities...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && !error && features.length > 0 && (

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-200">

              <h2 className="text-xl font-semibold text-slate-800">
                Prioritized Features
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {features.length} product opportunities ranked by RICE score.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Rank
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Feature
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Reach
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Impact
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Confidence
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Effort
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      RICE Score
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {features.map((feature) => (

                    <tr
                      key={feature.cluster_id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >

                      {/* Rank */}
                      <td className="px-5 py-5">

                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                            feature.rank === 1
                              ? "bg-blue-600 text-white"
                              : feature.rank === 2
                              ? "bg-blue-100 text-blue-700"
                              : feature.rank === 3
                              ? "bg-slate-200 text-slate-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {feature.rank}
                        </div>

                      </td>

                      {/* Feature */}
                      <td className="px-5 py-5">

                        <div className="font-semibold text-slate-800">
                          {feature.feature}
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                          Cluster {feature.cluster_id} ·{" "}
                          {feature.feedback_count} feedback
                        </div>

                      </td>

                      {/* Reach */}
                      <td className="px-5 py-5 text-center">
                        {feature.reach}
                      </td>

                      {/* Impact */}
                      <td className="px-5 py-5 text-center">
                        {feature.impact.toFixed(2)}
                      </td>

                      {/* Confidence */}
                      <td className="px-5 py-5 text-center">

                        {Math.round(feature.confidence * 100)}%

                      </td>

                      {/* Effort */}
                      <td className="px-5 py-5 text-center">
                        {feature.effort}
                      </td>

                      {/* RICE */}
                      <td className="px-5 py-5 text-center">

                        <span className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold">

                          {feature.rice_score.toFixed(2)}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* Empty */}
        {!loading && !error && features.length === 0 && (

          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <Target
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-700">
              No prioritization data
            </h3>

            <p className="mt-2 text-slate-500">
              Analyze a customer feedback dataset first.
            </p>

          </div>

        )}

      </div>
    </div>
  );
}
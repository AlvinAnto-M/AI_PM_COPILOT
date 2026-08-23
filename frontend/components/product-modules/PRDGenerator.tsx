"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  getClusters,
  generatePRD,
  Cluster,
} from "@/lib/prd";

export default function PRDGenerator() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] =
    useState<number | null>(null);

  const [prd, setPrd] = useState("");

  const [loadingClusters, setLoadingClusters] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  // -----------------------------------------
  // Load clusters
  // -----------------------------------------

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      setLoadingClusters(true);
      setError("");

      const data = await getClusters();

      setClusters(data);

      // Automatically select first cluster
      if (data.length > 0) {
        setSelectedCluster(data[0].cluster_id);
      }

    } catch (err) {
      console.error(err);

      setError(
        "Unable to load customer issue themes. Please analyze a dataset first."
      );

    } finally {
      setLoadingClusters(false);
    }
  };

  // -----------------------------------------
  // Generate PRD
  // -----------------------------------------

  const handleGeneratePRD = async () => {
    if (selectedCluster === null) {
      return;
    }

    try {
      setGenerating(true);
      setError("");

      const result = await generatePRD(selectedCluster);

      setPrd(result.prd);

    } catch (err) {
      console.error(err);

      setError(
        "Unable to generate the PRD. Please make sure the backend is running."
      );

    } finally {
      setGenerating(false);
    }
  };

  // -----------------------------------------
  // Selected cluster information
  // -----------------------------------------

  const selectedClusterData = clusters.find(
    (cluster) =>
      cluster.cluster_id === selectedCluster
  );

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">

        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-3 rounded-xl">
            <FileText
              className="text-white"
              size={24}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              PRD Generator
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Generate a Product Requirements Document from customer feedback.
            </p>
          </div>

        </div>

      </div>


      {/* Content */}

      <div className="p-6">

        {/* Error */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

            <AlertCircle
              className="text-red-500 mt-0.5"
              size={20}
            />

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>
        )}


        {/* Cluster Selection */}

        <div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Customer Issue / Theme
          </label>

          {loadingClusters ? (

            <div className="flex items-center gap-2 text-sm text-slate-500 py-3">

              <Loader2
                size={18}
                className="animate-spin"
              />

              Loading customer issues...

            </div>

          ) : clusters.length === 0 ? (

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-500">
              No customer issue clusters are available.
              Please upload and analyze a dataset first.
            </div>

          ) : (

            <select
              value={selectedCluster ?? ""}
              onChange={(e) =>
                setSelectedCluster(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              {clusters.map((cluster) => (

                <option
                  key={cluster.cluster_id}
                  value={cluster.cluster_id}
                >

                  {cluster.name}

                </option>

              ))}

            </select>

          )}

        </div>


        {/* Selected Cluster Information */}

        {selectedClusterData && (

          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Selected Customer Issue
                </p>

                <p className="mt-1 text-base font-semibold text-slate-900">
                  {selectedClusterData.name}
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-500">
                  Feedback
                </p>

                <p className="text-lg font-semibold text-blue-600">
                  {selectedClusterData.feedback_count}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* Generate Button */}

        <div className="mt-5">

          <button
            onClick={handleGeneratePRD}
            disabled={
              selectedCluster === null ||
              generating ||
              loadingClusters
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {generating ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Generating PRD...

              </>

            ) : (

              <>
                <Sparkles size={18} />

                Generate PRD

              </>

            )}

          </button>

        </div>


        {/* Generated PRD */}

        {prd && (

          <div className="mt-8">

            <div className="flex items-center justify-between mb-3">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Generated Product Requirements Document
                </h3>

                {selectedClusterData && (
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedClusterData.name}
                  </p>
                )}

              </div>

            </div>


            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">

              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">
                {prd}
              </pre>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FileText,
  Sparkles,
  Download,
  Save,
  Loader2,
  ChevronDown,
} from "lucide-react";

interface Cluster {
  id: number;
  cluster_id: number;
  name: string;
  theme: string;
  feedback_count: number;
  issue_count: number;
}

export default function PRDGeneratorPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  const [prd, setPrd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClusters, setLoadingClusters] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------------------
  // Load clusters
  // -----------------------------------------

  useEffect(() => {
    async function fetchClusters() {
      try {
        setLoadingClusters(true);

        const response = await api.get("/clusters");

        const data = response.data?.clusters;

        if (Array.isArray(data)) {
          setClusters(data);

          // Select first cluster automatically
          if (data.length > 0) {
            setSelectedCluster(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load clusters:", err);
        setError("Failed to load clusters.");
      } finally {
        setLoadingClusters(false);
      }
    }

    fetchClusters();
  }, []);

  // -----------------------------------------
  // Generate PRD
  // -----------------------------------------

  async function generatePRD() {
    if (selectedCluster === null) {
      setError("Please select a cluster.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPrd("");

      const response = await api.post("/prd/generate", {
        cluster_id: selectedCluster,
      });

      console.log("PRD API response:", response.data);

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   cluster_id: 0,
       *   feedback_count: 6,
       *   prd: "..."
       * }
       */

      const generatedPRD = response.data?.prd;

      if (generatedPRD) {
        setPrd(generatedPRD);
      } else {
        setError("PRD was generated but no content was returned.");
      }
    } catch (err: any) {
      console.error("PRD generation failed:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to generate PRD. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // Save PRD locally
  // -----------------------------------------

  function savePRD() {
    if (!prd.trim()) {
      setError("There is no PRD content to save.");
      return;
    }

    localStorage.setItem("generated_prd", prd);

    alert("PRD saved successfully.");
  }

  // -----------------------------------------
  // Download PRD as text
  // Temporary until PDF implementation
  // -----------------------------------------

  function downloadPRD() {
    if (!prd.trim()) {
      setError("There is no PRD content to download.");
      return;
    }

    const blob = new Blob([prd], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "product-requirements-document.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const selectedClusterData = clusters.find(
    (cluster) => cluster.id === selectedCluster
  );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="border-b bg-white">

        <div className="max-w-7xl mx-auto px-8 py-8">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="text-blue-600" size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                PRD Generator
              </h1>

              <p className="text-slate-500 mt-1">
                Generate Product Requirement Documents from customer feedback
                using Generative AI.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Main Content */}
      {/* -------------------------------- */}

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* -------------------------------- */}
        {/* Generator Controls */}
        {/* -------------------------------- */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Cluster Selection */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Issue Cluster
              </label>

              <div className="relative">

                <select
                  value={selectedCluster ?? ""}
                  onChange={(e) =>
                    setSelectedCluster(Number(e.target.value))
                  }
                  disabled={loadingClusters}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  {loadingClusters ? (
                    <option value="">
                      Loading clusters...
                    </option>
                  ) : (
                    clusters.map((cluster) => (
                      <option
                        key={cluster.id}
                        value={cluster.id}
                      >
                        {cluster.name} ({cluster.issue_count} issues)
                      </option>
                    ))
                  )}

                </select>

                <ChevronDown
                  className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
                  size={20}
                />

              </div>

              {selectedClusterData && (
                <p className="text-sm text-slate-500 mt-2">
                  {selectedClusterData.feedback_count} customer feedback
                  records in this cluster.
                </p>
              )}

            </div>

            {/* Generate Button */}

            <div className="flex items-end">

              <button
                onClick={generatePRD}
                disabled={loading || selectedCluster === null}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Generating PRD...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />

                    Generate PRD
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Error */}
        {/* -------------------------------- */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* -------------------------------- */}
        {/* PRD Editor */}
        {/* -------------------------------- */}

        {prd && (

          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Editor Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b bg-slate-50 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Generated Product Requirements Document
                </h2>

                {selectedClusterData && (
                  <p className="text-sm text-slate-500 mt-1">
                    Cluster:{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedClusterData.name}
                    </span>
                  </p>
                )}

              </div>

              <div className="flex gap-3">

                <button
                  onClick={savePRD}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Save size={18} />
                  Save
                </button>

                <button
                  onClick={downloadPRD}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Download size={18} />
                  Download
                </button>

              </div>

            </div>

            {/* Editable PRD */}

            <div className="p-6">

              <textarea
                value={prd}
                onChange={(e) => setPrd(e.target.value)}
                className="w-full min-h-[800px] resize-y rounded-xl border border-slate-300 p-6 font-mono text-sm leading-7 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Generated PRD will appear here..."
              />

            </div>

          </div>

        )}

        {/* -------------------------------- */}
        {/* Empty State */}
        {/* -------------------------------- */}

        {!prd && !loading && !error && (

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

              <FileText
                className="text-blue-600"
                size={32}
              />

            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Generate your first PRD
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-slate-500">
              Select an issue cluster above and let Generative AI create a
              structured Product Requirements Document based on the customer
              feedback associated with that cluster.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}
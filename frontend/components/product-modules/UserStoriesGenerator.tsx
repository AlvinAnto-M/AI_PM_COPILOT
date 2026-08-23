"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import api from "@/lib/api";

interface Cluster {
  cluster_id: number;
  name: string;
  theme: string;
  feedback_count: number;
}

interface UserStory {
  id: number;
  title: string;
  story: string;
  acceptance_criteria: string[];
}

interface UserStoriesResponse {
  success: boolean;
  cluster_id: number;
  theme: string;
  feedback_count: number;
  user_stories: UserStory[];
}

interface UserStoriesGeneratorProps {
  onBack?: () => void;
}

export default function UserStoriesGenerator({
  onBack,
}: UserStoriesGeneratorProps) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  const [stories, setStories] = useState<UserStory[]>([]);
  const [theme, setTheme] = useState("");
  const [feedbackCount, setFeedbackCount] = useState(0);

  const [loadingClusters, setLoadingClusters] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load clusters
  // --------------------------------------------------

  useEffect(() => {
    async function fetchClusters() {
      try {
        setLoadingClusters(true);
        setError("");

        const response = await api.get("/clusters");

        const data = response.data;

        /*
         * Backend currently returns:
         *
         * {
         *   success: true,
         *   clusters: [...]
         * }
         */

        const clusterData = Array.isArray(data)
          ? data
          : Array.isArray(data?.clusters)
          ? data.clusters
          : [];

        const formattedClusters: Cluster[] = clusterData.map(
          (cluster: any) => ({
            cluster_id:
              cluster.cluster_id ??
              cluster.id ??
              0,

            name:
              cluster.name ??
              cluster.theme ??
              "Unnamed Cluster",

            theme:
              cluster.theme ??
              cluster.name ??
              "Unnamed Cluster",

            feedback_count:
              cluster.feedback_count ??
              cluster.issue_count ??
              0,
          })
        );

        setClusters(formattedClusters);

        // Automatically select first cluster
        if (formattedClusters.length > 0) {
          setSelectedCluster(formattedClusters[0].cluster_id);
        }
      } catch (err) {
        console.error("Failed to load clusters:", err);
        setError(
          "Unable to load clusters. Please make sure the backend is running."
        );
      } finally {
        setLoadingClusters(false);
      }
    }

    fetchClusters();
  }, []);

  // --------------------------------------------------
  // Generate User Stories
  // --------------------------------------------------

  async function generateUserStories() {
    if (selectedCluster === null) {
      setError("Please select a cluster first.");
      return;
    }

    try {
      setGenerating(true);
      setError("");

      setStories([]);

      const response = await api.post("/user-stories/generate", {
        cluster_id: selectedCluster,
      });

      const data: UserStoriesResponse = response.data;

      if (!data.success) {
        throw new Error("User story generation failed.");
      }

      setStories(data.user_stories || []);
      setTheme(data.theme || "");
      setFeedbackCount(data.feedback_count || 0);
    } catch (err: any) {
      console.error("User story generation error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to generate user stories.";

      setError(message);
    } finally {
      setGenerating(false);
    }
  }

  // --------------------------------------------------
  // Selected cluster
  // --------------------------------------------------

  const selectedClusterData = clusters.find(
    (cluster) => cluster.cluster_id === selectedCluster
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* ------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------ */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-4">

          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-3">

              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <FileText size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  User Stories & Acceptance Criteria
                </h1>

                <p className="text-slate-500 mt-1">
                  Automatically transform customer problems into actionable
                  user stories and testable acceptance criteria.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------ */}
      {/* Generator Card */}
      {/* ------------------------------------------------ */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">

        <div className="flex items-center gap-2 mb-5">

          <Sparkles
            size={20}
            className="text-blue-600"
          />

          <h2 className="text-xl font-semibold text-slate-900">
            Generate User Stories
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">

          {/* Cluster Selection */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Issue Cluster
            </label>

            <select
              value={selectedCluster ?? ""}
              onChange={(e) => {
                setSelectedCluster(
                  e.target.value === ""
                    ? null
                    : Number(e.target.value)
                );

                // Clear previous result
                setStories([]);
                setTheme("");
                setFeedbackCount(0);
                setError("");
              }}
              disabled={loadingClusters || generating}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                {loadingClusters
                  ? "Loading clusters..."
                  : "Select a cluster"}
              </option>

              {clusters.map((cluster) => (
                <option
                  key={cluster.cluster_id}
                  value={cluster.cluster_id}
                >
                  {cluster.name} ({cluster.feedback_count} feedback)
                </option>
              ))}

            </select>

            {selectedClusterData && (
              <p className="text-sm text-slate-500 mt-2">
                Selected issue theme:{" "}
                <span className="font-medium text-slate-700">
                  {selectedClusterData.theme}
                </span>
              </p>
            )}

          </div>

          {/* Generate Button */}

          <button
            onClick={generateUserStories}
            disabled={
              generating ||
              loadingClusters ||
              selectedCluster === null
            }
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          >

            {generating ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                Generating...
              </>
            ) : (
              <>
                <Sparkles size={19} />

                Generate User Stories
              </>
            )}

          </button>

        </div>

      </div>

      {/* ------------------------------------------------ */}
      {/* Error */}
      {/* ------------------------------------------------ */}

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">
            {error}
          </p>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* Results */}
      {/* ------------------------------------------------ */}

      {stories.length > 0 && (

        <div>

          {/* Result Header */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-2xl font-bold text-slate-900">
                  Generated User Stories
                </h2>

                <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium">
                  {stories.length} Stories
                </span>

              </div>

              <p className="text-slate-500 mt-1">
                Based on{" "}
                <span className="font-medium">
                  {feedbackCount}
                </span>{" "}
                customer feedback records from{" "}
                <span className="font-medium text-slate-700">
                  {theme}
                </span>
              </p>

            </div>

            <button
              onClick={generateUserStories}
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw size={17} />

              Regenerate
            </button>

          </div>

          {/* Story Cards */}

          <div className="space-y-6">

            {stories.map((story) => (

              <div
                key={story.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >

                {/* Story Header */}

                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">

                  <div className="flex items-start gap-4">

                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold">
                      {story.id}
                    </div>

                    <div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        {story.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        User Story
                      </p>

                    </div>

                  </div>

                </div>

                {/* Story Content */}

                <div className="p-6">

                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 mb-6">

                    <p className="text-slate-800 leading-7">
                      {story.story}
                    </p>

                  </div>

                  {/* Acceptance Criteria */}

                  <div>

                    <div className="flex items-center gap-2 mb-4">

                      <CheckCircle2
                        size={20}
                        className="text-green-600"
                      />

                      <h4 className="font-semibold text-slate-900">
                        Acceptance Criteria
                      </h4>

                      <span className="text-sm text-slate-500">
                        ({story.acceptance_criteria.length})
                      </span>

                    </div>

                    <div className="space-y-3">

                      {story.acceptance_criteria.map(
                        (criteria, index) => (

                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                          >

                            <div className="flex-shrink-0 mt-0.5">

                              <CheckCircle2
                                size={18}
                                className="text-green-600"
                              />

                            </div>

                            <p className="text-sm text-slate-700 leading-6">
                              {criteria}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* ------------------------------------------------ */}
      {/* Empty State */}
      {/* ------------------------------------------------ */}

      {!generating &&
        stories.length === 0 &&
        !error && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">

              <FileText size={30} />

            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Ready to generate
            </h2>

            <p className="text-slate-500 max-w-lg mx-auto mt-2">
              Select an issue cluster above and generate AI-powered user
              stories with detailed, testable acceptance criteria.
            </p>

          </div>
        )}

    </div>
  );
}
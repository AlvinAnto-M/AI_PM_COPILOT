"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import UploadSection from "@/components/UploadSection";
import ClusterList from "@/components/ClusterList";
import DetailPanel from "@/components/DetailPanel";
import TrendAnalysis from "@/components/TrendAnalysis";
import Recommendations from "@/components/Recommendations";
import AICopilot from "@/components/ai-copilot/AICopilot";
import ProductModules from "@/components/product-modules/ProductModules";

export default function Home() {
  const router = useRouter();

  // Selected cluster shared between ClusterList and DetailPanel
  const [selectedCluster, setSelectedCluster] = useState<number | null>(0);

  // --------------------------------------------------
  // Open Product Management Module
  // --------------------------------------------------

  const handleOpenModule = (module: string) => {
    switch (module) {
      case "prd":
        router.push("/prd-generator");
        break;

      case "user-stories":
        router.push("/user-stories");
        break;

      case "prioritization":
        router.push("/prioritization");
        break;

      case "chat":
        // Keep Chat Assistant on the dashboard
        // for now.
        break;

      default:
        break;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Container */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Header */}
        <Header />

        {/* Summary Cards */}
        <div className="mt-8">
          <SummaryCards />
        </div>

        {/* Upload Section */}
        <div className="mt-8">
          <UploadSection />
        </div>

        {/* Cluster Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          <ClusterList
            selected={selectedCluster}
            onSelect={setSelectedCluster}
          />

          <DetailPanel
            clusterId={selectedCluster}
          />

        </div>

        {/* Trend Analysis & AI Recommendations */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          <TrendAnalysis />

          <Recommendations />

        </div>

        {/* ------------------------------------------------ */}
        {/* Product Management Modules */}
        {/* ------------------------------------------------ */}

        <ProductModules
          onOpenModule={handleOpenModule}
        />

        {/* ------------------------------------------------ */}
        {/* AI Product Manager Copilot */}
        {/* ------------------------------------------------ */}

        <div className="mt-8">
          <AICopilot />
        </div>

      </div>
    </main>
  );
}
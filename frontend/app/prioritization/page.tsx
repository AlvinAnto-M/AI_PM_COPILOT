"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import FeaturePrioritization from "@/components/product-modules/FeaturePrioritization";

export default function PrioritizationPage() {
  const router = useRouter();

  return (
    <div>

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 pt-6">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

      </div>

      <FeaturePrioritization />

    </div>
  );
}
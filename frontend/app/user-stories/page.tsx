"use client";

import { useRouter } from "next/navigation";
import UserStoriesGenerator from "@/components/product-modules/UserStoriesGenerator";

export default function UserStoriesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">

      <UserStoriesGenerator
        onBack={() => router.push("/")}
      />

    </main>
  );
}
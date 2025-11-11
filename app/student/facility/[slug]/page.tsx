"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function FacilityPage() {
  const { slug } = useParams<{ slug: string }>();
  const [facility, setFacility] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    // Fetch facility details from your API (replace with actual endpoint if needed)
    fetch(`/api/facilities?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => setFacility(data))
      .catch(() => console.warn("⚠️ Could not load facility details"));
  }, [slug]);

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">
            Facility: {facility?.name || slug}
          </h1>
          <Link href="/student/facilities">
            <Button variant="outline" className="border-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
        </div>

        {/* Facility Info */}
        {facility ? (
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300 text-lg">
              <span className="font-semibold">Category:</span>{" "}
              {facility.category}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold">Description:</span>{" "}
              {facility.description}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  facility.status === "active"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {facility.status}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-slate-400">Loading facility details...</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CheckCircle, Loader2 } from "lucide-react";

interface Facility {
  id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  status: string;
}

export default function MessFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Role Protection
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    let user = null;

    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch (err) {
      console.error("❌ Error parsing user:", err);
    }

    if (
      !user ||
      !["messadmin", "superadmin"].includes(user.role?.toLowerCase())
    ) {
      console.warn("⚠️ Unauthorized access — redirecting to login...");
      router.replace("/login");
    }
  }, [router]);

  // ✅ Fetch only mess facility
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities");
        if (!res.ok) throw new Error("Failed to fetch facilities");

        const data = await res.json();
        const allFacilities = Array.isArray(data) ? data : [];
        const messFacility = allFacilities.filter(
          (f) => f.category?.toLowerCase() === "mess"
        );

        setFacilities(messFacility);
      } catch (err) {
        console.error("Error fetching mess facilities:", err);
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      mess: "from-green-400 to-green-600",
      maintenance: "from-blue-400 to-blue-600",
      "entry-exit": "from-orange-400 to-orange-600",
      internet: "from-purple-400 to-purple-600",
      medical: "from-red-400 to-red-600",
    };
    return colors[category] || "from-gray-400 to-gray-600";
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/messadmin">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 mb-4 border-slate-600 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">🍽 Mess Facilities</h1>
        <p className="text-slate-400">
          Manage the mess department facilities and ensure smooth meal service.
        </p>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="ml-2 text-slate-400">Loading mess facilities...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && facilities.length === 0 && (
        <Card className="p-10 text-center bg-slate-800/80 border border-slate-700 text-slate-400">
          No mess facilities found.
        </Card>
      )}

      {/* Facilities Grid */}
      {!loading && facilities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card
              key={facility.id}
              className="border border-slate-700 p-6 bg-slate-800/70 hover:bg-slate-700/60 transition-all rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getCategoryColor(
                    facility.category || "others"
                  )} flex items-center justify-center shadow-md`}
                >
                  <span className="text-2xl">🍽️</span>
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                    facility.status === "active"
                      ? "bg-green-900/60 text-green-300 border border-green-700/40"
                      : "bg-yellow-900/60 text-yellow-300 border border-yellow-700/40"
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  {facility.status || "inactive"}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2 capitalize text-white">
                {facility.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                {facility.description || "No description provided."}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {facility.location || "Not specified"}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 capitalize">
                  {facility?.category
                    ? facility.category.replace("-", " ")
                    : "Uncategorized"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-slate-600 hover:bg-slate-700"
                  onClick={() => alert("Edit feature coming soon!")}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

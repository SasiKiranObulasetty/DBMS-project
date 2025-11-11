"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Search } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  student_name: string;
  room_number: string;
}

export default function MessResolvedIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

    if (!user || !["messadmin", "superadmin"].includes(user.role?.toLowerCase())) {
      console.warn("⚠️ Unauthorized access — redirecting to login...");
      router.replace("/login");
    }
  }, [router]);

  // ✅ Fetch only resolved mess issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/issues?category=mess");
        if (!res.ok) throw new Error("Failed to fetch mess issues");
        const data = await res.json();

        // Normalize response
        const issuesData = Array.isArray(data)
          ? data
          : Array.isArray(data.issues)
          ? data.issues
          : [];

        // Filter resolved mess issues
        const resolvedMessIssues = issuesData.filter(
          (issue) =>
            issue.category?.toLowerCase() === "mess" &&
            issue.status?.toLowerCase() === "resolved"
        );

        setIssues(resolvedMessIssues);
      } catch (err) {
        console.error("Error fetching resolved mess issues:", err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ✅ Search filter
  const filteredIssues = issues.filter((issue) => {
    return (
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.room_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
        <h1 className="text-3xl font-bold text-white">🍽️ Resolved Mess Issues</h1>
        <p className="text-slate-400">
          View all completed issue resolutions related to the mess department.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border border-slate-700 bg-slate-800/80 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, student, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border border-slate-700 bg-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading resolved mess issues...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No resolved mess issues found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-700/70 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Reported By
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Date Raised
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{issue.title}</p>
                        <p className="text-xs text-slate-400">
                          {issue.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {issue.student_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {issue.room_number || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-green-900/60 text-green-300 w-fit border border-green-700/50">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

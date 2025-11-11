"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  student_name: string;
  created_at: string;
}

export default function MessAdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Role-based protection
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    let user = null;

    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch (e) {
      console.error("Failed to parse user:", e);
    }

    if (
      !user ||
      !["messadmin", "superadmin", "facilityadmin"].includes(user.role?.toLowerCase())
    ) {
      console.warn("⚠️ Redirecting unauthorized user...");
      router.replace("/login");
    }
  }, [router]);

  // ✅ Fetch only Mess issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues?category=mess"); // Backend filters mess issues
        const data = await res.json();

        const issuesData = Array.isArray(data)
          ? data
          : Array.isArray(data.issues)
          ? data.issues
          : [];

        const messIssues = issuesData.filter(
          (issue) => issue.category?.toLowerCase() === "mess"
        );

        setIssues(messIssues);

        // ✅ Stats calculation
        const resolved = messIssues.filter((i) => i.status === "resolved").length;
        const inProgress = messIssues.filter(
          (i) => i.status === "in_progress" || i.status === "in-progress"
        ).length;
        const pending = messIssues.filter(
          (i) => i.status === "pending" || i.status === "raised"
        ).length;

        setStats({
          total: messIssues.length,
          resolved,
          inProgress,
          pending,
        });
      } catch (error) {
        console.error("❌ Error fetching mess issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const recentIssues = issues.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in-progress":
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "pending":
      case "raised":
        return <AlertCircle className="w-5 h-5 text-cyan-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400 bg-slate-900">
        Loading Mess Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Mess Admin Dashboard</h1>
          <p className="text-slate-400">
            Manage mess facilities and resolve student meal-related issues
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Issues</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-cyan-400 opacity-30" />
          </div>
        </Card>

        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resolved</p>
              <p className="text-3xl font-bold text-green-400">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400 opacity-30" />
          </div>
        </Card>

        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.inProgress}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-400 opacity-30" />
          </div>
        </Card>

        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-orange-400">{stats.pending}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-400 opacity-30" />
          </div>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card className="border border-slate-700 bg-slate-800/70 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Mess Issues</h2>
          <Link href="/messadmin/raisedissues">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-slate-600 text-white hover:bg-slate-700"
            >
              <Eye className="w-4 h-4" />
              View All
            </Button>
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <p className="text-center text-slate-400 py-6">No mess issues found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-700/50 text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">By</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                  >
                    <td className="px-4 py-3 font-mono text-sm">{issue.id}</td>
                    <td className="px-4 py-3 font-medium">{issue.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {issue.student_name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(issue.status)}
                        <span className="text-xs capitalize">{issue.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {issue.status !== "resolved" && (
                        <Link href={`/messadmin/raisedissues?issue=${issue.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            Resolve
                          </Button>
                        </Link>
                      )}
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

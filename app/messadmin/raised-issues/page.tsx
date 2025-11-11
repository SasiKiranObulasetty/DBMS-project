"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Issue {
  id: number;
  student_id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  student_name?: string;
  room_number?: string;
}

export default function MessRaisedIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
  });
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

  // ✅ Fetch only mess issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/issues?category=mess");
      if (!res.ok) throw new Error("Failed to fetch issues");
      const data = await res.json();

      // Normalize data
      const issuesData = Array.isArray(data)
        ? data
        : Array.isArray(data.issues)
        ? data.issues
        : [];

      const messIssues = issuesData.filter(
        (i) => i.category?.toLowerCase() === "mess"
      );

      setIssues(messIssues);
      calculateStats(messIssues);
    } catch (err) {
      console.error("Error fetching mess issues:", err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Issue[]) => {
    const total = data.length;
    const resolved = data.filter((i) => i.status === "resolved").length;
    const inProgress = data.filter(
      (i) => i.status === "in_progress" || i.status === "in-progress"
    ).length;
    const pending = total - resolved - inProgress;
    setStats({ total, resolved, pending, inProgress });
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues =
    filter === "all"
      ? issues.filter((i) => i.status !== "resolved")
      : issues.filter((i) => i.status === filter);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update issue");
      await fetchIssues();
    } catch (err) {
      console.error("Error updating issue:", err);
      alert("❌ Failed to update issue status.");
    }
  };

  const handleResolve = async () => {
    if (!selectedIssue) return;
    await updateStatus(selectedIssue.id, "resolved");
    setSelectedIssue(null);
    setResolutionNotes("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in_progress":
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cyan-400" />;
    }
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
        <h1 className="text-3xl font-bold text-white">🍽️ Mess Raised Issues</h1>
        <p className="text-slate-400">
          View and resolve issues reported in the mess department
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <p className="text-slate-400 text-sm">Total Issues</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
        </Card>
        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <p className="text-slate-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{stats.resolved}</p>
        </Card>
        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <p className="text-slate-400 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">
            {stats.inProgress}
          </p>
        </Card>
        <Card className="p-6 border border-slate-700 bg-slate-800/70">
          <p className="text-slate-400 text-sm">Pending</p>
          <p className="text-3xl font-bold text-orange-400 mt-1">{stats.pending}</p>
        </Card>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Buttons */}
          <Card className="border border-slate-700 bg-slate-800/80 p-4">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "in_progress"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={`capitalize ${
                    filter === status
                      ? "bg-cyan-600 hover:bg-cyan-700"
                      : "border-slate-600 text-white hover:bg-slate-700"
                  }`}
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </Card>

          {/* Issue Cards */}
          {loading ? (
            <p className="text-slate-400 p-4">Loading mess issues...</p>
          ) : filteredIssues.length === 0 ? (
            <Card className="p-6 text-center text-slate-400 bg-slate-800/70 border-slate-700">
              No mess issues found.
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className={`p-4 border border-slate-700 bg-slate-800/70 hover:bg-slate-700/60 cursor-pointer ${
                  selectedIssue?.id === issue.id ? "border-cyan-500" : ""
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex items-start gap-3">
                  <div>{getStatusIcon(issue.status)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white">{issue.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">
                      {issue.description}
                    </p>
                    <div className="text-xs text-slate-500 flex gap-2 flex-wrap">
                      <span>🍽️ {issue.category}</span>
                      <span>• 👤 {issue.student_name || "N/A"}</span>
                      <span>• 🕒 {new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="text-xs capitalize border border-slate-600 px-2 py-1 rounded text-slate-300">
                    {issue.status.replace("_", " ")}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Resolution Panel */}
        <div>
          {selectedIssue ? (
            <Card className="p-6 bg-slate-800/80 border-slate-700 sticky top-8">
              <h3 className="text-lg font-bold mb-4 text-white">Issue Details</h3>

              <p className="text-sm text-slate-400 mb-1">Title</p>
              <p className="font-semibold mb-3">{selectedIssue.title}</p>

              <p className="text-sm text-slate-400 mb-1">Reported By</p>
              <p className="font-semibold mb-3">
                {selectedIssue.student_name || "Unknown"}
              </p>

              <p className="text-sm text-slate-400 mb-1">Category</p>
              <p className="font-semibold mb-3 capitalize">{selectedIssue.category}</p>

              <p className="text-sm text-slate-400 mb-2">Status</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["pending", "in_progress", "resolved"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedIssue.status === status ? "default" : "outline"}
                    onClick={() => updateStatus(selectedIssue.id, status)}
                    className={`capitalize ${
                      selectedIssue.status === status
                        ? "bg-cyan-600 hover:bg-cyan-700"
                        : "border-slate-600 text-white hover:bg-slate-700"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </Button>
                ))}
              </div>

              <textarea
                placeholder="Add resolution notes..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white text-sm focus:ring-2 focus:ring-cyan-500"
              />

              <Button
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700"
                onClick={handleResolve}
              >
                Mark as Resolved
              </Button>
            </Card>
          ) : (
            <Card className="p-6 text-center text-slate-400 bg-slate-800/70 border-slate-700">
              Select a mess issue to view details
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

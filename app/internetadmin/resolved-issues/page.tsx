"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Search } from "lucide-react";

interface Facility {
  id: number;
  name: string;
}

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

export default function ResolvedIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFacility, setFilterFacility] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [issuesRes, facilitiesRes] = await Promise.all([
          fetch("/api/issues"),
          fetch("/api/facilities"),
        ]);

        if (!issuesRes.ok || !facilitiesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const issuesJson = await issuesRes.json();
        const facilitiesJson = await facilitiesRes.json();

        // ✅ Normalize data shape — handles API returning array or object
        const issuesData = Array.isArray(issuesJson)
          ? issuesJson
          : Array.isArray(issuesJson.issues)
          ? issuesJson.issues
          : Array.isArray(issuesJson.data)
          ? issuesJson.data
          : [];

        const facilitiesData = Array.isArray(facilitiesJson)
          ? facilitiesJson
          : Array.isArray(facilitiesJson.facilities)
          ? facilitiesJson.facilities
          : [];

        const resolvedIssues = issuesData.filter(
          (issue: Issue) =>
            issue.status?.toLowerCase() === "resolved"
        );

        setIssues(resolvedIssues);
        setFacilities(facilitiesData);
      } catch (err) {
        console.error("Error fetching resolved issues:", err);
        setIssues([]);
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter + Search
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFacility =
      filterFacility === "all" ||
      issue.category.toLowerCase().replace("_", " ") ===
        filterFacility.toLowerCase();

    return matchesSearch && matchesFacility;
  });

  return (
    <div className="flex-1 min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 mb-4 border-slate-600 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">✅ Resolved Issues</h1>
        <p className="text-slate-400">View all completed issue resolutions</p>
      </div>

      {/* Filters */}
      <Card className="border border-slate-700 bg-slate-800/80 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, student, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Facility Filter */}
          <select
            value={filterFacility}
            onChange={(e) => setFilterFacility(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Facilities</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border border-slate-700 bg-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading resolved issues...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No resolved issues found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-700/70 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Facility
                  </th>
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
                    <td className="px-6 py-4 capitalize text-slate-200">
                      {issue.category.replace("_", " ")}
                    </td>
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

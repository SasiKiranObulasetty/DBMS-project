"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (user?.id) {
      fetch(`/api/issues?student_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // ✅ Fix: ensure we always set an array
          if (Array.isArray(data)) {
            setIssues(data)
          } else if (Array.isArray(data.issues)) {
            setIssues(data.issues)
          } else {
            console.warn("Unexpected data format:", data)
            setIssues([])
          }
        })
        .catch((err) => {
          console.error("Failed to fetch issues:", err)
          setIssues([])
        })
    }
  }, [])

  // ✅ Filter issues safely
  const filteredIssues =
    filterStatus === "all"
      ? issues
      : issues.filter((i) => i.status === filterStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500 inline" />
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-500 inline" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500 inline" />
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700"
      case "in_progress":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <Link href="/student">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 mb-4 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">My Issues</h1>
        <p className="text-slate-400">Track all your reported issues</p>
      </div>

      {/* Filters */}
      <Card className="border-2 p-4 mb-6 flex flex-wrap gap-3">
        {["all", "pending", "in_progress", "resolved"].map((s) => (
          <Button
            key={s}
            variant={filterStatus === s ? "default" : "outline"}
            onClick={() => setFilterStatus(s)}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </Button>
        ))}
      </Card>

      {/* Table */}
      <Card className="border-2 overflow-hidden">
        {!Array.isArray(filteredIssues) || filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>No issues found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-800 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="border-b border-slate-700">
                  <td className="px-6 py-4">{issue.title}</td>
                  <td className="px-6 py-4 capitalize">{issue.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 ${getStatusBg(
                        issue.status
                      )}`}
                    >
                      {getStatusIcon(issue.status)} {issue.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStudentIssues, getFacilities } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import type { Issue, Facility } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      const studentIssues = getStudentIssues(user.id)
      setIssues(studentIssues)
      setFacilities(getFacilities())
    }
  }, []) // Empty dependency array - load data only once on mount

  const filteredIssues = filterStatus === "all" ? issues : issues.filter((i) => i.status === filterStatus)

  const getFacilityName = (id: string) => {
    return facilities.find((f) => f.id === id)?.name || "Unknown"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "pending":
      case "raised":
        return <AlertCircle className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
      case "in-progress":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
      case "pending":
      case "raised":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/student">
          <Button variant="outline" size="sm" className="gap-2 mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">My Issues</h1>
        <p className="text-muted-foreground">Track all your reported issues</p>
      </div>

      {/* Filters */}
      <Card className="border-2 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "all" ? "bg-primary text-white" : ""}
            onClick={() => setFilterStatus("all")}
          >
            All Issues
          </Button>
          <Button
            variant={filterStatus === "raised" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "raised" ? "bg-blue-500 text-white" : ""}
            onClick={() => setFilterStatus("raised")}
          >
            Raised
          </Button>
          <Button
            variant={filterStatus === "in-progress" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "in-progress" ? "bg-yellow-500 text-white" : ""}
            onClick={() => setFilterStatus("in-progress")}
          >
            In Progress
          </Button>
          <Button
            variant={filterStatus === "resolved" ? "default" : "outline"}
            size="sm"
            className={filterStatus === "resolved" ? "bg-green-500 text-white" : ""}
            onClick={() => setFilterStatus("resolved")}
          >
            Resolved
          </Button>
        </div>
      </Card>

      {/* Issues Table */}
      <Card className="border-2 overflow-hidden">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No issues found for this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Issue ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Facility</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold">{issue.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-start">
                        {getStatusIcon(issue.status)}
                        <div>
                          <p className="font-medium">{issue.title}</p>
                          <p className="text-xs text-muted-foreground">{issue.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{getFacilityName(issue.facilityId)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBg(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{issue.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

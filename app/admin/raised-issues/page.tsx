"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getIssues, updateIssue, getFacilities } from "@/lib/storage"
import type { Issue, Facility } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function RaisedIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const allIssues = getIssues()
    setIssues(allIssues)
    setFacilities(getFacilities())
  }, [])

  const filteredIssues =
    filter === "all" ? issues.filter((i) => i.status !== "resolved") : issues.filter((i) => i.status === filter)

  const handleResolve = () => {
    if (!selectedIssue) return

    updateIssue(selectedIssue.id, {
      status: "resolved",
    })

    setIssues(getIssues())
    setSelectedIssue(null)
    setResolutionNotes("")
  }

  const handleUpdateStatus = (issueId: string, newStatus: string) => {
    updateIssue(issueId, { status: newStatus as any })
    setIssues(getIssues())
  }

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

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="outline" size="sm" className="gap-2 mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Raised Issues</h1>
        <p className="text-muted-foreground">Manage and resolve student issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card className="border-2 p-4">
            <div className="flex flex-wrap gap-2">
              {["all", "raised", "in-progress", "pending"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  {status === "all" ? "All" : status.replace("-", " ")}
                </Button>
              ))}
            </div>
          </Card>

          {/* Issues Cards */}
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <Card className="border-2 p-6 text-center text-muted-foreground">
                <p>No issues found</p>
              </Card>
            ) : (
              filteredIssues.map((issue) => (
                <Card
                  key={issue.id}
                  className={`border-2 p-4 cursor-pointer hover:shadow-lg transition-all ${
                    selectedIssue?.id === issue.id ? "border-secondary" : ""
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="flex items-start gap-3">
                    <div>{getStatusIcon(issue.status)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-sm text-muted-foreground">{issue.id}</p>
                          <h3 className="font-semibold">{issue.title}</h3>
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-muted capitalize">
                          {issue.status}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                        <span>By: {issue.createdBy}</span>
                        <span>•</span>
                        <span>{getFacilityName(issue.facilityId)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Resolution Panel */}
        <div>
          {selectedIssue ? (
            <Card className="border-2 p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Issue Details</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Issue ID</p>
                  <p className="font-mono font-semibold">{selectedIssue.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="font-semibold">{selectedIssue.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reported By</p>
                  <p className="font-semibold">{selectedIssue.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Facility</p>
                  <p className="font-semibold">{getFacilityName(selectedIssue.facilityId)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {["raised", "in-progress", "pending", "resolved"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedIssue.status === status ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(selectedIssue.id, status)}
                        className="text-xs capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Resolution Notes</label>
                <textarea
                  placeholder="Add resolution notes..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <Button
                className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                onClick={handleResolve}
              >
                Mark as Resolved
              </Button>
            </Card>
          ) : (
            <Card className="border-2 p-6 text-center text-muted-foreground">
              <p>Select an issue to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

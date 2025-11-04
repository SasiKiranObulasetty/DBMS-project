"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getIssues, getFacilities } from "@/lib/storage"
import type { Issue, Facility } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Search } from "lucide-react"

export default function ResolvedIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFacility, setFilterFacility] = useState("all")

  useEffect(() => {
    const allIssues = getIssues().filter((i) => i.status === "resolved")
    setIssues(allIssues)
    setFacilities(getFacilities())
  }, [])

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFacility = filterFacility === "all" || issue.facilityId === filterFacility
    return matchesSearch && matchesFacility
  })

  const getFacilityName = (id: string) => {
    return facilities.find((f) => f.id === id)?.name || "Unknown"
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
        <h1 className="text-3xl font-bold">Resolved Issues</h1>
        <p className="text-muted-foreground">View all completed resolutions</p>
      </div>

      {/* Filters */}
      <Card className="border-2 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <select
            value={filterFacility}
            onChange={(e) => setFilterFacility(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Facilities</option>
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Issues Table */}
      <Card className="border-2 overflow-hidden">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No resolved issues found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Facility</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Issue Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Reported By</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date Raised</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{getFacilityName(issue.facilityId)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">{issue.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{issue.createdBy}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{issue.createdAt}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 w-fit">
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
  )
}

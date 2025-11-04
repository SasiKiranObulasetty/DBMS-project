"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getIssues, getIssueStats } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import type { Issue } from "@/lib/types"
import Link from "next/link"
import { AlertCircle, CheckCircle, Clock, Eye } from "lucide-react"

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, inProgress: 0 })
  const user = getCurrentUser()

  useEffect(() => {
    const allIssues = getIssues()
    setIssues(allIssues)
    setStats(getIssueStats())
  }, [])

  const recentIssues = issues.slice(0, 5)

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage hostel facilities and resolve issues</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Issues</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 border-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Resolved</p>
              <p className="text-3xl font-bold text-green-500">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 border-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">In Progress</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 border-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="text-3xl font-bold text-orange-500">{stats.pending}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card className="border-2 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Issues</h2>
          <Link href="/admin/raised-issues">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Eye className="w-4 h-4" />
              View All
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800 border-b-2">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Issue ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">By</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.map((issue) => (
                <tr key={issue.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-sm">{issue.id}</td>
                  <td className="px-4 py-3 font-medium">{issue.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{issue.createdBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(issue.status)}
                      <span className="text-xs capitalize">{issue.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {issue.status !== "resolved" && (
                      <Link href={`/admin/raised-issues?issue=${issue.id}`}>
                        <Button size="sm" variant="outline">
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
      </Card>
    </div>
  )
}

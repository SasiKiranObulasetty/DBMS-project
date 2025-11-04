"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStudentIssues, getIssueStats, getFacilities } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import type { Issue, Facility } from "@/lib/types"
import Link from "next/link"
import { AlertCircle, CheckCircle, Clock, Plus, Eye } from "lucide-react"

export default function StudentDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, inProgress: 0 })
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserName(user.name)
      setUserId(user.id)
      const studentIssues = getStudentIssues(user.id)
      setIssues(studentIssues)
      setStats(getIssueStats())
      setFacilities(getFacilities())
    }
  }, [])

  const recentIssues = issues.slice(0, 5)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 dark:bg-green-950 border-green-200"
      case "in-progress":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200"
      case "pending":
        return "bg-orange-50 dark:bg-orange-950 border-orange-200"
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200"
    }
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Manage your hostel facilities and issues</p>
        </div>
        <Link href="/student/raise-issue">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Raise Issue
          </Button>
        </Link>
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
          <h2 className="text-xl font-bold">Your Recent Issues</h2>
          <Link href="/student/my-issues">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Eye className="w-4 h-4" />
              View All
            </Button>
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No issues raised yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className={`p-4 rounded-lg border-2 ${getStatusColor(issue.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div>{getStatusIcon(issue.status)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {issue.id}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-background/50">{issue.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Facilities */}
      <Card className="border-2 p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Available Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="p-4 rounded-lg border-2 border-border hover:border-secondary transition-all"
            >
              <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{facility.description}</p>
              <p className="text-xs text-muted-foreground">📍 {facility.location}</p>
              <div className="mt-3">
                <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  {facility.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

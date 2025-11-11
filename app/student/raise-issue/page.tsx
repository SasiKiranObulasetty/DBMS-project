"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, PlusCircle } from "lucide-react"

export default function RaiseIssuePage() {
  const [facilities, setFacilities] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [facilityId, setFacilityId] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0, pending: 0 })
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}

  // 🧠 Fetch facilities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/facilities")
        if (res.ok) {
          const data = await res.json()
          setFacilities(Array.isArray(data) ? data : data.facilities || [])
        } else {
          // fallback if no /api/facilities yet
          setFacilities([
            { id: 1, name: "Mess", status: "active" },
            { id: 2, name: "Maintenance", status: "active" },
            { id: 3, name: "Internet", status: "active" },
            { id: 4, name: "Medical", status: "active" },
            { id: 5, name: "Entry-Exit", status: "active" },
            { id: 6, name: "Others", status: "active" },
          ])
        }
      } catch {
        setFacilities([])
      }
    }
    fetchData()
  }, [])

  // 🧮 Fetch issue stats for this student
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        console.warn("⚠️ No user found in localStorage, skipping fetchStats")
        return
      }

      try {
        const res = await fetch(`/api/issues?student_id=${user.id}`)
        if (res.ok) {
          const data = await res.json()

          // ✅ Handle both possible formats: array OR { issues: [...] }
          const issues = Array.isArray(data)
            ? data
            : Array.isArray(data.issues)
            ? data.issues
            : []

          const total = issues.length
          const resolved = issues.filter((i) => i.status === "resolved").length
          const inProgress = issues.filter((i) => i.status === "in_progress").length
          const pending = total - resolved - inProgress
          setStats({ total, resolved, inProgress, pending })
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }

    fetchStats()
  }, [user])

  // 🧾 Handle issue submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !facilityId) {
      alert("⚠️ Please fill all fields before submitting.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.id,
          title,
          description,
          category: facilityId.toLowerCase().replace(" ", "_"),
        }),
      })

      if (response.ok) {
        alert("✅ Issue raised successfully!")
        setTitle("")
        setDescription("")
        setFacilityId("")
      } else {
        const errText = await response.text()
        console.error("Server error:", errText)
        alert("❌ Failed to raise issue. Please try again.")
      }
    } catch (err) {
      console.error("Request failed:", err)
      alert("❌ Server connection failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">📢 Raise a New Issue</h1>
          <p className="text-slate-400 mt-1">Report any hostel facility problems below.</p>
        </div>

        <Link href="/student">
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="p-5 bg-slate-800/70 border-slate-700 text-center">
          <p className="text-slate-400 text-sm">Total Issues</p>
          <h2 className="text-3xl font-bold text-white mt-1">{stats.total}</h2>
        </Card>
        <Card className="p-5 bg-slate-800/70 border-slate-700 text-center">
          <p className="text-slate-400 text-sm">Resolved</p>
          <h2 className="text-3xl font-bold text-green-400 mt-1">{stats.resolved}</h2>
        </Card>
        <Card className="p-5 bg-slate-800/70 border-slate-700 text-center">
          <p className="text-slate-400 text-sm">In Progress</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-1">{stats.inProgress}</h2>
        </Card>
        <Card className="p-5 bg-slate-800/70 border-slate-700 text-center">
          <p className="text-slate-400 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-orange-400 mt-1">{stats.pending}</h2>
        </Card>
      </div>

      {/* Form */}
      <Card className="p-8 bg-slate-900/80 border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Issue Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter issue title"
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          {/* Facility Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Facility</label>
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" disabled hidden>
                Select Facility
              </option>
              {facilities.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} {f.status === "active" ? "🟢" : "🟡"}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3"
            disabled={loading}
          >
            {loading ? "Submitting..." : <><PlusCircle className="w-5 h-5 mr-2" />Raise Issue</>}
          </Button>
        </form>
      </Card>
    </div>
  )
}

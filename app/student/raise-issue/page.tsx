"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createIssue, getFacilities } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function RaiseIssuePage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "room-maintenance" as const,
    facilityId: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const facilities = getFacilities()

  const categories = [
    { value: "room-maintenance", label: "Room Maintenance" },
    { value: "mess-food", label: "Mess Food" },
    { value: "internet", label: "Internet" },
    { value: "cleaning", label: "Cleaning" },
    { value: "medical", label: "Medical" },
    { value: "entry-exit", label: "Entry/Exit" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) return

      createIssue({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        facilityId: formData.facilityId,
        studentId: user.id,
        status: "raised",
        createdBy: user.name,
      })

      setSubmitted(true)
      setTimeout(() => {
        router.push("/student/my-issues")
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md border-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Issue Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your issue has been successfully recorded. Our team will review it shortly.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to your issues...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="outline" size="sm" className="gap-2 mb-4 bg-transparent" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground">Describe the problem you're facing</p>
      </div>

      {/* Form */}
      <Card className="max-w-2xl border-2 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Issue Title</label>
            <input
              type="text"
              placeholder="Brief title of the issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Facility */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Related Facility</label>
            <select
              value={formData.facilityId}
              onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a facility</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              placeholder="Provide detailed description of the issue"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 py-6"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

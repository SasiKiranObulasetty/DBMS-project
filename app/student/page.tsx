"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getFacilities } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import type { Facility } from "@/lib/types"

export default function StudentDashboard() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const user = getCurrentUser()

  useEffect(() => {
    setFacilities(getFacilities())
  }, [])

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            👋 Welcome, {user?.name || "Student"}
          </h1>
          <p className="text-slate-400 mt-1">
            View and explore available hostel facilities below.
          </p>
        </div>
      </div>

      {/* Facilities Section */}
      <h2 className="text-2xl font-semibold mb-4">Available Facilities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Link key={facility.id} href={`/student/facility/${facility.category}`}>
            <Card className="p-6 border border-slate-700 bg-slate-800/80 hover:border-cyan-500 hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
              <p className="text-sm text-slate-400 mb-3">
                {facility.description}
              </p>
              <p className="text-xs text-slate-400">
                <strong>Location:</strong>{" "}
                <span className="font-medium text-slate-300">
                  {facility.location}
                </span>
              </p>
              <p className="text-xs mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    facility.status === "active"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {facility.status}
                </span>
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

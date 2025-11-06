"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getFacilities } from "@/lib/storage"
import type { Facility } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft, MapPin, CheckCircle } from "lucide-react"

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])

  useEffect(() => {
    setFacilities(getFacilities())
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      mess: "from-green-400 to-green-600",
      internet: "from-blue-400 to-blue-600",
      cleaning: "from-purple-400 to-purple-600",
      "entry-exit": "from-orange-400 to-orange-600",
      medical: "from-red-400 to-red-600",
    }
    return colors[category] || "from-gray-400 to-gray-600"
  }

  return (
    <div className="flex-1 p-9">
      {/* Header */}
      <div className="mb-8">
        <Link href="/student">
          <Button variant="outline" size="sm" className="gap-2 mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Hostel Facilities</h1>
        <p className="text-muted-foreground">View all available facilities</p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="border-2 p-6 hover:shadow-lg transition-all hover:border-secondary">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getCategoryColor(facility.category)} flex items-center justify-center`}
              >
                <span className="text-2xl text-white">🏢</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                <CheckCircle className="w-3 h-3" />
                {facility.status}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold mb-2">{facility.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{facility.description}</p>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              {facility.location}
            </div>

            {/* Category Badge */}
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted capitalize">
                {facility.category.replace("-", " ")}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

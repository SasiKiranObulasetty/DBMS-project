"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Utensils, Wifi, Book as Broom, KeyRound, Stethoscope, ArrowRight } from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: Utensils,
    label: "Mess Food",
    description: "Report food quality and dining issues",
    color: "from-green-400 to-green-600",
  },
  {
    icon: Wifi,
    label: "Internet",
    description: "Track connectivity problems",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Broom,
    label: "Room Cleaning",
    description: "Manage housekeeping requests",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: KeyRound,
    label: "Entry/Exit",
    description: "Access control management",
    color: "from-orange-400 to-orange-600",
  },
  {
    icon: Stethoscope,
    label: "Medical",
    description: "Health facility coordination",
    color: "from-red-400 to-red-600",
  },
]

interface StatItem {
  number: string
  label: string
}

const stats: StatItem[] = [
  { number: "500+", label: "Active Students" },
  { number: "95%", label: "Issue Resolution Rate" },
  { number: "24/7", label: "Support Available" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm sm:text-base">HS</span>
            </div>
            <span className="font-bold text-lg sm:text-xl hidden sm:inline">CRA</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-slate-900 font-semibold"
            >
              About
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <div
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url(/images/hostel-hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Council of{" "}
              <span className="bg-gradient-to-r from-orange-700 via- orange-550 to-orange-400 bg-clip-text text-transparent">
                Residential Affairs
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Modern, efficient, and transparent facility management system. Report issues instantly, track resolutions
              in real-time, and manage facilities seamlessly from your device.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-slate-900 font-semibold w-full sm:w-auto group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

          </div>


        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Manage <span className="text-orange-400">5 Key Facilities</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Comprehensive coverage for all hostel facility management needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card
                  key={idx}
                  className="p-6 text-center hover:shadow-2xl transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800 group hover:border-cyan-400/50"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.label}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-600/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your Hostel Management?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Join hundreds of students and administrators using Hostel Solve for seamless facility management.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-slate-900 font-semibold w-full sm:w-auto"
              >
                Login Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 w-full sm:w-auto bg-transparent"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-xs">CRA</span>
                </div>
                <h3 className="font-bold text-white">CRA</h3>
              </div>
              <p className="text-sm">Efficient facility and issue management</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 CRA. All rights reserved. Built with modern technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

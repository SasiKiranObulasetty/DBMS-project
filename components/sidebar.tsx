"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCurrentUser, logout } from "@/lib/auth"
import type { AuthUser } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Eye, Home, LogOut, BarChart3, Wrench } from "lucide-react"

interface SidebarProps {
  activeItem?: string
}

export function Sidebar({ activeItem }: SidebarProps) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  const studentItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
    { icon: Eye, label: "View Facilities", href: "/student/facilities" },
    { icon: FileText, label: "Raise Issue", href: "/student/raise-issue" },
    { icon: Home, label: "My Issues", href: "/student/my-issues" },
  ]

  const adminItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "View Raised Issues", href: "/admin/raised-issues" },
    { icon: BarChart3, label: "Resolved Issues", href: "/admin/resolved-issues" },
    { icon: Wrench, label: "Manage Facilities", href: "/admin/facilities" },
  ]

  const items = user.role === "student" ? studentItems : adminItems

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white min-h-screen flex flex-col sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-700 to-orange-400 rounded-lg flex items-center justify-center">
            <span className="font-bold text-slate-900">HS</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Hostel Solve</h1>
            <p className="text-xs text-slate-400">{user.role.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 bg-slate-800/50 m-4 rounded-lg">
        <p className="text-sm font-medium text-white">{user.name}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.label
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-700"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}

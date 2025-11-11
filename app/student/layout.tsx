"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, LayoutDashboard, List, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
    else router.push("/") // redirect if not logged in
  }, [router])

  const navItems = [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "My Issues", href: "/student/my-issues", icon: List },
    { name: "Raise Issue", href: "/student/raise-issue", icon: PlusCircle },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/") // back to home/login
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-slate-900">
              HS
            </div>
            <div>
              <h1 className="text-lg font-bold">Hostel Solve</h1>
              <p className="text-xs text-slate-400">Student Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-cyan-600 text-white"
                        : "text-slate-300 hover:bg-slate-700/70"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-8 border-t border-slate-700 pt-5">
          <div className="mb-4">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-white">{user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

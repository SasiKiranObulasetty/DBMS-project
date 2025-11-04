"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { login } from "@/lib/auth"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = login(email, password)
      if (user) {
        router.push(user.role === "student" ? "/student" : "/admin")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const demoLogins = [
    { label: "Student Demo", email: "student@hostel.com" },
    { label: "Admin Demo", email: "admin@hostel.com" },
  ]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url(/images/hostel-login.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-20">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700 backdrop-blur"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md z-20 relative">
        <Card className="p-6 sm:p-8 space-y-6 border-slate-700 bg-slate-900/90 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-slate-900 font-bold text-3xl">HS</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Hostel Solve</h1>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-slate-900 font-semibold py-3 transition"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <p className="text-xs font-medium text-slate-300">Demo Credentials:</p>
            <div className="space-y-2">
              {demoLogins.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEmail(demo.email)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-300 rounded-lg transition text-left"
                >
                  <span className="font-medium text-cyan-400">{demo.label}:</span> {demo.email}
                </button>
              ))}
              <p className="text-xs text-slate-500">Password: any password</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500">Demo system - Use credentials above to explore</p>
        </Card>
      </div>
    </div>
  )
}

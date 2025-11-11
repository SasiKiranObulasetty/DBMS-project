"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ Save session
      localStorage.setItem("user", JSON.stringify(data.user));

      const userRole = data.user.role?.toLowerCase();
      const facility = data.user.facility_category?.toLowerCase();

      // ✅ Role-based routing
      if (userRole === "student") {
        router.replace("/student");
      } 
      else if (userRole === "superadmin") {
        router.replace("/admin");
      } 
      else if (userRole === "facilityadmin") {
        switch (facility) {
          case "mess":
            router.replace("/messadmin");
            break;
          case "maintenance":
            router.replace("/roomadmin"); // or /maintenanceadmin if you renamed
            break;
          case "entry-exit":
          case "entry_exit":
            router.replace("/entryexitadmin");
            break;
          case "internet":
            router.replace("/internetadmin");
            break;
          case "medical":
            router.replace("/medicaladmin");
            break;
          default:
            // 🧩 Fallback if facility_category is missing
            router.replace("/admin"); // ✅ redirect to superadmin dashboard instead
            break;
        }
      } 
      else {
        setError("Unknown user role");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="w-full max-w-md z-20 relative">
        <Card className="p-6 sm:p-8 space-y-6 border-slate-700 bg-slate-900/90 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-slate-900 font-bold text-3xl">HS</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Hostel Solve</h1>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Username or Email
              </label>
              <input
                type="text"
                placeholder="Enter username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
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

          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-cyan-400 hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

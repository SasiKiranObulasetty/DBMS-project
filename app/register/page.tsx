"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roomNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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

      <Link href="/login" className="absolute top-6 left-6 z-20">
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
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400">Register your hostel account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {["name", "email", "password", "confirmPassword", "roomNumber"].map(
              (field) => (
                <div key={field} className="space-y-2">
                  <label className="text-sm font-medium text-slate-200 capitalize">
                    {field === "confirmPassword" ? "Confirm Password" : field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={
                      field.includes("password")
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    name={field}
                    placeholder={`Enter your ${field}`}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                  />
                </div>
              )
            )}

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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

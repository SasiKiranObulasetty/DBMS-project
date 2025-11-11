"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const user = getCurrentUser();
        console.log("DEBUG AdminLayout - loaded user:", user);

        // ✅ Allow superadmin, admin, and facilityadmin
        const validRoles = ["superadmin", "admin", "facilityadmin"];

        if (user && validRoles.includes(user.role?.toLowerCase())) {
          console.log(`✅ ${user.role} access granted`);
          setAuthorized(true);

          // ✅ Optional smart redirect
          if (user.role === "facilityadmin" && !window.location.pathname.startsWith("/admin/facility")) {
            console.log("➡ Redirecting to facility admin dashboard...");
            router.replace("/admin/facility");
          } else if (user.role === "superadmin" && window.location.pathname.startsWith("/admin/facility")) {
            console.log("➡ Redirecting to superadmin dashboard...");
            router.replace("/admin");
          }

        } else {
          console.warn("⚠️ Redirecting non-admin user...");
          router.replace("/login");
        }
      } catch (error) {
        console.error("❌ Error checking admin session:", error);
        router.replace("/login");
      } finally {
        setChecked(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        Checking admin session...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

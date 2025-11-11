"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const userRaw = localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        console.log("DEBUG AdminLayout - loaded user:", user);

        if (!user) {
          console.warn("⚠️ No user found, redirecting to login...");
          router.replace("/login");
          return;
        }

        const role = user.role?.toLowerCase();

        // ✅ Superadmin stays in /admin
        if (role === "superadmin") {
          console.log("✅ Superadmin access granted");
          setAuthorized(true);
        }

        // ✅ Facilityadmin → redirect to their department dashboard
        else if (role === "facilityadmin") {
          const facility = user.facility_category?.toLowerCase();

          switch (facility) {
            case "mess":
              router.replace("/messadmin");
              break;
            case "maintenance":
              router.replace("/roomadmin"); // or /maintenanceadmin if that’s your folder name
              break;
            case "internet":
              router.replace("/internetadmin");
              break;
            case "medical":
              router.replace("/medicaladmin");
              break;
            case "entry-exit":
            case "entry_exit":
              router.replace("/entryexitadmin");
              break;
            default:
              console.warn("⚠️ Unknown facility category, redirecting to login...");
              router.replace("/login");
              break;
          }
        } 
        
        else {
          console.warn("⚠️ Unauthorized user, redirecting...");
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
      <div className="flex items-center justify-center min-h-screen text-slate-400 bg-slate-900">
        Checking admin session...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar role="superadmin" />
      <main className="flex-1">{children}</main>
    </div>
  );
}

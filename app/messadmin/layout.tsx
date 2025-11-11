"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar"; // shared sidebar

export default function MessAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const userRaw = localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        console.log("DEBUG MessAdminLayout - loaded user:", user);

        // ✅ FacilityAdmin who manages the MESS facility
        if (
          user &&
          user.role?.toLowerCase() === "facilityadmin" &&
          user.facility_category?.toLowerCase() === "mess"
        ) {
          console.log("✅ Mess Admin authorized");
          setAuthorized(true);
        }
        // ✅ Allow superadmin access too
        else if (user && user.role?.toLowerCase() === "superadmin") {
          console.log("✅ Superadmin access granted");
          setAuthorized(true);
        } 
        else {
          console.warn("⚠️ Redirecting unauthorized user...");
          router.replace("/login");
        }
      } catch (error) {
        console.error("❌ Error verifying Mess Admin:", error);
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
        Checking Mess Admin session...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* ✅ Shared Sidebar — customize items if needed */}
      <Sidebar role="messadmin" />
      <main className="flex-1">{children}</main>
    </div>
  );
}

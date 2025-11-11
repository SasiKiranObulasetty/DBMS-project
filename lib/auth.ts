import type { AuthUser } from "./types";

const CURRENT_USER_KEY = "user"; // frontend only

// ✅ Get currently logged-in user
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (err) {
    console.error("⚠️ Failed to parse current user:", err);
    return null;
  }
}

// ✅ Save user after login
export function saveUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// ✅ Logout
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ✅ Check login status
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

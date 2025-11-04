import type { AuthUser } from "./types"

const USERS_KEY = "hostel_users"
const CURRENT_USER_KEY = "hostel_current_user"

const defaultUsers: AuthUser[] = [
  {
    id: "student-1",
    email: "student@hostel.com",
    name: "Rohan Sharma",
    role: "student",
  },
  {
    id: "admin-1",
    email: "admin@hostel.com",
    name: "Admin User",
    role: "admin",
  },
]

export function initializeAuth() {
  if (typeof window === "undefined") return

  const stored = localStorage.getItem(USERS_KEY)
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  }
}

export function login(email: string, password: string): AuthUser | null {
  if (typeof window === "undefined") return null

  initializeAuth()

  const users: AuthUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  const user = users.find((u) => u.email === email)

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  }

  return null
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

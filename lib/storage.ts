import type { Issue, Facility, Resolution } from "./types"

const ISSUES_KEY = "hostel_issues"
const FACILITIES_KEY = "hostel_facilities"
const RESOLUTIONS_KEY = "hostel_resolutions"
const NOTIFICATIONS_KEY = "hostel_notifications"

const DEFAULT_FACILITIES: Facility[] = [
  {
    id: "fac-1",
    name: "Mess Food",
    category: "mess",
    location: "Building A, Ground Floor",
    status: "active",
    description: "Central mess facility for all students",
  },
  {
    id: "fac-2",
    name: "Internet",
    category: "internet",
    location: "All Blocks",
    status: "active",
    description: "WiFi and wired internet connectivity",
  },
  {
    id: "fac-3",
    name: "Room Cleaning",
    category: "cleaning",
    location: "All Rooms",
    status: "active",
    description: "Daily room cleaning service",
  },
  {
    id: "fac-4",
    name: "Entry/Exit Management",
    category: "entry-exit",
    location: "Main Gate",
    status: "active",
    description: "Gate and security management",
  },
  {
    id: "fac-5",
    name: "Medical Facility",
    category: "medical",
    location: "Building C, First Floor",
    status: "active",
    description: "On-campus medical clinic",
  },
]

const DEFAULT_ISSUES: Issue[] = [
  {
    id: "ISS001",
    title: "Room Maintenance Issue",
    description: "Broken window lock in room 102",
    category: "room-maintenance",
    status: "resolved",
    facilityId: "fac-1",
    studentId: "student-1",
    createdBy: "Rohan Sharma",
    createdAt: "2024-10-22",
  },
  {
    id: "ISS002",
    title: "Mess Food Quality",
    description: "Poor quality food in breakfast",
    category: "mess-food",
    status: "in-progress",
    facilityId: "fac-1",
    studentId: "student-1",
    createdBy: "Priya Singh",
    createdAt: "2024-10-28",
  },
  {
    id: "ISS003",
    title: "Internet Speed Issue",
    description: "Slow WiFi in Block C",
    category: "internet",
    status: "pending",
    facilityId: "fac-2",
    studentId: "student-1",
    createdBy: "Amit Kumar",
    createdAt: "2024-11-02",
  },
]

export function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(FACILITIES_KEY)) {
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(DEFAULT_FACILITIES))
  }
  if (!localStorage.getItem(ISSUES_KEY)) {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(DEFAULT_ISSUES))
  }
  if (!localStorage.getItem(RESOLUTIONS_KEY)) {
    localStorage.setItem(RESOLUTIONS_KEY, JSON.stringify([]))
  }
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]))
  }
}

// Facilities
export function getFacilities(): Facility[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  return JSON.parse(localStorage.getItem(FACILITIES_KEY) || "[]")
}

export function getFacilityById(id: string): Facility | undefined {
  return getFacilities().find((f) => f.id === id)
}

// Issues
export function getIssues(): Issue[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  return JSON.parse(localStorage.getItem(ISSUES_KEY) || "[]")
}

export function getIssueById(id: string): Issue | undefined {
  return getIssues().find((i) => i.id === id)
}

export function createIssue(issue: Omit<Issue, "id" | "createdAt">): Issue {
  if (typeof window === "undefined") throw new Error("Client-side only")

  const issues = getIssues()
  const newIssue: Issue = {
    ...issue,
    id: `ISS${String(issues.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString().split("T")[0],
  }

  issues.push(newIssue)
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues))
  return newIssue
}



export function updateIssue(id: string, updates: Partial<Issue>): Issue | null {
  if (typeof window === "undefined") return null

  const issues = getIssues()
  const index = issues.findIndex((i) => i.id === id)

  if (index === -1) return null

  issues[index] = { ...issues[index], ...updates }
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues))
  return issues[index]
}

export function saveIssue(issue: Issue) {
  if (typeof window === "undefined") return

  initializeStorage()
  const existing = JSON.parse(localStorage.getItem("hostel_issues") || "[]")
  existing.unshift(issue)
  localStorage.setItem("hostel_issues", JSON.stringify(existing))
}

export function getStudentIssues(studentId: string): Issue[] {
  return getIssues().filter((i) => i.studentId === studentId)
}

// Resolutions
export function getResolutions(): Resolution[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(RESOLUTIONS_KEY) || "[]")
}

export function createResolution(resolution: Omit<Resolution, "id" | "createdAt">): Resolution {
  if (typeof window === "undefined") throw new Error("Client-side only")

  const resolutions = getResolutions()
  const newResolution: Resolution = {
    ...resolution,
    id: `RES${String(resolutions.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  }

  resolutions.push(newResolution)
  localStorage.setItem(RESOLUTIONS_KEY, JSON.stringify(resolutions))
  return newResolution
}

export function getIssueResolution(issueId: string): Resolution | undefined {
  return getResolutions().find((r) => r.issueId === issueId)
}

// Statistics
export function getIssueStats() {
  const issues = getIssues()
  return {
    total: issues.length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    pending: issues.filter((i) => i.status === "pending" || i.status === "raised").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
  }
}

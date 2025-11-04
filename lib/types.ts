export interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
  department?: string
  enrollmentId?: string
}

export interface Student extends User {
  hostelRoom: string
  enrollmentId: string
}

export interface Admin extends User {
  department: string
  contactNumber: string
}

export interface Facility {
  id: string
  name: string
  category: "mess" | "internet" | "cleaning" | "entry-exit" | "medical"
  location: string
  status: "active" | "maintenance"
  description: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: "room-maintenance" | "mess-food" | "internet" | "cleaning" | "medical" | "entry-exit"
  status: "raised" | "in-progress" | "resolved" | "pending"
  facilityId: string
  studentId: string
  createdAt: string
  createdBy: string
}

export interface Resolution {
  id: string
  issueId: string
  adminId: string
  resolutionNotes: string
  status: "pending" | "completed"
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  message: string
  type: "info" | "warning" | "success" | "error"
  isRead: boolean
  createdAt: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: "student" | "admin"
}

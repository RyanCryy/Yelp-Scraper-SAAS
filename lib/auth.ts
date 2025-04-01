// Simple in-memory user store for demo purposes
interface User {
  email: string
  password: string
  name: string
  company: string
  phoneNumber: string
  country: string
  isAdmin: boolean
  loginHistory: Date[]
}

// In-memory user database
const users: Record<string, User> = {
  "ryan@arcxinc.agency": {
    email: "ryan@arcxinc.agency",
    password: "Eyeball123", // In a real app, this would be hashed
    name: "Ryan",
    company: "ARCX Inc",
    phoneNumber: "",
    country: "",
    isAdmin: true,
    loginHistory: [new Date()],
  },
  "ryanchamruiyang@gmail.com": {
    email: "ryanchamruiyang@gmail.com",
    password: "Eyeball123", // In a real app, this would be hashed
    name: "Ryan Cham",
    company: "ARCX",
    phoneNumber: "9112 1204",
    country: "Singapore",
    isAdmin: false,
    loginHistory: [new Date()],
  },
}

export function getUser(email: string): User | null {
  return users[email] || null
}

export function createUser(user: User): boolean {
  if (users[user.email]) {
    return false // User already exists
  }

  users[user.email] = user
  return true
}

export function updateLoginHistory(email: string): void {
  if (users[email]) {
    users[email].loginHistory.unshift(new Date())
    if (users[email].loginHistory.length > 10) {
      users[email].loginHistory = users[email].loginHistory.slice(0, 10)
    }
  }
}

export function getAllUsers(): User[] {
  return Object.values(users)
}


// Simulated in-memory database for testing purposes
// This is used because we don't have an actual MongoDB connection in this environment

interface User {
  _id: string
  email: string
  password: string
  name: string
  company: string
  phoneNumber: string
  country: string
  loginHistory: Date[]
  isAdmin: boolean
}

class SimulatedDB {
  private users: User[] = []
  private static instance: SimulatedDB

  private constructor() {
    // Initialize with empty users array
  }

  public static getInstance(): SimulatedDB {
    if (!SimulatedDB.instance) {
      SimulatedDB.instance = new SimulatedDB()
    }
    return SimulatedDB.instance
  }

  // Find a user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email)
    return user || null
  }

  // Find a user by ID
  async findUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u._id === id)
    return user || null
  }

  // Create a new user
  async createUser(userData: Omit<User, "_id">): Promise<User> {
    const newUser = {
      ...userData,
      _id: Math.random().toString(36).substring(2, 15),
    }
    this.users.push(newUser)
    return newUser
  }

  // Update a user
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex((u) => u._id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
    }

    return this.users[userIndex]
  }

  // Get all users (for debugging)
  async getAllUsers(): Promise<User[]> {
    return [...this.users]
  }
}

export default SimulatedDB.getInstance()


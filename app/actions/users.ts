"use server"

import { connectToDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { getUserModel } from "@/models/User"

export async function getAllUsers() {
  try {
    await connectToDatabase()
    const User = getUserModel()

    const users = await User.find({}).sort({ createdAt: -1 })

    return users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      company: user.company,
      phoneNumber: user.phoneNumber,
      country: user.country,
      isAdmin: user.isAdmin,
      lastLogin: user.loginHistory[0] || null,
      createdAt: user.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function searchUsers(query: string) {
  try {
    await connectToDatabase()
    const User = getUserModel()

    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 })

    return users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      company: user.company,
      phoneNumber: user.phoneNumber,
      country: user.country,
      isAdmin: user.isAdmin,
      lastLogin: user.loginHistory[0] || null,
      createdAt: user.createdAt,
    }))
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

export async function deleteUser(userId: string) {
  try {
    await connectToDatabase()
    const User = getUserModel()

    await User.findByIdAndDelete(userId)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: error.message }
  }
}

export async function addUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const company = formData.get("company") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const country = formData.get("country") as string
    const isAdmin = formData.get("isAdmin") === "true"

    if (!email || !password) {
      return { success: false, message: "Email and password are required" }
    }

    await connectToDatabase()
    const User = getUserModel()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    await User.create({
      email,
      password: hashedPassword,
      name: name || "",
      company: company || "",
      phoneNumber: phoneNumber || "",
      country: country || "",
      isAdmin,
      loginHistory: [new Date()],
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error adding user:", error)
    return { success: false, message: error.message }
  }
}


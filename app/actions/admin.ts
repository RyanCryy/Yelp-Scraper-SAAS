"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function handleAdminLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log(`Admin login attempt for: ${email}`)

  try {
    await connectToDatabase()

    // Dynamically import the User model
    const { default: User } = await import("@/models/User")

    // First, try to find the admin user
    let adminUser = await User.findOne({ email })

    // If admin doesn't exist, create it
    if (!adminUser) {
      console.log(`Admin user ${email} not found, creating...`)

      const hashedPassword = await bcrypt.hash(password, 10)

      adminUser = await User.create({
        email,
        password: hashedPassword, // Store hashed password
        name: "Admin",
        company: "ARCX Inc",
        phoneNumber: "",
        country: "",
        isAdmin: true,
        loginHistory: [new Date()],
      })

      console.log(`Admin user created with ID: ${adminUser._id}`)
    } else {
      console.log(`Admin user found with ID: ${adminUser._id}`)

      // Update the password if needed (for recovery)
      const hashedPassword = await bcrypt.hash(password, 10)
      adminUser.password = hashedPassword
      await adminUser.save()

      console.log("Admin password updated")
    }

    // Set auth cookie with user ID
    cookies().set("auth", adminUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    console.log("Admin login successful, redirecting to dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Admin login error:", error)
    return { success: false, error: error.message }
  }
}

export async function createAndLoginAdmin() {
  try {
    await connectToDatabase()

    // Dynamically import the User model
    const { default: User } = await import("@/models/User")

    // Check if admin exists, if not create it
    let adminUser = await User.findOne({ email: "ryan@arcxinc.agency" })

    if (!adminUser) {
      // Create admin user with plain password (will be hashed by the pre-save hook)
      adminUser = await User.create({
        email: "ryan@arcxinc.agency",
        password: "Eyeball123", // This will be hashed by the pre-save hook
        name: "Ryan",
        company: "ARCX Inc",
        phoneNumber: "",
        country: "",
        isAdmin: true,
        loginHistory: [new Date()],
      })
      console.log("Admin user created directly")
    }

    // Set auth cookie with user ID
    cookies().set("auth", adminUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Direct login error:", error)
    return { success: false, error: error.message }
  }
}


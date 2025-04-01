"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import User from "@/models/User"

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log(`Admin login attempt for: ${email}`)

  try {
    await connectToDatabase()

    // Find user by email
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
        phoneNumber: "123456789", // Add default phone number
        country: "Singapore", // Add default country
        isAdmin: true,
        loginHistory: [new Date()],
      })

      console.log(`Admin user created with ID: ${adminUser._id}`)
    } else {
      console.log(`Admin user found with ID: ${adminUser._id}`)

      // Update the password if needed (for recovery)
      const hashedPassword = await bcrypt.hash(password, 10)
      adminUser.password = hashedPassword

      // Ensure phone number and country are set
      if (!adminUser.phoneNumber) adminUser.phoneNumber = "123456789"
      if (!adminUser.country) adminUser.country = "Singapore"

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
    return { success: false, message: error.message }
  }
}


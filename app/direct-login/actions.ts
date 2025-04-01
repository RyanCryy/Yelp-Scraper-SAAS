"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"

export async function directAdminLogin() {
  try {
    await connectToDatabase()

    // Check if Ryan's account exists, if not create it
    let adminUser = await User.findOne({ email: "ryan@arcxinc.agency" })

    if (!adminUser) {
      // Create Ryan's account with pro subscription
      adminUser = await User.create({
        email: "ryan@arcxinc.agency",
        password: "Eyeball123", // This will be hashed by the pre-save hook
        name: "Ryan",
        company: "ARCX Inc",
        phoneNumber: "123456789", // Add default phone number
        country: "Singapore", // Add default country
        isAdmin: true,
        loginHistory: [new Date()],
        accountType: "paid",
        subscription: {
          plan: "pro",
          status: "active",
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          currentPeriodEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
      console.log("Ryan's user account created")
    } else {
      // Ensure phone number and country are set
      if (!adminUser.phoneNumber) adminUser.phoneNumber = "123456789"
      if (!adminUser.country) adminUser.country = "Singapore"
      await adminUser.save()
    }

    // Set auth cookie with user ID
    cookies().set("auth", adminUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Direct login error:", error)
    return { success: false, message: error.message }
  }
}


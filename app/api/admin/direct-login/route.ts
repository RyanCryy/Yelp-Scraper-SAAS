import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import { getUserModel } from "@/models/User"

export async function POST() {
  try {
    await connectToDatabase()
    const User = getUserModel()

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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Direct login error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}


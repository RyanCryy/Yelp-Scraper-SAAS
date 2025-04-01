import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getUserModel } from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    await connectToDatabase()
    const User = getUserModel()

    // Find user by email
    let adminUser = await User.findOne({ email })

    // If admin doesn't exist, create it
    if (!adminUser) {
      console.log(`Admin user ${email} not found, creating...`)

      const hashedPassword = await bcrypt.hash(password, 10)

      adminUser = await User.create({
        email,
        password: hashedPassword,
        name: "Admin",
        company: "ARCX Inc",
        phoneNumber: "",
        country: "",
        isAdmin: true,
        loginHistory: [new Date()],
      })
    } else {
      console.log(`Admin user found with ID: ${adminUser._id}`)

      // Update the password if needed (for recovery)
      const hashedPassword = await bcrypt.hash(password, 10)
      adminUser.password = hashedPassword
      await adminUser.save()
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
    console.error("Admin login error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}


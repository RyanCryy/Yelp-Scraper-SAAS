import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    await connectToDatabase()

    // Get the User model directly from mongoose to bypass validation
    const User = mongoose.model("User")

    // Check if admin exists
    let adminUser = await User.findOne({ email: "ryan@arcxinc.agency" })

    if (!adminUser) {
      // Create admin user directly in the database
      const hashedPassword = await bcrypt.hash("Eyeball123", 10)

      adminUser = await User.create({
        email: "ryan@arcxinc.agency",
        password: hashedPassword,
        name: "Ryan",
        company: "ARCX Inc",
        phoneNumber: "123456789",
        country: "Singapore",
        isAdmin: true,
        loginHistory: [new Date()],
      })

      console.log("Admin user created with direct method")
    } else {
      // Update the admin user to ensure it has phone and country
      if (!adminUser.phoneNumber || !adminUser.country) {
        await User.updateOne(
          { _id: adminUser._id },
          {
            $set: {
              phoneNumber: adminUser.phoneNumber || "123456789",
              country: adminUser.country || "Singapore",
            },
          },
        )
        console.log("Admin user updated with phone and country")
      }
    }

    // Set auth cookie with user ID
    cookies().set("auth", adminUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return NextResponse.json({
      success: true,
      message: "Admin login successful. You can now go to /dashboard",
    })
  } catch (error: any) {
    console.error("Fix admin login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 },
    )
  }
}


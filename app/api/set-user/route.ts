import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Set auth cookie with Ryan's ID
    cookies().set("auth", "ryan-user-id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      message: "User set to Ryan",
    })
  } catch (error: any) {
    console.error("Error setting user:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 },
    )
  }
}


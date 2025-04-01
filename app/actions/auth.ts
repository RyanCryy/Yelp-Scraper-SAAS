"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/db"
import { getUserModel } from "@/models/User"

export async function logout() {
  cookies().delete("auth")
  redirect("/login")
}

export async function getLoginHistory() {
  // Placeholder function. In a real application, this would fetch the login history from a database.
  return [new Date().toISOString()]
}

export async function checkAuth() {
  const authCookie = cookies().get("auth")
  return !!authCookie?.value
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  try {
    await connectToDatabase()
    const User = getUserModel()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password" }
    }

    // Update login history
    user.loginHistory.unshift(new Date())
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(0, 10)
    }
    await user.save()

    // Set auth cookie with user ID
    cookies().set("auth", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    revalidatePath("/dashboard")
    return { success: true, redirectUrl: "/dashboard" }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login. Please try again later.",
    }
  }
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const company = formData.get("company") as string
  const phoneNumber = formData.get("phoneNumber") as string
  const country = formData.get("country") as string

  if (!email || !password || !name || !company || !phoneNumber || !country) {
    return { success: false, message: "All fields are required" }
  }

  try {
    await connectToDatabase()
    const User = getUserModel()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with trial subscription
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 3) // 3-day trial

    await User.create({
      email,
      password: hashedPassword,
      name,
      company,
      phoneNumber,
      country,
      loginHistory: [new Date()],
      isAdmin: false,
      accountType: "free",
      subscription: {
        plan: "trial",
        status: "active",
        trialEndsAt: trialEndDate,
        currentPeriodEnds: trialEndDate,
      },
    })

    // After successful registration, log the user in
    // Set auth cookie with user ID
    const user = await User.findOne({ email })
    if (user) {
      cookies().set("auth", user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })
    }

    revalidatePath("/dashboard")
    return { success: true, redirectUrl: "/dashboard" }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration. Please try again later.",
    }
  }
}

export async function getCurrentUser() {
  const authCookie = cookies().get("auth")

  if (!authCookie?.value) {
    return null
  }

  try {
    await connectToDatabase()
    const User = getUserModel()

    const user = await User.findById(authCookie.value).select("-password")

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      company: user.company,
      phoneNumber: user.phoneNumber,
      country: user.country,
      isAdmin: user.isAdmin,
      accountType: user.accountType || "free",
      subscription: user.subscription || {
        plan: "trial",
        status: "active",
        trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        currentPeriodEnds: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}


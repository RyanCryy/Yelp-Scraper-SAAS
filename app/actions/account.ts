"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import { getUserModel } from "@/models/User"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import stripe from "@/lib/stripe"

export async function updateUserProfile(formData: FormData) {
  try {
    const authCookie = cookies().get("auth")
    if (!authCookie?.value) {
      return { success: false, message: "Authentication required" }
    }

    const name = formData.get("name") as string
    const company = formData.get("company") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const country = formData.get("country") as string
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    if (!name || !company || !phoneNumber || !country) {
      return { success: false, message: "All fields are required" }
    }

    await connectToDatabase()
    const User = getUserModel()
    const user = await User.findById(authCookie.value)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Update basic info
    user.name = name
    user.company = company
    user.phoneNumber = phoneNumber
    user.country = country

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return { success: false, message: "Current password is incorrect" }
      }

      // Hash and set new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
    }

    await user.save()
    revalidatePath("/account")
    return { success: true, message: "Profile updated successfully" }
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return { success: false, message: error.message || "An error occurred" }
  }
}

export async function cancelSubscription() {
  try {
    const authCookie = cookies().get("auth")
    if (!authCookie?.value) {
      return { success: false, message: "Authentication required" }
    }

    await connectToDatabase()
    const User = getUserModel()
    const user = await User.findById(authCookie.value)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Check if user has an active subscription
    if (!user.subscription || !user.subscription.subscriptionId) {
      return { success: false, message: "No active subscription found" }
    }

    // Cancel subscription in Stripe if it's a paid subscription
    if (user.accountType === "paid" && user.subscription.subscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscription.subscriptionId)
      } catch (stripeError: any) {
        console.error("Stripe cancellation error:", stripeError)
        // Continue with local cancellation even if Stripe fails
      }
    }

    // Update subscription status in database
    user.subscription.status = "canceled"
    await user.save()

    revalidatePath("/account")
    return { success: true, message: "Subscription canceled successfully" }
  } catch (error: any) {
    console.error("Error canceling subscription:", error)
    return { success: false, message: error.message || "An error occurred" }
  }
}


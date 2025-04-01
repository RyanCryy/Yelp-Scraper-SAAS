"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getUserModel } from "@/models/User"

export async function upgradeSubscription(formData: FormData) {
  const plan = formData.get("plan") as string
  const paymentMethod = formData.get("paymentMethod") as string

  if (!plan || !paymentMethod) {
    return { success: false, message: "Plan and payment method are required" }
  }

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

    // Set subscription end date to 30 days from now
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    // Update user subscription
    user.accountType = "paid"
    user.subscription = {
      ...user.subscription,
      plan: plan as "pro" | "enterprise",
      status: "active",
      currentPeriodEnds: endDate,
      paymentMethod: paymentMethod as "stripe" | "paypal" | "mastercard",
      // In a real implementation, you would store customer and subscription IDs from the payment provider
      customerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
      subscriptionId: `sub_${Math.random().toString(36).substring(2, 15)}`,
    }

    await user.save()

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Subscription upgrade error:", error)
    return {
      success: false,
      message: "An error occurred while processing your subscription. Please try again.",
    }
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

    // Update subscription status
    if (user.subscription) {
      user.subscription.status = "canceled"
    }

    await user.save()

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Subscription cancellation error:", error)
    return {
      success: false,
      message: "An error occurred while canceling your subscription. Please try again.",
    }
  }
}


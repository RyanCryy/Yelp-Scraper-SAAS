"use server"

import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { revalidatePath } from "next/cache"

export async function updateUserToPaid(email = "ryanchamruiyang@gmail.com") {
  try {
    await connectToDatabase()

    // Find the user
    const user = await User.findOne({ email })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Set subscription end date to 30 days from now
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    // Update to paid status
    user.accountType = "paid"
    user.subscription = {
      plan: "pro",
      status: "active",
      trialEndsAt: endDate,
      currentPeriodEnds: endDate,
      customerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
      subscriptionId: `sub_${Math.random().toString(36).substring(2, 15)}`,
      paymentMethod: "stripe",
    }

    await user.save()

    // Revalidate dashboard to show updated status
    revalidatePath("/dashboard")

    return { success: true, message: "User updated to paid status" }
  } catch (error: any) {
    console.error("Error updating user status:", error)
    return { success: false, message: error.message }
  }
}


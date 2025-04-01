import { connectToDatabase } from "./db"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

// This function runs on the server, not in middleware
export async function initializeDatabase() {
  try {
    console.log("Initializing database...")
    await connectToDatabase()

    // Get User model directly from mongoose to avoid validation issues
    const User = mongoose.model("User")

    // Check if admin exists
    const adminExists = await User.findOne({ email: "ryan@arcxinc.agency" })

    if (!adminExists) {
      // Create admin user with hashed password
      const hashedPassword = await bcrypt.hash("Eyeball123", 10)

      await User.create({
        email: "ryan@arcxinc.agency",
        password: hashedPassword,
        name: "Ryan",
        company: "ARCX Inc",
        phoneNumber: "123456789", // Add default phone number
        country: "Singapore", // Add default country
        isAdmin: true,
        loginHistory: [new Date()],
      })
      console.log("Admin user created")
    } else {
      // Ensure admin has phone and country
      if (!adminExists.phoneNumber || !adminExists.country) {
        await User.updateOne(
          { _id: adminExists._id },
          {
            $set: {
              phoneNumber: adminExists.phoneNumber || "123456789",
              country: adminExists.country || "Singapore",
            },
          },
        )
        console.log("Admin user updated with phone and country")
      }
    }

    // Check if specified user exists
    const specifiedUserExists = await User.findOne({ email: "ryanchamruiyang@gmail.com" })

    if (!specifiedUserExists) {
      // Create specified user with hashed password and paid subscription
      const hashedPassword = await bcrypt.hash("Eyeball123", 10)

      // Set subscription end date to 30 days from now
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30)

      await User.create({
        email: "ryanchamruiyang@gmail.com",
        password: hashedPassword,
        name: "Ryan Cham",
        company: "ARCX",
        phoneNumber: "9112 1204",
        country: "Singapore",
        isAdmin: false,
        loginHistory: [new Date()],
        accountType: "paid",
        subscription: {
          plan: "pro",
          status: "active",
          trialEndsAt: endDate,
          currentPeriodEnds: endDate,
          customerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
          subscriptionId: `sub_${Math.random().toString(36).substring(2, 15)}`,
          paymentMethod: "stripe",
        },
      })
      console.log("Specified user created as a paid Pro user")
    } else {
      // Update existing user to paid status if needed
      if (specifiedUserExists.accountType !== "paid" || specifiedUserExists.subscription?.plan !== "pro") {
        // Set subscription end date to 30 days from now
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 30)

        await User.updateOne(
          { _id: specifiedUserExists._id },
          {
            $set: {
              accountType: "paid",
              subscription: {
                plan: "pro",
                status: "active",
                trialEndsAt: endDate,
                currentPeriodEnds: endDate,
                customerId:
                  specifiedUserExists.subscription?.customerId || `cus_${Math.random().toString(36).substring(2, 15)}`,
                subscriptionId:
                  specifiedUserExists.subscription?.subscriptionId ||
                  `sub_${Math.random().toString(36).substring(2, 15)}`,
                paymentMethod: specifiedUserExists.subscription?.paymentMethod || "stripe",
              },
            },
          },
        )
        console.log("Specified user updated to paid Pro status")
      }
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}


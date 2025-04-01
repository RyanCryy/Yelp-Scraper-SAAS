import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import stripe from "@/lib/stripe"
import { connectToDatabase } from "@/lib/db"
import { getUserModel } from "@/models/User"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not defined")
    return NextResponse.json({ error: "Webhook secret is not configured" }, { status: 500 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object

        // Extract metadata
        const userId = session.metadata.userId

        // Update user subscription in database
        await connectToDatabase()
        const User = getUserModel()

        const user = await User.findById(userId)
        if (user) {
          // Set subscription end date to 30 days from now
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + 30)

          // Update user subscription
          user.accountType = "paid"
          user.subscription = {
            ...user.subscription,
            plan: "pro",
            status: "active",
            currentPeriodEnds: endDate,
            customerId: session.customer,
            subscriptionId: session.subscription,
            paymentMethod: "stripe",
          }

          await user.save()
          console.log(`Updated subscription for user ${userId}`)
        }
        break
      }

      case "invoice.paid": {
        // Handle successful payment for subscription renewal
        const invoice = event.data.object
        const subscriptionId = invoice.subscription
        const customerId = invoice.customer

        // Update subscription end date
        await connectToDatabase()
        const User = getUserModel()

        const user = await User.findOne({
          "subscription.subscriptionId": subscriptionId,
          "subscription.customerId": customerId,
        })

        if (user) {
          // Set new end date to 30 days from now
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + 30)

          user.subscription.currentPeriodEnds = endDate
          user.subscription.status = "active"

          await user.save()
          console.log(`Updated subscription period for user with subscription ${subscriptionId}`)
        }
        break
      }

      case "invoice.payment_failed": {
        // Handle failed payment
        const invoice = event.data.object
        const subscriptionId = invoice.subscription

        await connectToDatabase()
        const User = getUserModel()

        const user = await User.findOne({
          "subscription.subscriptionId": subscriptionId,
        })

        if (user) {
          user.subscription.status = "past_due"
          await user.save()
          console.log(`Marked subscription ${subscriptionId} as past_due`)
        }
        break
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancellation
        const subscription = event.data.object

        await connectToDatabase()
        const User = getUserModel()

        const user = await User.findOne({
          "subscription.subscriptionId": subscription.id,
        })

        if (user) {
          user.subscription.status = "canceled"
          await user.save()
          console.log(`Marked subscription ${subscription.id} as canceled`)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}

// This is needed to properly handle the raw body
export const config = {
  api: {
    bodyParser: false,
  },
}


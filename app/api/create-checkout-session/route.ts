import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import stripe from "@/lib/stripe"
import { connectToDatabase } from "@/lib/db"
import { getUserModel } from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const authCookie = cookies().get("auth")
    if (!authCookie?.value) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()
    const User = getUserModel()
    const user = await User.findById(authCookie.value)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Get the price ID from environment variables
    const priceId = process.env.STRIPE_PRO_PRICE_ID

    if (!priceId) {
      return NextResponse.json({ success: false, message: "Price ID not configured" }, { status: 500 })
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL}/subscription/checkout?canceled=true`,
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      metadata: {
        userId: user._id.toString(),
        plan: "pro",
      },
    })

    return NextResponse.json({ success: true, url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}


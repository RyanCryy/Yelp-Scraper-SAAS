import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Session ID is required" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Payment not completed" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error verifying session:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}


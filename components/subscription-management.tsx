"use client"

import { useState } from "react"
import { cancelSubscription } from "@/app/actions/account"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

interface SubscriptionManagementProps {
  user: {
    id: string
    email: string
    accountType: "free" | "paid"
    subscription?: {
      plan: "trial" | "pro"
      status: "active" | "canceled" | "past_due" | "unpaid"
      trialEndsAt: Date
      currentPeriodEnds: Date
      customerId?: string
      subscriptionId?: string
      paymentMethod?: "stripe" | "paypal" | "mastercard"
    }
  }
}

export function SubscriptionManagement({ user }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleCancelSubscription() {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await cancelSubscription()
      if (result.success) {
        setSuccess(result.message)
        setIsDialogOpen(false)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate days left in trial or subscription
  const now = new Date()
  let daysLeft = 0
  let endDate: Date | null = null

  if (user.subscription) {
    if (user.accountType === "free") {
      endDate = new Date(user.subscription.trialEndsAt)
    } else {
      endDate = new Date(user.subscription.currentPeriodEnds)
    }
    daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  // Check if subscription is active
  const isActive = user.subscription?.status === "active"
  const isCanceled = user.subscription?.status === "canceled"
  const isPastDue = user.subscription?.status === "past_due"
  const isUnpaid = user.subscription?.status === "unpaid"
  const isPro = user.subscription?.plan === "pro" && user.accountType === "paid"
  const isTrial = user.subscription?.plan === "trial" || user.accountType === "free"

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6">Subscription Management</h2>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <Card className="p-6 border-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Plan</h3>
            <div className="flex items-center gap-2">
              {isPro ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="mr-1">●</span>
                  <span className="text-blue-600 font-bold">PRO</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <span className="mr-1">●</span>
                  <span className="text-gray-600">FREE TRIAL</span>
                </span>
              )}

              {isCanceled && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  CANCELED
                </span>
              )}

              {isPastDue && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  PAST DUE
                </span>
              )}

              {isUnpaid && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  UNPAID
                </span>
              )}
            </div>
          </div>

          {endDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                {isTrial ? "Trial ends" : isCanceled ? "Access until" : "Next billing date"}
              </h3>
              <p className="text-gray-900">
                {endDate.toLocaleDateString()} ({daysLeft} days left)
              </p>
            </div>
          )}

          {user.subscription?.paymentMethod && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Payment method</h3>
              <p className="text-gray-900 capitalize">{user.subscription.paymentMethod}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            {isPro && isActive && !isCanceled ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Cancel Your Subscription?
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your Pro subscription? You'll lose access to premium features when
                      your current billing period ends.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-500">
                      If you cancel, your subscription will remain active until {endDate?.toLocaleDateString()}, after
                      which your account will be downgraded to the free plan.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Keep Subscription
                    </Button>
                    <Button
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? "Canceling..." : "Confirm Cancellation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : isTrial || isCanceled || isPastDue || isUnpaid ? (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/subscription/checkout">
                  {isTrial ? "Upgrade to Pro" : isCanceled ? "Reactivate Subscription" : "Fix Payment Issue"}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {isPro && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pro Plan Benefits</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Unlimited searches</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Export to CSV</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Email verification</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Phone number verification</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Priority support</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}


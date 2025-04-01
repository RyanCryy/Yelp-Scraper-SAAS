"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { SubscriptionPlans } from "@/components/subscription-plans"

interface SubscriptionBadgeProps {
  plan: "trial" | "pro"
  status: "active" | "canceled" | "past_due" | "unpaid"
  trialEndsAt: Date
  accountType?: "free" | "paid"
}

export function SubscriptionBadge({ plan, status, trialEndsAt, accountType = "free" }: SubscriptionBadgeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Calculate days left in trial
  const daysLeft = Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  // Check if trial has expired
  const isExpired = plan === "trial" && daysLeft === 0

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="focus:outline-none">
          {plan === "pro" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <span className="mr-1">●</span>
              <span className="text-blue-600 font-bold">PRO</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isExpired ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              <span className={`mr-1 ${isExpired ? "text-red-500" : "text-gray-500"}`}>●</span>
              <span className={isExpired ? "text-red-600" : "text-gray-600"}>
                {accountType.toUpperCase()} {isExpired ? "(EXPIRED)" : daysLeft > 0 ? `(${daysLeft} days left)` : ""}
              </span>
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Subscription</h3>
          <SubscriptionPlans currentPlan={plan} />
          <div className="flex justify-end">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


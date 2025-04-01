"use client"

import { Check } from "lucide-react"
import Link from "next/link"

interface SubscriptionPlansProps {
  currentPlan: "trial" | "pro"
}

export function SubscriptionPlans({ currentPlan }: SubscriptionPlansProps) {
  const plan = {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Perfect for agencies and freelancers",
    features: [
      "Unlimited searches",
      "Export to CSV",
      "Email verification",
      "Phone number verification",
      "Priority support",
    ],
    highlighted: currentPlan === "pro",
    color: "bg-blue-50 border-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    textColor: "text-blue-600",
  }

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`rounded-lg border p-6 ${
          plan.highlighted ? `${plan.color} ring-2 ring-offset-2 ring-blue-600` : "border-gray-200"
        }`}
      >
        <div className="mb-4">
          <h3 className={`text-xl font-bold ${plan.highlighted ? plan.textColor : "text-gray-900"}`}>{plan.name}</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
            <span className="ml-1 text-sm text-gray-500">{plan.period}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
        </div>
        <ul className="mb-6 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <div>
          {currentPlan === plan.id ? (
            <button
              disabled
              className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <Link
              href={`/subscription/checkout`}
              className={`w-full rounded-md ${plan.buttonColor} px-4 py-2 text-sm font-medium text-white inline-block text-center`}
            >
              {currentPlan === "trial" ? "Subscribe" : "Upgrade"}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}


"use client"

import { Menu, X, Settings } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { useState } from "react"
import Link from "next/link"
import { SubscriptionBadge } from "@/components/subscription-badge"

interface HeaderProps {
  showLogout?: boolean
  username?: string
  subscription?: {
    plan: "trial" | "pro" | "enterprise"
    status: "active" | "canceled" | "past_due" | "unpaid"
    trialEndsAt: Date
  }
}

export function Header({ showLogout = false, username, subscription }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200">
      {/* Main header row */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-lg font-medium tracking-tight text-gray-900">
            ARCX Marketing
          </Link>
        </div>

        {showLogout && (
          <>
            {/* Desktop view */}
            <div className="hidden sm:flex items-center gap-6">
              {username && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{username}</span>
                  {subscription && (
                    <SubscriptionBadge
                      plan={subscription.plan}
                      status={subscription.status}
                      trialEndsAt={subscription.trialEndsAt}
                    />
                  )}
                </div>
              )}
              <Link
                href="/account"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                <span>Account</span>
              </Link>
              <button onClick={() => logout()} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {showLogout && mobileMenuOpen && (
        <div className="sm:hidden py-3 border-t border-gray-200 mb-2">
          <div className="flex flex-col gap-4">
            {username && (
              <div className="flex items-center gap-2 px-1">
                <span className="text-sm text-gray-600">{username}</span>
                {subscription && (
                  <SubscriptionBadge
                    plan={subscription.plan}
                    status={subscription.status}
                    trialEndsAt={subscription.trialEndsAt}
                  />
                )}
              </div>
            )}
            <Link
              href="/account"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span>Account</span>
            </Link>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}


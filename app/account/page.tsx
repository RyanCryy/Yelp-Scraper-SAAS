import { redirect } from "next/navigation"
import { getCurrentUser } from "../actions/auth"
import { Header } from "@/components/header"
import { AccountSettings } from "@/components/account-settings"
import { SubscriptionManagement } from "@/components/subscription-management"

export default async function AccountPage() {
  // Get current user using database authentication
  const user = await getCurrentUser()

  // If user is not authenticated, redirect to login
  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Header showLogout={true} username={user.email} subscription={user.subscription} />

        <div className="mt-12 mb-8">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Account Settings</h1>
          <p className="text-lg text-gray-600 max-w-3xl">Manage your profile information and subscription settings.</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 max-w-5xl mb-16">
          <AccountSettings user={user} />
          <SubscriptionManagement user={user} />
        </div>
      </div>
    </main>
  )
}


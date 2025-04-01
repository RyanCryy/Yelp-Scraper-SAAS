import { redirect } from "next/navigation"
import { getLoginHistory, getCurrentUser } from "../actions/auth"
import { SearchForm } from "@/components/search-form"
import { Header } from "@/components/header"
import { LoginHistory } from "@/components/login-history"
import { UserProfile } from "@/components/user-profile"
import { UpgradePrompt } from "@/components/upgrade-prompt"

export default async function Dashboard() {
  // Get current user using database authentication
  const user = await getCurrentUser()

  // If user is not authenticated, redirect to login
  if (!user) {
    redirect("/login")
  }

  // Get login history with error handling
  let loginHistory = []
  try {
    loginHistory = (await getLoginHistory()) || []

    // Ensure loginHistory is an array
    if (!Array.isArray(loginHistory)) {
      console.error("Login history is not an array:", loginHistory)
      loginHistory = []
    }
  } catch (error) {
    console.error("Error fetching login history:", error)
  }

  // Check if the trial has expired
  const isTrialExpired =
    user.accountType === "free" &&
    user.subscription &&
    new Date(user.subscription.trialEndsAt) < new Date() &&
    user.subscription.plan === "trial"

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Header showLogout={true} username={user.email} subscription={user.subscription} />

        {/* Show upgrade prompt if trial has expired */}
        {user.subscription && (
          <UpgradePrompt isExpired={isTrialExpired} trialEndsAt={new Date(user.subscription.trialEndsAt)} />
        )}

        {/* Welcome Message */}
        <div className="mt-12 mb-16">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Welcome, {user.name.split(" ")[0]}.</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Ready to discover new leads for your business? Start by searching for a location and niche below.
          </p>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2 max-w-5xl">
          <UserProfile user={user} />
          <LoginHistory history={loginHistory} />
        </div>

        <div className="mt-16 max-w-3xl">
          <SearchForm subscription={user.subscription} accountType={user.accountType} />
        </div>
      </div>
    </main>
  )
}


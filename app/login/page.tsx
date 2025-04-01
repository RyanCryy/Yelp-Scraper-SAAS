import { AuthForm } from "@/components/auth-form"
import { initializeDatabase } from "@/lib/init-db"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  // Initialize admin user
  try {
    await initializeDatabase()
  } catch (error) {
    console.error("Failed to initialize database:", error)
    // Continue anyway, as we don't want to block the login page
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      <div className="container max-w-md px-4 pt-20 sm:pt-24">
        <AuthForm defaultTab={searchParams.tab === "register" ? "register" : "login"} />

        <div className="mt-4 text-center text-xs text-gray-500">
          <Link href="/admin-login" className="hover:text-gray-700">
            Admin Access
          </Link>
        </div>
      </div>
    </main>
  )
}


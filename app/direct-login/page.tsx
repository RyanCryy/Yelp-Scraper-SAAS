"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { directAdminLogin } from "./actions"
import { updateUserToPaid } from "@/app/actions/update-user-status"
import Link from "next/link"

export default function DirectLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleLogin() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await directAdminLogin()

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "An error occurred during login")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdateUser() {
    setIsLoading(true)
    setMessage("Updating user status...")

    try {
      const result = await updateUserToPaid()

      if (result.success) {
        setMessage("User successfully updated to paid status!")
      } else {
        setError(result.message || "An error occurred updating user status")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login as Ryan</h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">{message}</div>}

        <div className="space-y-4">
          <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login as Ryan"}
          </Button>

          <Button onClick={handleUpdateUser} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update ryanchamruiyang@gmail.com to Paid"}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
            Return to normal login
          </Link>
        </div>
      </div>
    </div>
  )
}


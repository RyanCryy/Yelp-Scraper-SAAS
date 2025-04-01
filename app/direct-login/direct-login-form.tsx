"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { directAdminLogin } from "./actions"

export default function DirectLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}

      <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login as Admin"}
      </Button>
    </>
  )
}


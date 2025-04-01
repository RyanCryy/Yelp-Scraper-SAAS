"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminLogin } from "./actions"

export default function AdminLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await adminLogin(formData)

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
    <form action={handleSubmit} className="space-y-6">
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="email">Admin Email</Label>
        <Input id="email" name="email" type="email" defaultValue="ryan@arcxinc.agency" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Admin Password</Label>
        <Input id="password" name="password" type="password" defaultValue="Eyeball123" required />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login as Admin"}
        </Button>
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        This page will create or update the admin account with the provided credentials.
      </p>
    </form>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FixUserPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [adminFixed, setAdminFixed] = useState(false)
  const [userFixed, setUserFixed] = useState(false)

  async function fixAdminLogin() {
    setIsLoading(true)
    setMessage("Fixing admin login...")

    try {
      const response = await fetch("/api/admin/fix-login")
      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setAdminFixed(true)
      } else {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function fixUserStatus() {
    setIsLoading(true)
    setMessage("Fixing user status...")

    try {
      const response = await fetch("/api/admin/fix-user-status")
      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setUserFixed(true)
      } else {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Fix ARCX Marketing</h1>

        {message && (
          <div
            className={`p-4 mb-6 rounded-md ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={fixAdminLogin}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || adminFixed}
          >
            {adminFixed ? "Admin Login Fixed ✓" : isLoading ? "Fixing..." : "Fix Admin Login"}
          </Button>

          <Button
            onClick={fixUserStatus}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || userFixed}
          >
            {userFixed ? "User Status Fixed ✓" : isLoading ? "Fixing..." : "Fix User Status"}
          </Button>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


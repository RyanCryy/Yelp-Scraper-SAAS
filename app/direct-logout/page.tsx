import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DirectLogoutPage() {
  async function clearAuthCookies() {
    "use server"
    cookies().delete("auth")
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Emergency Logout</h1>
        <p className="mb-6 text-center text-gray-600">This will clear all authentication cookies and log you out.</p>

        <form action={clearAuthCookies}>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Clear All Auth Cookies
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  )
}


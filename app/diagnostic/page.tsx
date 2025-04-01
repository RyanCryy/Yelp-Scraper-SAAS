import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DiagnosticPage() {
  // Check cookies
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()

  // Check MongoDB connection
  let dbStatus = "Unknown"
  let dbError = null
  const mongodbUri = process.env.MONGODB_URI || "Not configured"

  // Mask sensitive parts of the connection string
  const maskedUri = mongodbUri !== "Not configured" ? mongodbUri.replace(/:([^@]+)@/, ":***@") : mongodbUri

  try {
    await connectToDatabase()
    const connectionState = mongoose.connection.readyState
    dbStatus =
      connectionState === 0
        ? "Disconnected"
        : connectionState === 1
          ? "Connected"
          : connectionState === 2
            ? "Connecting"
            : connectionState === 3
              ? "Disconnecting"
              : "Unknown"
  } catch (error: any) {
    dbStatus = "Error"
    dbError = error.message
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">System Diagnostic</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current authentication cookies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Cookies:</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {allCookies.length === 0 ? (
                      <li className="text-red-500">No cookies found</li>
                    ) : (
                      allCookies.map((cookie, i) => (
                        <li key={i}>
                          <span className="font-mono">{cookie.name}</span>: {cookie.value.substring(0, 20)}
                          {cookie.value.length > 20 ? "..." : ""}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/direct-login">Emergency Login</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/direct-logout">Clear All Auth</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>MongoDB connection information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Connection Status:</h3>
                  <p className={`mt-1 ${dbStatus === "Connected" ? "text-green-500" : "text-red-500"}`}>{dbStatus}</p>

                  {dbError && (
                    <div className="mt-2">
                      <h3 className="font-medium">Error:</h3>
                      <p className="text-red-500 mt-1 font-mono text-sm">{dbError}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">MongoDB URI:</h3>
                  <p className="mt-1 font-mono text-sm">{maskedUri}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
              <CardDescription>System environment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Node.js Version:</h3>
                  <p className="mt-1">{process.version}</p>
                </div>

                <div>
                  <h3 className="font-medium">Environment:</h3>
                  <p className="mt-1">{process.env.NODE_ENV || "development"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Vercel URL:</h3>
                  <p className="mt-1">{process.env.VERCEL_URL || "Not configured"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-4">
            <Button asChild variant="outline">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}


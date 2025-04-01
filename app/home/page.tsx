import { redirect } from "next/navigation"
import { checkAuth } from "../actions/auth"

export default async function Home() {
  // Check if user is authenticated
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}


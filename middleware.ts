import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware doesn't use mongoose
export function middleware(request: NextRequest) {
  // Simple middleware that doesn't modify the request
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ["/api/:path*"],
}


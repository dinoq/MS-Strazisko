import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    const { pathname } = req.nextUrl
  
    // Nepoužívej middleware pro přihlašovací stránku
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }
  
    return withAuth({
      pages: {
      signIn: "../../admin/login"
      }
    })(req as NextRequestWithAuth, event)
  }
  
  export const config = {
    matcher: [
      '/admin/:path*',       // chrání admin rozhraní
      '/api/admin/:path*'    // chrání admin API
    ]
  }
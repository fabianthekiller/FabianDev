import { auth } from "@/auth"
 
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/api/auth/signin", req.url)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|logo_white.png|loginbg.webp|/themes/viva-dark/theme.css|/themes/lara-light-indigo/theme.css).*)"],
}
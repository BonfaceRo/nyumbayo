import Link from "next/link"
import { Home } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/shared/logout-button"

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let dashboardHref = "/dashboard"
  let displayName: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single()

    displayName = profile?.full_name ?? null

    if (profile?.role === "landlord") dashboardHref = "/landlord"
    if (profile?.role === "admin" || profile?.role === "super_admin")
      dashboardHref = "/admin"
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Home className="h-6 w-6" />
          Nyumbayo
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/search?listingType=rent" className="hover:text-primary">
            Rent
          </Link>
          <Link href="/search?listingType=sale" className="hover:text-primary">
            Buy
          </Link>
          {user && (
            <Link href="/landlord/listings/new" className="hover:text-primary">
              List your property
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Hi, {displayName?.split(" ")[0]}
              </span>
              <Link href={dashboardHref}>
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

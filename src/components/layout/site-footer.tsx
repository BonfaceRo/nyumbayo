import Link from "next/link"
import { Home } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-card px-4 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Home className="h-5 w-5" />
            Nyumbayo
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Trusted real estate, built for Malawi.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/search?listingType=rent" className="hover:text-primary">Rent</Link></li>
            <li><Link href="/search?listingType=sale" className="hover:text-primary">Buy</Link></li>
            <li><Link href="/search" className="hover:text-primary">All listings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/register" className="hover:text-primary">Sign up</Link></li>
            <li><Link href="/login" className="hover:text-primary">Log in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Contact</li>
            <li>Report a scam</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nyumbayo. All rights reserved.
      </div>
    </footer>
  )
}

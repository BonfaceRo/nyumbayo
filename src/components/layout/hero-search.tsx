"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Find a home you can trust
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Verified owners. Verified listings. No fake agents, no scams —
          just real property, across all of Malawi.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-xl gap-2 rounded-full border bg-card p-2 shadow-sm"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by location, e.g. Area 47, Lilongwe"
              className="border-0 shadow-none focus-visible:ring-0 px-0"
            />
          </div>
          <Button type="submit" className="rounded-full px-6">
            Search
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Popular:</span>
          {["Lilongwe", "Blantyre", "Mzuzu", "Zomba"].map((city) => (
            <button
              key={city}
              onClick={() => router.push(`/search?q=${city}`)}
              className="rounded-full border px-3 py-1 hover:bg-accent hover:text-accent-foreground"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  { label: "Any type", value: "" },
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Land", value: "land" },
  { label: "Farm", value: "farm" },
  { label: "Office", value: "office" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Hotel", value: "hotel" },
  { label: "Student accommodation", value: "student_accommodation" },
  { label: "Vacation rental", value: "vacation_rental" },
]

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "")
  const [listingType, setListingType] = useState(searchParams.get("listingType") ?? "")
  const [category, setCategory] = useState(searchParams.get("category") ?? "")
  const [verifiedOnly, setVerifiedOnly] = useState(
    searchParams.get("verifiedOnly") === "true"
  )

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())

    const setOrDelete = (key: string, value: string) => {
      if (value) params.set(key, value)
      else params.delete(key)
    }

    setOrDelete("minPrice", minPrice)
    setOrDelete("maxPrice", maxPrice)
    setOrDelete("bedrooms", bedrooms)
    setOrDelete("listingType", listingType)
    setOrDelete("category", category === "any" ? "" : category)

    if (verifiedOnly) params.set("verifiedOnly", "true")
    else params.delete("verifiedOnly")

    router.push(`/search?${params.toString()}`)
  }

  function clearFilters() {
    setMinPrice("")
    setMaxPrice("")
    setBedrooms("")
    setListingType("")
    setCategory("")
    setVerifiedOnly(false)
    router.push("/search")
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-5">
      <div>
        <Label className="mb-2 block text-sm font-semibold">Listing type</Label>
        <div className="flex gap-2">
          {[
            { label: "Any", value: "" },
            { label: "Rent", value: "rent" },
            { label: "Sale", value: "sale" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setListingType(option.value)}
              className={`rounded-full border px-3 py-1 text-sm ${
                listingType === option.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-semibold">Property type</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value || "any"} value={c.value || "any"}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-semibold">Price range (MWK)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-semibold">Minimum bedrooms</Label>
        <div className="flex gap-2">
          {["", "1", "2", "3", "4"].map((n) => (
            <button
              key={n || "any"}
              onClick={() => setBedrooms(n)}
              className={`h-9 w-9 rounded-full border text-sm ${
                bedrooms === n ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {n === "" ? "Any" : n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold" htmlFor="verifiedOnly">
          Verified only
        </Label>
        <input
          id="verifiedOnly"
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Clear
        </Button>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Home, Building2, Trees, Warehouse, Hotel, GraduationCap } from "lucide-react"

const categories = [
  { label: "Houses", value: "house", icon: Home },
  { label: "Apartments", value: "apartment", icon: Building2 },
  { label: "Land", value: "land", icon: Trees },
  { label: "Commercial", value: "warehouse", icon: Warehouse },
  { label: "Hotels", value: "hotel", icon: Hotel },
  { label: "Student Housing", value: "student_accommodation", icon: GraduationCap },
]

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-xl font-bold">Browse by category</h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {categories.map(({ label, value, icon: Icon }) => (
          <Link
            key={value}
            href={`/search?category=${value}`}
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-shadow hover:shadow-md"
          >
            <Icon className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

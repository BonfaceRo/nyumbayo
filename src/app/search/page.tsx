import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/property/property-card"
import { SearchFilters } from "@/components/property/search-filters"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    listingType?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    verifiedOnly?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("properties")
    .select(
      "id, title, price, currency, price_period, listing_type, bedrooms, bathrooms, district, city, is_verified, is_featured, property_images(image_url, is_primary)"
    )
    .eq("status", "active")

  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,district.ilike.%${params.q}%,city.ilike.%${params.q}%`
    )
  }
  if (params.listingType) {
    query = query.eq("listing_type", params.listingType)
  }
  if (params.category) {
    query = query.eq("category", params.category)
  }
  if (params.minPrice) {
    query = query.gte("price", Number(params.minPrice))
  }
  if (params.maxPrice) {
    query = query.lte("price", Number(params.maxPrice))
  }
  if (params.bedrooms) {
    query = query.gte("bedrooms", Number(params.bedrooms))
  }
  if (params.verifiedOnly === "true") {
    query = query.eq("is_verified", true)
  }

  const { data: properties, error } = await query
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">
        {params.q ? `Properties in "${params.q}"` : "All properties"}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {properties?.length ?? 0} result{properties?.length === 1 ? "" : "s"} found
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
        <aside>
          <SearchFilters />
        </aside>

        <section>
          {error && (
            <p className="text-sm text-red-600">
              Something went wrong loading properties.
            </p>
          )}

          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const primaryImage =
                  property.property_images?.find((img) => img.is_primary)
                    ?.image_url ?? property.property_images?.[0]?.image_url

                return (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    price={property.price}
                    currency={property.currency}
                    pricePeriod={property.price_period}
                    listingType={property.listing_type}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    district={property.district}
                    city={property.city}
                    imageUrl={primaryImage}
                    isVerified={property.is_verified}
                    isFeatured={property.is_featured}
                  />
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                No properties match your search. Try adjusting your filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

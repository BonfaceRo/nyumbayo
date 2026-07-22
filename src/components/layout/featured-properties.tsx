import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/property/property-card"
import { Button } from "@/components/ui/button"

export async function FeaturedProperties() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select(
      "id, title, price, currency, price_period, listing_type, bedrooms, bathrooms, district, city, is_verified, is_featured, property_images(image_url, is_primary)"
    )
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Featured properties</h2>
        <Link href="/search">
          <Button variant="outline" size="sm">
            View all
          </Button>
        </Link>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            No properties listed yet. Be the first to list a verified property
            on Nyumbayo.
          </p>
          <Link href="/register">
            <Button className="mt-4">List your property</Button>
          </Link>
        </div>
      )}
    </section>
  )
}

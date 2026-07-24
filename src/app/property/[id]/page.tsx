import Image from "next/image"
import { notFound } from "next/navigation"
import { Bed, Bath, Ruler, MapPin, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select(
      `id, title, description, price, currency, price_period, listing_type, category,
       bedrooms, bathrooms, land_size, region, district, city, address_line,
       is_verified, view_count, created_at, owner_id,
       property_images(image_url, is_primary, sort_order),
       profiles!properties_owner_id_fkey(full_name, phone, avatar_url, identity_verification_status)`
    )
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (!property) notFound()

  const images = [...(property.property_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )
  const owner = property.profiles as unknown as {
    full_name: string
    phone: string | null
    identity_verification_status: string
  }
  const formattedPrice = new Intl.NumberFormat("en-US").format(property.price)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Image gallery */}
      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        {images.length > 0 ? (
          images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ${
                i === 0 ? "sm:col-span-2 sm:row-span-2 sm:aspect-auto" : ""
              }`}
            >
              <Image src={img.image_url} alt={property.title} fill className="object-cover" />
            </div>
          ))
        ) : (
          <div className="col-span-full flex aspect-video items-center justify-center rounded-xl bg-muted text-muted-foreground">
            No images available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main content */}
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {property.is_verified && <VerifiedBadge />}
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium capitalize">
                  For {property.listing_type}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.city ? `${property.city}, ` : ""}
                {property.district}, {property.region}
              </p>
            </div>
          </div>

          <p className="mb-6 text-3xl font-bold text-primary">
            {property.currency} {formattedPrice}
            {property.price_period && (
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {property.price_period}
              </span>
            )}
          </p>

          <div className="mb-6 flex gap-6 border-y py-4">
            {property.bedrooms != null && (
              <span className="flex items-center gap-2 text-sm">
                <Bed className="h-5 w-5 text-primary" /> {property.bedrooms} Bedrooms
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-2 text-sm">
                <Bath className="h-5 w-5 text-primary" /> {property.bathrooms} Bathrooms
              </span>
            )}
            {property.land_size != null && (
              <span className="flex items-center gap-2 text-sm">
                <Ruler className="h-5 w-5 text-primary" /> {property.land_size} sqm
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 font-semibold">Listed by</h3>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {owner?.full_name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="font-medium">{owner?.full_name}</p>
                  {owner?.identity_verification_status === "verified" && (
                    <VerifiedBadge size="sm" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full">Contact owner</Button>
                <Button variant="outline" className="w-full">
                  Book a viewing
                </Button>
                {owner?.phone && (
                  <p className="flex items-center justify-center gap-1 pt-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {owner.phone}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

import Image from "next/image"
import Link from "next/link"
import { Bed, Bath, MapPin } from "lucide-react"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { Card } from "@/components/ui/card"

interface PropertyCardProps {
  id: string
  title: string
  price: number
  currency?: string
  pricePeriod?: string | null
  listingType: "rent" | "sale"
  bedrooms?: number | null
  bathrooms?: number | null
  district: string
  city?: string | null
  imageUrl?: string | null
  isVerified?: boolean
  isFeatured?: boolean
}

export function PropertyCard({
  id,
  title,
  price,
  currency = "MWK",
  pricePeriod,
  listingType,
  bedrooms,
  bathrooms,
  district,
  city,
  imageUrl,
  isVerified,
  isFeatured,
}: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US").format(price)

  return (
    <Link href={`/property/${id}`}>
      <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            {isVerified && <VerifiedBadge size="sm" />}
            {isFeatured && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                Featured
              </span>
            )}
          </div>

          <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium capitalize backdrop-blur-sm">
            For {listingType}
          </div>
        </div>

        <div className="space-y-2 p-4">
          <p className="text-lg font-bold text-foreground">
            {currency} {formattedPrice}
            {pricePeriod && (
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {pricePeriod}
              </span>
            )}
          </p>

          <h3 className="line-clamp-1 font-medium text-foreground">{title}</h3>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {city ? `${city}, ${district}` : district}
          </p>

          {(bedrooms || bathrooms) && (
            <div className="flex gap-4 pt-1 text-sm text-muted-foreground">
              {bedrooms && (
                <span className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  {bedrooms}
                </span>
              )}
              {bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" />
                  {bathrooms}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}

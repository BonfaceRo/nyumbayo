"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { propertySchema, type PropertyFormValues } from "@/lib/validations/property"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUploader } from "@/components/property/image-uploader"

const categories = [
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Land", value: "land" },
  { label: "Farm", value: "farm" },
  { label: "Office", value: "office" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Hotel", value: "hotel" },
  { label: "Student accommodation", value: "student_accommodation" },
  { label: "Vacation rental", value: "vacation_rental" },
  { label: "Commercial (other)", value: "commercial_other" },
]

export default function NewListingPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      listingType: undefined,
      category: undefined,
      price: undefined,
      pricePeriod: "",
      region: "",
      district: "",
      city: "",
      addressLine: "",
    },
  })

  const listingType = watch("listingType")
  const category = watch("category")

  async function onSubmit(values: PropertyFormValues) {
    setServerError(null)
    setIsSubmitting(true)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setServerError("You must be logged in.")
      setIsSubmitting(false)
      return
    }

    // 1. Insert the property as draft/pending_review
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        owner_id: user.id,
        title: values.title,
        description: values.description,
        listing_type: values.listingType,
        category: values.category,
        price: values.price,
        price_period: values.listingType === "rent" ? values.pricePeriod || "month" : null,
        bedrooms: values.bedrooms ?? null,
        bathrooms: values.bathrooms ?? null,
        land_size: values.landSize ?? null,
        region: values.region,
        district: values.district,
        city: values.city || null,
        address_line: values.addressLine || null,
        status: "pending_review",
      })
      .select()
      .single()

    if (propertyError || !property) {
      setServerError(propertyError?.message ?? "Failed to create listing.")
      setIsSubmitting(false)
      return
    }

    // 2. Upload images (if any) to Supabase Storage, then link them in property_images
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const filePath = `${user.id}/${property.id}/${Date.now()}-${file.name}`

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file)

        if (uploadError) {
          console.error("Image upload error:", uploadError)
          continue
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(filePath)

        await supabase.from("property_images").insert({
          property_id: property.id,
          image_url: publicUrl,
          is_primary: i === 0,
          sort_order: i,
        })
      }
    }

    setIsSubmitting(false)
    router.push("/landlord/listings")
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">List your property</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Spacious 3-bedroom house in Area 47"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={5}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Describe the property, amenities, and surrounding area..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Listing type</Label>
                <Select
                  value={listingType}
                  onValueChange={(v) =>
                    setValue("listingType", v as PropertyFormValues["listingType"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rent or sale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">For rent</SelectItem>
                    <SelectItem value="sale">For sale</SelectItem>
                  </SelectContent>
                </Select>
                {errors.listingType && (
                  <p className="text-sm text-red-600">{errors.listingType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Property type</Label>
                <Select
                  value={category}
                  onValueChange={(v) =>
                    setValue("category", v as PropertyFormValues["category"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (MWK)</Label>
                <Input id="price" type="number" {...register("price")} />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
              {listingType === "rent" && (
                <div className="space-y-2">
                  <Label>Billing period</Label>
                  <Select
                    onValueChange={(v) => setValue("pricePeriod", v)}
                    defaultValue="month"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Per month</SelectItem>
                      <SelectItem value="year">Per year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" {...register("bedrooms")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" {...register("bathrooms")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landSize">Land size (sqm)</Label>
                <Input id="landSize" type="number" {...register("landSize")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" placeholder="e.g. Central Region" {...register("region")} />
                {errors.region && (
                  <p className="text-sm text-red-600">{errors.region.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="e.g. Lilongwe" {...register("district")} />
                {errors.district && (
                  <p className="text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Area/Town</Label>
                <Input id="city" placeholder="e.g. Area 47" {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine">Address (optional)</Label>
                <Input id="addressLine" {...register("addressLine")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader onFilesSelected={setImageFiles} />
          </CardContent>
        </Card>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit for review"}
        </Button>
      </form>
    </main>
  )
}

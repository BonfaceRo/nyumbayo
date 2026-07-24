import { z } from "zod"

export const propertySchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  listingType: z.enum(["rent", "sale"], { message: "Select rent or sale" }),
  category: z.enum(
    [
      "house",
      "apartment",
      "land",
      "farm",
      "office",
      "warehouse",
      "hotel",
      "student_accommodation",
      "vacation_rental",
      "commercial_other",
    ],
    { message: "Select a property type" }
  ),
  price: z.coerce.number().positive("Price must be greater than 0"),
  pricePeriod: z.string().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  landSize: z.coerce.number().positive().optional(),
  region: z.string().min(2, "Region is required"),
  district: z.string().min(2, "District is required"),
  city: z.string().optional(),
  addressLine: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>

"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxImages?: number
}

export function ImageUploader({ onFilesSelected, maxImages = 10 }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    const combined = [...previews, ...files.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(
      0,
      maxImages
    )

    setPreviews(combined)
    onFilesSelected(combined.map((p) => p.file))
  }

  function removeImage(index: number) {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onFilesSelected(updated.map((p) => p.file))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
            <Image src={preview.url} alt={`Upload ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Cover
              </span>
            )}
          </div>
        ))}

        {previews.length < maxImages && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:bg-accent">
            <Upload className="h-5 w-5" />
            <span className="text-xs">Add photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Add up to {maxImages} photos. The first photo will be used as the cover image.
      </p>
    </div>
  )
}

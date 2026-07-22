import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Have a property to rent or sell?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-primary-foreground/90">
          List it on Nyumbayo and reach verified renters and buyers across
          Malawi — for free.
        </p>
        <Link href="/register">
          <Button
            size="lg"
            variant="secondary"
            className="mt-6"
          >
            List your property
          </Button>
        </Link>
      </div>
    </section>
  )
}

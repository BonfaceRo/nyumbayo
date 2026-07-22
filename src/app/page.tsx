import { HeroSearch } from "@/components/layout/hero-search"
import { CategoryTiles } from "@/components/layout/category-tiles"
import { FeaturedProperties } from "@/components/layout/featured-properties"
import { TrustSection } from "@/components/layout/trust-section"
import { HowItWorks } from "@/components/layout/how-it-works"
import { CtaSection } from "@/components/layout/cta-section"
import { SiteFooter } from "@/components/layout/site-footer"

export default function Home() {
  return (
    <>
      <HeroSearch />
      <CategoryTiles />
      <FeaturedProperties />
      <TrustSection />
      <HowItWorks />
      <CtaSection />
      <SiteFooter />
    </>
  )
}

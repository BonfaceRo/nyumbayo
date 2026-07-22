import { ShieldCheck, UserCheck, FileCheck, MessageCircle } from "lucide-react"

const points = [
  {
    icon: UserCheck,
    title: "Verified owners only",
    description:
      "Every landlord's identity is checked before they can list — no anonymous accounts, no fake profiles.",
  },
  {
    icon: FileCheck,
    title: "Verified ownership",
    description:
      "We check ownership documents against the property before a listing earns its Verified badge.",
  },
  {
    icon: ShieldCheck,
    title: "No agents, no middlemen",
    description:
      "You deal directly with the real owner — every time. No one claiming a property they don't control.",
  },
  {
    icon: MessageCircle,
    title: "Report suspicious activity",
    description:
      "Something feels off? Report it in one tap. Our team reviews every report to keep Nyumbayo safe.",
  },
]

export function TrustSection() {
  return (
    <section className="bg-accent/40 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Why choose Nyumbayo</h2>
          <p className="mt-2 text-muted-foreground">
            Built to solve the biggest problem in Malawi&apos;s property market — trust.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

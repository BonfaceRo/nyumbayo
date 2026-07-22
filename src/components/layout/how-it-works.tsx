const steps = [
  {
    number: "01",
    title: "Search",
    description: "Browse verified properties by location, price, and type — nationwide.",
  },
  {
    number: "02",
    title: "Connect",
    description: "Message the real owner directly. Book a viewing at a time that works for you.",
  },
  {
    number: "03",
    title: "Move in",
    description: "Confirm the details, finalize with the owner, and move into your new home.",
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map(({ number, title, description }) => (
          <div key={number} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {number}
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background border-b border-primary/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          How We Cut Through the{" "}
          <span className="text-primary">DevOps Tooling Noise</span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
          The DevOps and cloud tooling landscape is vast and moves fast. Stack Index turns that
          chaos into clear, confident decisions — so your team stops researching and starts shipping.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Live-Verified Intelligence",
              body: "Our AI reads current, verified documentation — not cached training snapshots. Answers reflect what tools actually do today — not what a vendor wrote 18 months ago.",
            },
            {
              num: "02",
              title: "Practitioner Depth",
              body: "We surface real operator experiences alongside technical specs — so you understand not just what a tool does, but what it feels like to run it in production.",
            },
            {
              num: "03",
              title: "Actionable Guidance",
              body: "Built from a developer advocate's perspective — we give you 'use X if you're building Y' recommendations that account for how teams actually adopt tools, not just how they work on paper.",
            },
          ].map((card) => (
            <div
              key={card.num}
              className="bg-card border border-border hover:border-primary/60 rounded-xl p-8 flex flex-col items-center text-center transition-colors"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 mb-5 rounded bg-accent/10 text-accent text-sm font-mono font-semibold border border-accent/30">
                {card.num}
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">{card.title}</h4>
              <p className="text-base text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

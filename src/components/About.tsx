export const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background border-b border-primary/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          How We Decode the{" "}
          <span className="text-primary">Modern Tooling</span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
          Our process is designed to turn the information sprawl on developer tools into a
          streamlined decision-making engine.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Objective Discovery",
              body: "Data-driven signals and objective metrics to help you evaluate tools with confidence.",
            },
            {
              num: "02",
              title: "Technical Auditing",
              body: "Evaluating docs, community signals, and practitioner perspectives around scalability and developer experience.",
            },
            {
              num: "03",
              title: "Authentic Storytelling",
              body: "Narratives and case studies that explain why a tool matters — not just how it works.",
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

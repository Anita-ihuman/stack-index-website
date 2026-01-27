export const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Decode the Modern Tooling</h2>

        <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
          {/* <p>
            At Stack Index, we believe that the biggest bottleneck in modern engineering isn't a lack of tools—it's the difficulty of choosing the right ones.
          </p> */}

          <p>
            Our process is designed to turn the information sprawl on developer tools into a streamlined decision-making engine.
          </p>
        </div>

        {/* Floating feature boxes */}
        <div className="mt-12 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-center mx-auto">
            <div className="relative flex justify-center">
              <div className="absolute -top-6 -left-6 w-48 h-48 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 transform rotate-6 blur-xl opacity-30 pointer-events-none"></div>
              <div className="relative bg-card border border-border rounded-lg p-10 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 w-full md:w-[28rem] lg:w-[32rem] max-w-[32rem] h-80 flex flex-col justify-center items-center text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-sm bg-primary text-primary-foreground text-sm font-mono">01</div>
                <h4 className="text-2xl font-semibold text-foreground">Objective Discovery</h4>
                <p className="mt-4 text-base md:text-lg text-muted-foreground">Data-driven signals and objective metrics to help you evaluate tools with confidence.</p>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -top-6 -right-6 w-40 h-40 rounded-lg bg-gradient-to-br from-amber-50 to-rose-50 transform -rotate-6 blur-xl opacity-25 pointer-events-none"></div>
              <div className="relative bg-card border border-border rounded-lg p-10 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 w-full md:w-[28rem] lg:w-[32rem] max-w-[32rem] h-80 flex flex-col justify-center items-center text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-sm bg-primary text-primary-foreground text-sm font-mono">02</div>
                <h4 className="text-2xl font-semibold text-foreground">Technical Auditing</h4>
                <p className="mt-4 text-base md:text-lg text-muted-foreground">Evaluating docs, community signals, and practitioner perspectives around scalability and developer experience.</p>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-lg bg-gradient-to-br from-sky-50 to-indigo-50 transform rotate-3 blur-xl opacity-25 pointer-events-none"></div>
              <div className="relative bg-card border border-border rounded-lg p-10 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 w-full md:w-[28rem] lg:w-[32rem] max-w-[32rem] h-80 flex flex-col justify-center items-center text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-sm bg-primary text-primary-foreground text-sm font-mono">03</div>
                <h4 className="text-2xl font-semibold text-foreground">Authentic Storytelling</h4>
                <p className="mt-4 text-base md:text-lg text-muted-foreground">Narratives and case studies that explain why a tool matters — not just how it works.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

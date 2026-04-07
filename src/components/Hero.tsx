import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background border-b border-primary/20 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">

        <span className="inline-block font-mono text-xs tracking-widest uppercase text-accent border border-accent/40 bg-accent/10 px-3 py-1.5 rounded mb-8">
          Developer Tools · DevRel · Open Source
        </span>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
          Where Developers{" "}
          <span className="text-accent">Discover</span>
          <br />
          <span className="text-primary">Developer Tools</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          A curated index of developer tools, stories, and insights from the people building
          the future of infrastructure.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors group px-8 py-6 text-lg"
          >
            Join the Newsletter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-8 py-6 text-lg"
          >
            Explore Stories
          </Button>
        </div>
      </div>
    </section>
  );
};

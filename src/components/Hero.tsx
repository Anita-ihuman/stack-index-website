import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background border-b border-primary/20 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">

        <span className="inline-block font-mono text-xs tracking-widest uppercase text-accent border border-accent/40 bg-accent/10 px-3 py-1.5 rounded mb-8">
          AI-Native · DevOps Tooling · Developer Intelligence
        </span>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
          From{" "}
          <span className="text-accent">Discovery</span>
          <br />
          to Confident{" "}
          <span className="text-primary">Adoption</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Stack Index is the AI-native platform where developers discover, compare, and
          confidently choose DevOps tools — through verified documentation and community wisdom,
          turning weeks of research into minutes of clarity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors group px-8 py-6 text-lg"
          >
            Compare Tools
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-8 py-6 text-lg"
          >
            Read the Blog
          </Button>
        </div>
      </div>
    </section>
  );
};

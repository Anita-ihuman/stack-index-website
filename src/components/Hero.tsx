import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-shimmer opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-neon leading-tight">
          Where Developers Discover Developer Tools
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          A curated index of developer tools, stories, and insights from the people building the future of infrastructure.
        </p>



        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group px-8 py-6 text-lg"
          >
            Join the Newsletter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="border-border hover:border-primary hover:bg-secondary transition-all duration-300 px-8 py-6 text-lg"
          >
            Explore Stories
          </Button>
        </div>

        {/* Stack pattern decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(200_90%_50%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(200_90%_50%/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
      </div>
    </section>
  );
};

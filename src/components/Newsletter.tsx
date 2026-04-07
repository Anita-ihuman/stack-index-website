import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
  };

  return (
    <section id="newsletter" className="py-24 px-6 bg-background border-b border-primary/20">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Stay Updated —{" "}
          <span className="text-accent">Every Tuesday.</span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Join thousands of developers discovering new tools and stories weekly.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-6 text-lg bg-secondary border-border focus:border-primary transition-colors"
            required
          />
          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors px-8 py-6 text-lg"
          >
            Subscribe
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          No spam. Just dev tools, culture, and updates.
        </p>
      </div>
    </section>
  );
};

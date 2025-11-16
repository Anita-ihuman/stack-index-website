import { FileText, Headphones, Youtube, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

const pillars = [
  {
    icon: FileText,
    title: "Articles & Editorials",
    description: "Real stories from engineers and DevRel leaders.",
  },
  {
    icon: Headphones,
    title: "StackIndex Podcast",
    description: "Weekly conversations with devs, founders, and creators.",
  },
  {
    icon: Youtube,
    title: "YouTube Channel",
    description: "Tool explainers, platform diaries, and DevOps roadmaps.",
  },
  {
    icon: Mail,
    title: "Dev Resource Debut",
    description: "Weekly drop of new tools, updates, and career picks.",
  },
];

export const CorePillars = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-foreground">
          Core Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <Card
              key={index}
              className="group p-8 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg bg-secondary border border-border group-hover:border-primary/50 group-hover:shadow-glow transition-all duration-300">
                  <pillar.icon className="h-8 w-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

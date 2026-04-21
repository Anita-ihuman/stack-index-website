import { ShieldCheck, Users, Zap, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified, Not Assumed",
    description:
      "Every insight is grounded in what tools actually do today — not stale training data or vendor-written summaries. We verify against current sources so you can trust what you're reading.",
  },
  {
    icon: Users,
    title: "The DevRel Advantage",
    description:
      "Built by a developer advocate who understands how developers actually evaluate and adopt tools — not just compare features. Stack Index surfaces the context that turns curiosity into confidence.",
  },
  {
    icon: Zap,
    title: "Minutes, Not Weeks",
    description:
      "Weeks of scattered research — vendor blogs, Reddit threads, outdated docs — condensed into minutes of clarity. Workload-specific guidance so your team aligns and ships instead of debating.",
  },
  {
    icon: BarChart2,
    title: "Live Tool Intelligence",
    description:
      "Every tool scored across 8 real dimensions: contributor velocity, issue resolution, documentation quality, community health, and enterprise adoption — pulled from live sources, not last year's snapshot.",
  },
];

export const CorePillars = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">
          Why Stack Index
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          The intelligence layer that bridges discovery and adoption — the way great DevRel does.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <Card
              key={index}
              className="group p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg bg-secondary border border-border group-hover:border-primary/50 group-hover:opacity-90 transition-all duration-300">
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

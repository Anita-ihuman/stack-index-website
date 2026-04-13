import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare, MessageSquare, Search, ArrowRightLeft } from "lucide-react";

const services = [
  {
    icon: GitCompare,
    title: "AI Tool Comparisons",
    description:
      "Side-by-side comparisons grounded in live documentation via MCP — not vendor blogs, not stale training data. Clear tradeoffs that close the trust gap between discovery and decision.",
  },
  {
    icon: MessageSquare,
    title: "Community DX Reviews",
    description:
      "Insights from engineers who've shipped with these tools in production. The kind of context great DevRel surfaces — the real experience no feature matrix will ever capture.",
  },
  {
    icon: Search,
    title: "ToolIndex",
    description:
      "57+ DevOps and cloud tools scored across 8 real dimensions — contributor velocity, documentation quality, community health, and more. Find the right tool, not just any tool.",
  },
  {
    icon: ArrowRightLeft,
    title: "Decision & Migration Guides",
    description:
      "Workload-specific 'use X if Y' guidance and migration paths between tools. Because the goal isn't more research — it's a team aligned and shipping with confidence.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-secondary/20 border-b border-primary/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            The Intelligence Layer Between{" "}
            <span className="text-primary">Discovery and Adoption</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stack Index does what great DevRel does — bridges the gap between finding a tool
            and confidently committing to it. Powered by verified docs, live signals, and
            community wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/60 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Sparkles, Users, LayoutGrid, Map } from "lucide-react";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";

const services: BentoItem[] = [
  {
    title: "AI Tool Comparisons",
    meta: "Powered by Claude",
    description:
      "Side-by-side comparisons grounded in live documentation via MCP — not vendor blogs, not stale training data. Clear tradeoffs that close the trust gap between discovery and decision.",
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    status: "Live",
    tags: ["MCP", "Live Docs", "AI"],
    hasPersistentHover: true,
  },
  {
    title: "Community DX Reviews",
    meta: "Real operators",
    description:
      "Insights from engineers who've shipped with these tools in production. The real experience no feature matrix will ever capture.",
    icon: <Users className="w-4 h-4 text-primary" />,
    status: "Active",
    tags: ["Community", "DX"],
  },
  {
    title: "ToolIndex",
    meta: "8 dimensions",
    description:
      "57+ DevOps and cloud tools scored across contributor velocity, documentation quality, community health, and more. Find the right tool, not just any tool.",
    icon: <LayoutGrid className="w-4 h-4 text-primary" />,
    status: "Coming Soon",
    tags: ["Scored", "Catalog"],
  },
  {
    title: "Decision & Migration Guides",
    meta: "Use-case driven",
    description:
      "Workload-specific 'use X if Y' guidance and migration paths between tools. Because the goal isn't more research — it's a team aligned and shipping with confidence.",
    icon: <Map className="w-4 h-4 text-primary" />,
    status: "Coming Soon",
    tags: ["Migration", "Guidance", "Workloads"],
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-secondary/20 border-b border-primary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            The Intelligence Layer Between{" "}
            <span className="text-primary">Discovery and Adoption</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stack Index does what great DevRel does — bridges the gap between finding a tool
            and confidently committing to it.
          </p>
        </div>

        <BentoGrid items={services} cols={2} />
      </div>
    </section>
  );
};

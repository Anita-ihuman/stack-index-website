"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  cols?: 2 | 3 | 4;
}

function BentoGrid({ items, cols = 3 }: BentoGridProps) {
  const colClass = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }[cols];
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-3 p-4 max-w-7xl mx-auto`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-5 rounded-xl overflow-hidden transition-all duration-300",
            "border border-border bg-card",
            "hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.04)]",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            item.hasPersistentHover && "shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.04)] -translate-y-0.5"
          )}
        >
          {/* Dot pattern on hover */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-all duration-300">
                {item.icon}
              </div>
              <span className={cn(
                "text-xs font-mono font-medium px-2 py-1 rounded-lg",
                "bg-muted text-muted-foreground",
                "transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                {item.status || "Active"}
              </span>
            </div>

            {/* Title + meta */}
            <div className="space-y-1.5">
              <h3 className="font-semibold text-foreground tracking-tight text-[15px]">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal font-mono">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-200 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-primary font-mono opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                {item.cta || "Explore →"}
              </span>
            </div>
          </div>

          {/* Gradient border on hover */}
          <div className={cn(
            "absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-primary/10 to-transparent transition-opacity duration-300",
            item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )} />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };

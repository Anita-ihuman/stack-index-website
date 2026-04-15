import { AnimatedHero } from "@/components/ui/animated-hero";

const FLOATING_TAGS = [
  { label: "Kubernetes",     top: "12%",  left: "6%",   delay: "0s"    },
  { label: "Terraform",      top: "22%",  right: "7%",  delay: "0.4s"  },
  { label: "Prometheus",     top: "58%",  left: "4%",   delay: "0.8s"  },
  { label: "ArgoCD",         top: "72%",  right: "5%",  delay: "0.2s"  },
  { label: "Istio",          top: "40%",  left: "2%",   delay: "1.1s"  },
  { label: "GitHub Actions", top: "82%",  left: "10%",  delay: "0.6s"  },
  { label: "Datadog",        top: "15%",  right: "18%", delay: "1.3s"  },
  { label: "Helm",           top: "68%",  right: "14%", delay: "0.9s"  },
  { label: "Vault",          top: "48%",  right: "3%",  delay: "0.3s"  },
  { label: "Pulumi",         top: "30%",  left: "14%",  delay: "1.5s"  },
];

export const Hero = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-background border-b border-primary/20">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[250px] h-[250px] rounded-full bg-primary/8 blur-[90px] pointer-events-none" />

      {/* Floating tool badges — hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {FLOATING_TAGS.map((tag) => (
          <span
            key={tag.label}
            className="absolute font-mono text-[11px] px-2.5 py-1 rounded-full border border-primary/20 bg-card/60 text-muted-foreground backdrop-blur-sm"
            style={{
              top: tag.top,
              left: (tag as any).left,
              right: (tag as any).right,
              animation: `float 6s ease-in-out infinite`,
              animationDelay: tag.delay,
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Animated hero content */}
      <div className="relative z-10 w-full">
        <AnimatedHero />
      </div>

      {/* Float keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["confident", "informed", "deliberate", "evidence-based", "faster"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">

          {/* Badge */}
          <div>
            <Link to="/beta">
              <Button variant="secondary" size="sm" className="gap-4 font-mono text-xs">
                Now in beta — join the waitlist <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Headline */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-bold leading-tight">
              <span className="text-foreground">DevOps tool decisions,</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-primary"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mx-auto">
              Stack Index is the AI-native platform where developers discover, compare, and
              confidently adopt DevOps tools — through verified documentation and community
              wisdom, turning weeks of research into minutes of clarity.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-row gap-3 flex-wrap justify-center">
            <Link to="/tools">
              <Button size="lg" className="gap-4" variant="outline">
                Explore the Catalog <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/beta">
              <Button size="lg" className="gap-4">
                <Sparkles className="w-4 h-4" />
                Join the Beta
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };

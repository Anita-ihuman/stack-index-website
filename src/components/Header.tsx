import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ToolCommandPalette } from "./ToolCommandPalette";
import { Search } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const goToSection = (id: string) => {
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return true; }
      if (attempt > 20) return false;
      setTimeout(() => tryScroll(attempt + 1), 100);
      return false;
    };

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => tryScroll(0), 120);
    } else {
      tryScroll(0);
    }
  };

  const scrollToContact = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "About",      action: () => goToSection("about") },
            { label: "Services",   action: () => goToSection("services") },
            { label: "Newsletter", action: () => goToSection("newsletter") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Blogs
          </Link>

          <Link
            to="/tools"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Tools
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/50 hover:bg-muted text-sm text-muted-foreground transition-colors font-mono"
          >
            <Search className="w-3.5 h-3.5" />
            Search tools…
            <kbd className="ml-1 text-[10px] bg-background border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <Button
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors border border-primary/50"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </header>

    <ToolCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
};

import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

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
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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

          {/* <Link
            to="/tools"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Tools
          </Link> */}
        </nav>

        <div className="flex items-center gap-4">
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
  );
};

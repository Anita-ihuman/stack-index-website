import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const goToSection = (id: string) => {
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    if (window.location.pathname !== "/") {
      // navigate to home first, then scroll after a short delay
      navigate("/");
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => goToSection("newsletter")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Newsletter
          </button>
          <button
            onClick={() => goToSection("services")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Services
          </button>
          <Link
            to="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Blog
          </Link>
          {/* AI Analyzer link removed from navigation to keep the feature hidden while retaining the route */}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            onClick={scrollToContact}
            className="bg-gradient-primary hover:shadow-glow transition-all"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </header>
  );
};

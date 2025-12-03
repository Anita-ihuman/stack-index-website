import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";

export const Header = () => {
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
          <Link 
            to="/newsletter" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Newsletter (coming soon)
          </Link>
          <Link 
            to="/blog" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Blog (coming soon)
          </Link>
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

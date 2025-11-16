import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLink 
            to="/newsletter" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            activeClassName="text-primary"
          >
            Newsletter
          </NavLink>
          <NavLink 
            to="/blog" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            activeClassName="text-primary"
          >
            Blog
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/newsletter">
            <Button className="bg-gradient-primary hover:shadow-glow transition-all">
              Subscribe to Newsletter →
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

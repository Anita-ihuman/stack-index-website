import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Youtube, Instagram, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Logo and short mission statement (mission placed below the logo) */}
          <div className="flex flex-col gap-4">
            <div>
              <Logo />
            </div>

            <p className="text-sm text-muted-foreground max-w-xs">
              We help dev-facing companies tell authentic stories and reach technical audiences — and help developers find the ideal tools.
            </p>

            <span className="text-sm text-muted-foreground">
              © Stack Index 2025
            </span>
          </div>

          {/* Content Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Content</h3>
            <Link 
              to="/newsletter" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors block mb-2"
            >
              Newsletter
            </Link>
            <Link 
              to="/blog" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors block"
            >
              Blog
            </Link>
          </div>

          {/* Connect Section */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://twitter.com/TheStackIndex" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/stack-index" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@stackindex" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/thestackindex" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:thestackindex@gmail.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

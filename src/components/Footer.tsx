import { Logo } from "./Logo";
// ...existing code...
// ...existing code...
import { Link, useNavigate } from "react-router-dom";
import { Twitter, Linkedin, Youtube, Instagram, Mail } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const goToNewsletter = (e: React.MouseEvent) => {
    e.preventDefault();
    // If not on the homepage, navigate there first
    if (window.location.pathname !== "/") {
      navigate("/");
      // poll for the newsletter element and scroll when available
      let attempts = 0;
      const t = setInterval(() => {
        const el = document.getElementById("newsletter");
        attempts++;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(t);
        } else if (attempts > 30) {
          clearInterval(t);
          // fallback to hash
          window.location.hash = "#newsletter";
        }
      }, 100);
    } else {
      const el = document.getElementById("newsletter");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = "#newsletter";
      }
    }
  };

  return (
    <footer className="py-16 px-6 bg-card border-t-2 border-primary/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The intelligence layer that bridges discovery and adoption — the way great DevRel does.
            </p>
            <span className="text-xs font-mono text-muted-foreground">
              © Stack Index {new Date().getFullYear()}
            </span>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest font-mono">
              Learn
            </h3>
            <Link
              to="/blog"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block mb-2"
            >
              Blog
            </Link>
            <Link
              to="/roadmap"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block mb-2"
            >
              DevRel Roadmap
            </Link>
            <Link
              to="/events"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block"
            >
              DevRel Strategy Room
            </Link>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest font-mono">
              Community
            </h3>
            <Link
              to="/beta"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block mb-2"
            >
              Join the Beta
            </Link>
            <a
              href="/#newsletter"
              onClick={goToNewsletter}
              className="text-sm text-muted-foreground hover:text-accent transition-colors block mb-2"
            >
              Newsletter
            </a>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block"
            >
              Contact Us
            </Link>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest font-mono">
              Connect
            </h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <a
                href="https://twitter.com/TheStackIndex"
                target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/stack-index"
                target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@stackindex"
                target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/thestackindex"
                target="_blank" rel="noopener noreferrer"
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
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors block mb-2">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors block mb-2">
              Terms of Service
            </Link>
            <Link to="/license" className="text-xs text-muted-foreground hover:text-accent transition-colors block">
              License
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
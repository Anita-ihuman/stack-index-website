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
              We help dev-facing companies tell authentic stories and reach technical
              audiences — and help developers find the ideal tools.
            </p>
            <span className="text-xs font-mono text-muted-foreground">
              © Stack Index 2025
            </span>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest font-mono">
              Education
            </h3>
            <Link
              to="/blog"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block mb-2"
            >
              Blog
            </Link>
            <Link
              to="/roadmap"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block"
            >
              DevRel Roadmap
            </Link>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest font-mono">
              Community
            </h3>
            {/* Updated: anchor that scrolls to newsletter section on the homepage */}
            <a
              href="/#newsletter"
              onClick={goToNewsletter}
              className="text-sm text-muted-foreground hover:text-accent transition-colors block mb-2"
            >
              Newsletter
            </a>
            <Link
              to="/events"
              className="text-sm text-muted-foreground hover:text-accent transition-colors block"
            >
              Events &amp; Webinars
            </Link>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest font-mono">
              Connect
            </h3>
            <div className="flex flex-wrap gap-4">
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
          </div>
        </div>

        {/* Bottom bar
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">
            Built for the developer community.
          </span>
          <div className="flex gap-2 items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            <span className="inline-block w-2 h-2 rounded-full bg-accent" />
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#534AB7" }} />
          </div>
        </div> */}
      </div>
    </footer>
  );
};
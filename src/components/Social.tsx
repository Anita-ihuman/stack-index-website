import { Twitter, Linkedin, Youtube, Instagram, Mail } from "lucide-react";

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/TheStackIndex" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/stack-index" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@stackindex" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/thestackindex" },
  { icon: Mail, label: "Email", href: "mailto:thestackindex@gmail.com" },
];

export const Social = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">
          Connect with Stack Index
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-4 rounded-lg bg-secondary border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              aria-label={social.label}
            >
              <social.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-foreground group-hover:text-primary transition-colors font-medium">
                {social.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

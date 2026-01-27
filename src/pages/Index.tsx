import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SubstackEmbed from "@/components/SubstackEmbed";

const pastIssues = [
  { issue: 1, title: "Coming Soon", date: "Coming Soon" },
  { issue: 2, title: "Coming Soon", date: "Coming Soon" },
  { issue: 3, title: "Coming Soon", date: "Coming Soon" },
  { issue: 4, title: "Coming Soon", date: "Coming Soon" },
  { issue: 5, title: "Coming Soon", date: "Coming Soon" },
  { issue: 6, title: "Coming Soon", date: "Coming Soon" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="container py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Your Source for Developer Tools, Stories, and Insights.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Discover the tools, platforms, and people shaping modern infrastructure, DevOps, and open source.
          </p>
        </div>
      </section>
      {/* Services Section */}
      <Services />

  {/* About Section */}
  <About />

  {/* Newsletter Section - The Stack Digest */}
  <section id="newsletter" className="py-12 bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              The Stack Digest
            </h2>
            <p className="text-lg text-muted-foreground">
              Join 5,000+ engineers, founders, and maintainers like you. Get detailed signals of emerging tools, niche research, and resources on open-source culture, cloud computing, platform engineering, DevOps tools, opportunities, and more.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Past Issues */}
            <div className="flex flex-col gap-4 h-full">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Catch Up on Past Issues</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                {pastIssues.map((issue) => (
                  <Card key={issue.issue} className="hover:shadow-hover hover:border-primary/50 transition-all cursor-pointer bg-card h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-accent">Issue #{issue.issue}</span>
                        <span className="text-sm text-muted-foreground">{issue.date}</span>
                      </div>
                      <CardTitle className="text-lg text-foreground">{issue.title}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Substack embed (subscribe widget) */}
            <div className="flex items-center justify-center">
              <div className="w-full h-full flex items-center">
                <SubstackEmbed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />

      <Footer />
    </div>
  );
};

export default Index;

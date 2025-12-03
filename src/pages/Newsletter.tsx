import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter as NewsletterSignup } from "@/components/Newsletter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const pastIssues = [
  { issue: 1, title: "Coming Soon", date: "Coming Soon" },
  { issue: 2, title: "Coming Soon", date: "Coming Soon" },
  { issue: 3, title: "Coming Soon", date: "Coming Soon" },
  { issue: 4, title: "Coming Soon", date: "Coming Soon" },
];

const Newsletter = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            📬 Stack Digest (coming soon)
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            A weekly curated drop of developer tools, news, and insights. Sent every Tuesday.
          </p>
        </div>

        {/* Subscription CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Subscribe to the Stack Digest</h2>
            <p className="text-muted-foreground">Be the first to know when we launch.</p>
          </div>
          <NewsletterSignup />
        </div>

        {/* Featured Issues Grid */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Issues</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pastIssues.map((issue) => (
              <Card key={issue.issue} className="hover:shadow-hover transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-accent">Issue #{issue.issue}</span>
                    <span className="text-sm text-muted-foreground">{issue.date}</span>
                  </div>
                  <CardTitle className="text-xl">{issue.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Contribution CTA */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-secondary rounded-lg text-center">
          <p className="text-lg text-foreground mb-4">
            Interested in contributing to this issue?
          </p>
          <a href="#submit" className="text-primary hover:underline font-medium">
            Fill out the submission form here →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;

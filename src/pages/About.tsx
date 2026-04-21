import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About"
        description="Stack Index was built from a developer advocate's perspective — combining AI-verified documentation with practitioner experience to help engineering teams make confident DevOps tool decisions."
        path="/about"
      />
      <Header />
      
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-foreground">About Stack Index</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Stack Index is the AI-native platform where developers discover, compare, and
              confidently choose DevOps tools — through verified documentation and community wisdom,
              turning weeks of research into minutes of clarity.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              It's the intelligence layer that bridges discovery and adoption — the way great DevRel does.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The DevOps tooling landscape is one of the most fragmented spaces in tech. Teams waste
              days reading scattered vendor blogs, outdated Reddit threads, and biased comparisons —
              and still end up uncertain. Stack Index solves that by combining AI that reads live
              documentation with community reviews from practitioners who've actually shipped
              with these tools — giving you verified answers instead of educated guesses.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We don't hand you a list of options and wish you luck. Stack Index gives you
              workload-specific guidance — "use X if you're building Y" — so your team aligns
              faster and ships infrastructure with confidence.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

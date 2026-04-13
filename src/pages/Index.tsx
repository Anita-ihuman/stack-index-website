import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="DevOps & Cloud Tooling Intelligence Platform"
        description="Stack Index is where DevOps engineers, platform teams, and SREs discover, compare, and confidently adopt infrastructure tools — through AI-verified documentation and real practitioner experience."
        path="/"
      />
      <Header />

      {/* Hero Section */}
      <section className="container py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Stop Researching.{" "}
            <span className="text-primary">Start Building.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Stack Index is the DevOps and cloud tooling intelligence platform — where engineering
            teams discover, compare, and confidently adopt tools through AI-verified documentation
            and real practitioner experience.
          </p>
        </div>
      </section>

      <Services />
      <About />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;

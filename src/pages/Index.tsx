import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Newsletter } from "@/components/Newsletter";
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
      <Hero />
      <About />
      <Services />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;

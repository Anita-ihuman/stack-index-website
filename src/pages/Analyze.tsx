import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AIAnalysisContainer } from "@/components/AIAnalysisContainer";

const Analyze = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Tool Analyzer — Compare DevOps & Cloud Tools Instantly"
        description="Compare any two DevOps or cloud tools side-by-side using AI that reads live documentation via MCP. Get verified, unbiased analysis in seconds — not hours of research."
        path="/analyze"
      />
      <Header />

      <section className="container py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <AIAnalysisContainer />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analyze;

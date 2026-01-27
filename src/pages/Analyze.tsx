import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIAnalysisContainer } from "@/components/AIAnalysisContainer";

const Analyze = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
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

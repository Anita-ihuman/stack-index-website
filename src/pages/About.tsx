import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-foreground">About Stack Index</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Stack Index is the trusted, developer-native media platform where engineers discover 
              the tools, stories, and platforms shaping modern infrastructure, DevOps, open source, 
              and Developer Relations.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We bridge the gap between dev-facing products and technical audiences through curated 
              media content, authentic storytelling, and community building.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

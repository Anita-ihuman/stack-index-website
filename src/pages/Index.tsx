import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const featuredIssues = [
  {
    issue: 1,
    title: "Coming Soon",
    date: "Coming Soon"
  },
  {
    issue: 2,
    title: "Coming Soon",
    date: "Coming Soon"
  },
  {
    issue: 3,
    title: "Coming Soon",
    date: "Coming Soon"
  },
  {
    issue: 4,
    title: "Coming Soon",
    date: "Coming Soon"
  },
  {
    issue: 5,
    title: "Coming Soon",
    date: "Coming Soon"
  },
  {
    issue: 6,
    title: "Coming Soon",
    date: "Coming Soon"
  },
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/newsletter">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all group px-8 py-6 text-lg"
              >
                Join the Newsletter
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline"
              disabled
              className="border-border px-8 py-6 text-lg opacity-50 cursor-not-allowed"
            >
              Blog Coming Soon
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Newsletter Issues */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Newsletter Issues</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredIssues.map((issue) => (
            <Card key={issue.issue} className="hover:shadow-hover hover:border-primary/50 transition-all cursor-pointer bg-card">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-accent">Issue #{issue.issue}</span>
                  <span className="text-sm text-muted-foreground">{issue.date}</span>
                </div>
                <CardTitle className="text-xl text-foreground">{issue.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

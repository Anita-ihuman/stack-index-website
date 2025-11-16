import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const blogPosts = [
  {
    title: "Coming Soon",
    description: "Exciting content is on the way. Stay tuned for insights from developer communities.",
    tag: "#DevRel",
    author: "Stack Index Team",
    date: "Coming Soon"
  },
  {
    title: "Coming Soon",
    description: "Exciting content is on the way. Stay tuned for platform engineering insights.",
    tag: "#PlatformEngineering",
    author: "Stack Index Team",
    date: "Coming Soon"
  },
  {
    title: "Coming Soon",
    description: "Exciting content is on the way. Stay tuned for open source insights.",
    tag: "#OpenSource",
    author: "Stack Index Team",
    date: "Coming Soon"
  },
  {
    title: "Coming Soon",
    description: "Exciting content is on the way. Stay tuned for developer tools insights.",
    tag: "#ToolReview",
    author: "Stack Index Team",
    date: "Coming Soon"
  },
];

const tags = ["#DevRel", "#PlatformEngineering", "#OpenSource", "#ToolReview", "#AI", "#DevOps"];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-foreground">
              Insights, Stories, and Tools Developers Love
            </h1>
            <p className="text-xl text-muted-foreground">
              Deep dives into the tools, platforms, and people shaping modern development.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Want to write for Stack Index?
              </h3>
              <p className="text-muted-foreground mb-6">
                Share your insights, stories, and expertise with the developer community.
              </p>
              <Button size="lg" className="bg-gradient-primary hover:shadow-hover transition-all">
                Submit Your Article →
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

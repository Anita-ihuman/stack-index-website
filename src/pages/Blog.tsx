import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

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
  {
    title: "Coming Soon",
    description: "Exciting content is on the way. Stay tuned for AI and machine learning insights.",
    tag: "#AI",
    author: "Stack Index Team",
    date: "Coming Soon"
  },
  {
    title: "Coming Soon",
    description: "Exciting content is on the way. Stay tuned for DevOps best practices.",
    tag: "#DevOps",
    author: "Stack Index Team",
    date: "Coming Soon"
  },
];

const tags = ["All", "#DevRel", "#PlatformEngineering", "#OpenSource", "#ToolReview", "#AI", "#DevOps"];

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredPosts = selectedTag === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.tag === selectedTag);

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

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedTag === tag 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Blog Posts Grid */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map((post, index) => (
                  <BlogCard key={index} {...post} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-border sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    Want to write for Stack Index?
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Share your insights, stories, and expertise with the developer community.
                  </p>
                  <Button className="w-full bg-gradient-primary hover:shadow-hover transition-all">
                    Submit Your Article →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

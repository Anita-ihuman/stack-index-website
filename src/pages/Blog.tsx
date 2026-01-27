import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getAllPosts } from "@/lib/posts";
import { Link, useNavigate } from "react-router-dom";

// Fallback single published article (used only if markdown posts are not discovered)
const blogPosts = [
  {
    slug: "top-5-mistakes-every-beginner-devrel",
    title: "Top 5 Mistakes Every Beginner DevRel",
    description: "Practical lessons and common pitfalls we repeatedly see when teams start developer relations work.",
    tag: "#DevRel",
    author: "Stack Index Team",
    date: "Jan 20, 2026"
  }
];

const tags = ["All", "#DevRel"];

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts().then((p) => {
      // debug: log raw posts returned from loader
      try { console.log('[blog] getAllPosts ->', p.map(x => ({ slug: x.meta.slug, title: x.meta.title }))); } catch (e) {}
      const mapped = p.map((x) => ({ ...x.meta, description: x.meta.description || '', author: x.meta.author, date: x.meta.date }));
      setPosts(mapped);
    });
  }, []);

  const filteredPosts = selectedTag === "All" 
    ? posts.length ? posts : blogPosts
    : (posts.length ? posts : blogPosts).filter(post => post.tag === selectedTag);

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
                      {filteredPosts.map((post) => (
                        post.slug ? (
                          <Link key={post.slug} to={`/blog/${post.slug}`} className="block">
                            <BlogCard {...post} />
                          </Link>
                        ) : (
                          <div key={post.title}>
                            <BlogCard {...post} />
                          </div>
                        )
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
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-hover transition-all"
                    onClick={() => navigate('/create-post')}
                  >
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

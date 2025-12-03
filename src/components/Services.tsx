import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Mic, Video, BookOpen } from "lucide-react";

const services = [
  {
    icon: Newspaper,
    title: "Newsletter & Articles",
    description: "Weekly curated developer tools, news, and insights delivered to your inbox."
  },
  {
    icon: Mic,
    title: "Podcast",
    description: "Conversations with engineers, DevRel leaders, and open source maintainers."
  },
  {
    icon: Video,
    title: "Video Content",
    description: "Tool explainers, tutorials, and DevOps deep dives on YouTube."
  },
  {
    icon: BookOpen,
    title: "Community Resources",
    description: "Curated guides, career picks, and developer ecosystem insights."
  }
];

export const Services = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Your Developer Media Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay informed about the tools and platforms shaping modern development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-card hover:shadow-hover hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-foreground text-center">Get in Touch</h1>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            Have questions or want to collaborate? We'd love to hear from you.
          </p>
          
          <form className="space-y-6">
            <div>
              <Input 
                placeholder="Your Name" 
                className="bg-background border-border"
              />
            </div>
            <div>
              <Input 
                type="email" 
                placeholder="Your Email" 
                className="bg-background border-border"
              />
            </div>
            <div>
              <Textarea 
                placeholder="Your Message" 
                rows={6}
                className="bg-background border-border"
              />
            </div>
            <Button size="lg" className="w-full bg-gradient-primary hover:shadow-hover transition-all">
              Send Message
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-2">Or email us directly at:</p>
            <a 
              href="mailto:thestackindex@gmail.com" 
              className="text-primary hover:underline text-lg font-medium"
            >
              thestackindex@gmail.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

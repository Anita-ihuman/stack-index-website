import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactApi } from "@/lib/apiClient";
import { CheckCircle2, Loader2 } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await contactApi.submit(form);
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Get in Touch"
        description="Have questions or want to collaborate with Stack Index? Reach out and we'll get back to you."
        path="/contact"
      />
      <Header />

      <main className="container py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-foreground text-center">Get in Touch</h1>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            Have questions or want to collaborate? We'd love to hear from you.
          </p>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Message sent!</h2>
              <p className="text-muted-foreground max-w-sm">
                Thanks for reaching out. We'll get back to you at {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                  required
                  className="bg-background border-border"
                />
                <Input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <Input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                required
                className="bg-background border-border"
              />
              <Textarea
                placeholder="Your message"
                rows={6}
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                required
                className="bg-background border-border"
              />
              {status === "error" && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
              <Button size="lg" className="w-full" type="submit" disabled={status === "loading"}>
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          )}

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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterApi } from "@/lib/apiClient";
import { CheckCircle2, ArrowRight, Zap, BarChart2, BookOpen, Users } from "lucide-react";

const highlights = [
  { icon: BarChart2, text: "Weekly tool comparisons grounded in live docs" },
  { icon: Zap,       text: "What's moving in DevOps and cloud tooling" },
  { icon: BookOpen,  text: "Practitioner stories and platform diaries" },
  { icon: Users,     text: "Built for engineers who make infrastructure decisions" },
];

export const Newsletter = () => {
  const [form, setForm] = useState({ firstName: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await newsletterApi.subscribe({ ...form, source: "homepage" });
      if (res.alreadySubscribed) {
        setErrorMsg("You're already subscribed — we'll see you in the next issue.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="newsletter" className="py-24 px-6 bg-secondary/30 border-y border-primary/20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block font-mono text-xs tracking-widest uppercase text-accent border border-accent/40 bg-accent/10 px-3 py-1.5 rounded mb-5">
            The Stack Index Digest
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            DevOps tool intelligence,{" "}
            <span className="text-primary">every week.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Cut through the noise. Get verified tool comparisons, practitioner stories,
            and what's actually moving in the DevOps and cloud tooling landscape — straight
            to your inbox.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — what you get */}
          <div className="space-y-5">
            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6">
              What's inside every issue
            </p>
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-md bg-primary/10 border border-primary/20 shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div className="bg-card border border-border rounded-xl p-8">
            {status === "success" ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-5">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">You're in.</h3>
                <p className="text-muted-foreground text-sm">
                  Welcome to the Stack Index Digest. You'll hear from us next issue —
                  no fluff, just signal.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Join the Digest
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Weekly. No spam. Unsubscribe anytime.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      First name
                    </label>
                    <Input
                      type="text"
                      placeholder="Anita"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      required
                      className="bg-secondary border-border focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Work email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      className="bg-secondary border-border focus:border-primary transition-colors"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-sm text-muted-foreground bg-secondary border border-border rounded-md px-3 py-2">
                      {errorMsg}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors group disabled:opacity-60"
                  >
                    {status === "loading" ? "Subscribing…" : (
                      <>
                        Subscribe to the Digest
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

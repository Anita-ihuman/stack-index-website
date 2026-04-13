import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Video, Calendar } from "lucide-react";

// ── Past webinars ──────────────────────────────────────────────────────────
// When you have the YouTube embed URLs, replace `embedUrl: null` with the URL.
// YouTube embed format: https://www.youtube.com/embed/VIDEO_ID
const pastWebinars = [
  {
    num: "01",
    title: "DevRel Strategy Room — Session 1",
    description:
      "An in-depth conversation on how AI is influencing the way companies connect with developers and how DevRel, developer education, and marketing teams can adapt.",
    embedUrl: "https://www.youtube.com/embed/thTnBiZToKE",
    tags: ["AI", "DevRel", "Marketing"],
  },
  {
    num: "02",
    title: "DevRel Strategy Room — Session 2",
    description:
      "A deep dive into how AI is transforming the way developers and platform teams build, deploy, and operate production-grade cloud systems, from infrastructure provisioning to debugging and optimization.",
    embedUrl: "https://www.youtube.com/embed/OvyBAJYrzw0",
    tags: ["AI", "DevRel", "Cloud"],
  },
];

// ── Upcoming events ────────────────────────────────────────────────────────
// Add entries here as new sessions get scheduled.
const upcomingEvents: { title: string; date: string; description: string }[] = [];

// CSS variable helpers — work in both dark and light mode
const v = {
  card:    "hsl(var(--card))",
  muted:   "hsl(var(--muted))",
  border:  "hsl(var(--border))",
  fg:      "hsl(var(--foreground))",
  fgMuted: "hsl(var(--muted-foreground))",
};

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <style>{`
        .ev-root { font-family: 'Syne', sans-serif; }
        .ev-mono { font-family: 'JetBrains Mono', monospace; }
        @media (max-width: 640px) {
          .ev-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SEO
        title="DevRel Strategy Room — Webinar Series"
        description="Live sessions exploring DevRel strategy, tool adoption psychology, and developer program design — from practitioners who've built in the trenches."
        path="/events"
      />
      <Header />

      <main className="ev-root">
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1rem 5rem" }}>

          {/* ── Hero ── */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="ev-mono" style={{
              display: "inline-block",
              backgroundColor: "rgba(83,74,183,0.12)",
              color: "#534AB7",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 8,
              marginBottom: "1.25rem",
              border: "0.5px solid rgba(83,74,183,0.35)",
            }}>
              Webinar Series · Season 1
            </span>

            <h1 style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1rem",
              color: v.fg,
            }}>
              DevRel{" "}
              <span style={{ color: "#534AB7" }}>Strategy Room</span>
            </h1>

            <p style={{
              maxWidth: 520,
              margin: "0 auto",
              color: v.fgMuted,
              fontSize: "1.0625rem",
              lineHeight: 1.65,
            }}>
              Live sessions exploring DevRel strategy, tool adoption psychology, and developer
              program design — from the perspective of practitioners who've built in the trenches.
            </p>
          </div>

          {/* ── Past Webinars ── */}
          <section style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <Video size={20} style={{ color: "#534AB7", flexShrink: 0 }} />
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: v.fg }}>Past Sessions</h2>
              <span className="ev-mono" style={{
                backgroundColor: "rgba(83,74,183,0.12)",
                color: "#534AB7",
                fontSize: 11,
                padding: "3px 9px",
                borderRadius: 6,
                border: "0.5px solid rgba(83,74,183,0.35)",
              }}>
                {pastWebinars.length} Sessions
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {pastWebinars.map((w) => (
                <div key={w.num} style={{
                  border: `0.5px solid ${v.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: v.card,
                }}>
                  {/* Embed area */}
                  <div style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    backgroundColor: v.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: `0.5px solid ${v.border}`,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {w.embedUrl ? (
                      <iframe
                        src={w.embedUrl}
                        title={w.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div style={{ textAlign: "center", color: v.fgMuted }}>
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          backgroundColor: v.muted,
                          border: `0.5px solid ${v.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 10px",
                        }}>
                          <Video size={24} style={{ color: v.fgMuted }} />
                        </div>
                        <p style={{ fontSize: 13, margin: 0, color: v.fgMuted }}>Video embed coming soon</p>
                        <p className="ev-mono" style={{ fontSize: 11, marginTop: 4, color: v.fgMuted }}>
                          Session {w.num}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.75rem" }}>
                      {w.tags.map((tag) => (
                        <span key={tag} className="ev-mono" style={{
                          backgroundColor: "rgba(83,74,183,0.12)",
                          color: "#534AB7",
                          fontSize: 11,
                          padding: "3px 9px",
                          borderRadius: 6,
                          border: "0.5px solid rgba(83,74,183,0.35)",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, marginTop: 0, color: v.fg }}>{w.title}</h3>
                    <p style={{ fontSize: 14, color: v.fgMuted, lineHeight: 1.65, margin: 0 }}>{w.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Upcoming Events ── */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <Calendar size={20} style={{ color: "#1D9E75", flexShrink: 0 }} />
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: v.fg }}>Upcoming Sessions</h2>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="ev-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {upcomingEvents.map((e) => (
                  <div key={e.title} style={{
                    border: `0.5px solid ${v.border}`,
                    borderRadius: 12,
                    padding: "1.25rem",
                    backgroundColor: v.card,
                  }}>
                    <span className="ev-mono" style={{
                      backgroundColor: "rgba(29,158,117,0.12)",
                      color: "#1D9E75",
                      fontSize: 11,
                      padding: "3px 9px",
                      borderRadius: 6,
                      border: "0.5px solid rgba(29,158,117,0.35)",
                      display: "inline-block",
                      marginBottom: "0.75rem",
                    }}>
                      {e.date}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, marginTop: 0, color: v.fg }}>{e.title}</h3>
                    <p style={{ fontSize: 14, color: v.fgMuted, lineHeight: 1.65, margin: 0 }}>{e.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                border: `0.5px solid ${v.border}`,
                borderRadius: 12,
                padding: "2.5rem 2rem",
                backgroundColor: v.muted,
                textAlign: "center",
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: v.card,
                  border: `0.5px solid ${v.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <Calendar size={24} style={{ color: v.fgMuted }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, marginTop: 0, color: v.fg }}>
                  Next session being scheduled
                </h3>
                <p style={{ fontSize: 14, color: v.fgMuted, maxWidth: 400, margin: "0 auto 1.25rem" }}>
                  Season 2 of the DevRel Strategy Room is in the works.
                  Join the newsletter to get notified when it drops.
                </p>
                <a href="/#newsletter" style={{
                  display: "inline-block",
                  backgroundColor: "#534AB7",
                  color: "white",
                  padding: "0.65rem 1.5rem",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}>
                  Get notified →
                </a>
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;

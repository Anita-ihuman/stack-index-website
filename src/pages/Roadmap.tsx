import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const colors = {
  purple: { bg: "#EEEDFE", accent: "#534AB7", dark: "#3C3489" },
  teal:   { bg: "#E1F5EE", accent: "#1D9E75", dark: "#085041" },
  amber:  { bg: "#FAEEDA", accent: "#BA7517", dark: "#633806" },
  coral:  { bg: "#FAECE7", accent: "#D85A30", dark: "#712B13" },
  green:  { bg: "#EAF3DE", accent: "#639922", dark: "#27500A" },
};

const phases = [
  {
    num: "01",
    color: "purple" as const,
    title: "Foundation — Know Thyself & the Field",
    subtitle: "Months 1–2 · Laying the groundwork",
    months: "1–2",
    barFill: 11,
    description:
      "Begin by deeply understanding what Developer Relations actually is — and where you fit within it. Map the landscape of DevRel roles, research companies doing it well, and honestly audit your own skills, interests, and gaps. This phase is about intentional exploration, not output.",
    skills: ["DevRel overview", "Industry mapping", "Self-assessment", "Networking basics", "Community research", "Role landscape"],
    deliverables: [
      "Personal brand audit completed",
      "Target company list (20+ companies)",
      "LinkedIn profile fully optimized",
      "First 10 industry connections made",
      "DevRel job description analysis doc",
    ],
  },
  {
    num: "02",
    color: "teal" as const,
    title: "Technical Credibility — Build the Dev Muscle",
    subtitle: "Months 2–6 · Earning developer trust through craft",
    months: "2–6",
    barFill: 28,
    description:
      "Developers trust people who can code alongside them. This phase builds your technical foundation — not to become a senior engineer, but to credibly engage with APIs, developer tools, and code-level conversations. Start contributing to open source and building public proof of your technical chops.",
    skills: ["Coding practice", "GitHub activity", "API documentation", "Developer tooling", "Open source contributions", "SDK testing"],
    deliverables: [
      "GitHub portfolio with 5+ public repos",
      "3 working code demos / samples",
      "API integration side project shipped",
      "First open source PR merged",
      "Dev tool review published",
    ],
  },
  {
    num: "03",
    color: "amber" as const,
    title: "Content & Communication — Find Your Voice",
    subtitle: "Months 4–9 · Becoming a trusted voice",
    months: "4–9",
    barFill: 50,
    description:
      "Content is the core leverage point of DevRel. In this phase you develop your writing, speaking, and video skills — finding the formats and topics where your voice is most authentic. Consistency matters more than perfection. Start publishing, start speaking, start shipping.",
    skills: ["Technical writing", "Public speaking", "Video creation", "Social media", "Workshop facilitation", "Storytelling"],
    deliverables: [
      "10 published blog posts or tutorials",
      "First conference or meetup talk submitted",
      "YouTube or video presence launched",
      "500+ social media followers",
      "1 technical workshop delivered",
    ],
  },
  {
    num: "04",
    color: "coral" as const,
    title: "Community & Ecosystem — Become a Connector",
    subtitle: "Months 8–14 · Building and sustaining community",
    months: "8–14",
    barFill: 78,
    description:
      "DevRel at scale is community at scale. This phase teaches you how to build programs, manage platforms, cultivate ambassadors, and forge ecosystem partnerships. You shift from individual contributor to community architect — creating spaces where developers thrive.",
    skills: ["Community management", "Event planning", "Partnership building", "Ambassador programs", "Discord/Slack ops", "Feedback loops"],
    deliverables: [
      "3 community events hosted end-to-end",
      "Ambassador program designed and launched",
      "1,000+ community members reached",
      "2 strategic ecosystem partnerships forged",
      "Community health dashboard live",
    ],
  },
  {
    num: "05",
    color: "green" as const,
    title: "Strategy & Business Impact — Speak to Leadership",
    subtitle: "Months 12–18 · Connecting DevRel to revenue and growth",
    months: "12–18",
    barFill: 100,
    description:
      "The final phase transforms you from a practitioner to a strategic leader. You learn to set OKRs, quantify DevRel's business impact, communicate ROI to executives, and drive GTM strategy. This is where DevRel becomes undeniably essential — not a nice-to-have.",
    skills: ["OKR setting", "Executive storytelling", "GTM strategy", "ROI measurement", "Cross-functional leadership", "DevRel charter"],
    deliverables: [
      "DevRel playbook fully documented",
      "Quarterly business review presented",
      "ROI attribution dashboard built",
      "DevRel charter approved by leadership",
      "DevRel hiring framework created",
    ],
  },
];

const skillsMatrix = [
  { name: "Technical writing",       fill: 90, color: "purple" as const, priority: "Critical"  },
  { name: "Public speaking",         fill: 80, color: "purple" as const, priority: "Critical"  },
  { name: "Coding proficiency",      fill: 75, color: "teal"   as const, priority: "High"      },
  { name: "Community building",      fill: 85, color: "teal"   as const, priority: "High"      },
  { name: "Analytics & metrics",     fill: 70, color: "amber"  as const, priority: "Medium"    },
  { name: "Product empathy",         fill: 80, color: "teal"   as const, priority: "High"      },
  { name: "Event management",        fill: 55, color: "amber"  as const, priority: "Medium"    },
  { name: "GTM & business strategy", fill: 60, color: "coral"  as const, priority: "Grow into" },
];

const priorityColor: Record<string, string> = {
  Critical:   "#534AB7",
  High:       "#1D9E75",
  Medium:     "#BA7517",
  "Grow into":"#D85A30",
};

const resources = [
  {
    title: "Must-Read",
    items: [
      "The Business Value of Developer Relations — Mary Thengvall",
      "Developer Relations — Caroline Lewko & James Parton",
      "The Developer Marketing Manual — Adam DuVander",
      "DevRel Weekly Newsletter",
      "Developer Marketing Alliance Blog",
    ],
  },
  {
    title: "Podcasts & Talks",
    items: [
      "DevRel Radio",
      "Community Pulse Podcast",
      "Screaming in the Cloud",
      "Developer Advocate Stories",
      "The New Stack Podcast",
    ],
  },
  {
    title: "Communities",
    items: [
      "DevRel Collective",
      "Developer Marketing Alliance",
      "Community Pulse Community",
      "DevRelX Summit Discord",
      "Developer Advocate Network",
    ],
  },
];

// CSS variable helpers — work in both dark and light mode
const v = {
  card:       "hsl(var(--card))",
  muted:      "hsl(var(--muted))",
  border:     "hsl(var(--border))",
  fg:         "hsl(var(--foreground))",
  fgMuted:    "hsl(var(--muted-foreground))",
};

const Roadmap = () => {
  const [openPhase, setOpenPhase] = useState<number | null>(null);

  const togglePhase = (idx: number) => {
    setOpenPhase(openPhase === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        .rm-root { font-family: 'Syne', sans-serif; }
        .rm-mono { font-family: 'JetBrains Mono', monospace; }
        .rm-arrow { transition: transform 0.25s ease; display: block; }
        .rm-arrow.open { transform: rotate(180deg); }
        .rm-panel {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.25s ease;
          max-height: 0;
          opacity: 0;
        }
        .rm-panel.open {
          max-height: 900px;
          opacity: 1;
        }
        @media (max-width: 640px) {
          .rm-stats  { grid-template-columns: 1fr 1fr !important; }
          .rm-res    { grid-template-columns: 1fr !important; }
          .rm-skill-row { flex-wrap: wrap; }
          .rm-skill-name { width: 100% !important; }
          .rm-skill-label { width: 100% !important; text-align: left !important; }
        }
      `}</style>

      <Header />

      <main className="rm-root">
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1rem 5rem" }}>

          {/* ── Hero ── */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="rm-mono" style={{
              display: "inline-block",
              backgroundColor: "#EEEDFE",
              color: "#534AB7",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 8,
              marginBottom: "1.25rem",
              border: "0.5px solid rgba(83,74,183,0.35)",
            }}>
              Senior DevRel Expert Guide · 2024–2025
            </span>

            <h1 style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1rem",
              color: v.fg,
            }}>
              The Complete{" "}
              <span style={{ color: "#534AB7" }}>Developer Relations</span>{" "}
              Career Roadmap
            </h1>

            <p style={{
              maxWidth: 540,
              margin: "0 auto",
              color: v.fgMuted,
              fontSize: "1.0625rem",
              lineHeight: 1.65,
            }}>
              A structured 18-month guide to building a credible, impactful career in DevRel —
              from foundations to executive strategy.
            </p>
          </div>

          {/* ── Stats Row ── */}
          <div className="rm-stats" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: "3rem",
          }}>
            {[
              { val: "18",    label: "Months Full Roadmap",  color: colors.purple },
              { val: "5",     label: "Core Phases",          color: colors.teal   },
              { val: "30+",   label: "Skills to Master",     color: colors.amber  },
              { val: "$85K+", label: "Avg Starting Salary",  color: colors.coral  },
            ].map((s) => (
              <div key={s.label} style={{
                backgroundColor: v.muted,
                border: `0.5px solid ${v.border}`,
                borderRadius: 12,
                padding: "1.25rem 1rem",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: s.color.accent }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: v.fgMuted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Phase Cards ── */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem", color: v.fg }}>
              The 5 Phases
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phases.map((phase, idx) => {
                const c = colors[phase.color];
                const isOpen = openPhase === idx;
                return (
                  <div key={idx} style={{
                    border: `0.5px solid ${isOpen ? c.accent : v.border}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: isOpen ? c.bg : v.card,
                    transition: "background-color 0.25s ease, border-color 0.2s ease",
                  }}>
                    {/* Accordion header */}
                    <div
                      role="button"
                      onClick={() => togglePhase(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "1rem 1.25rem",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <span className="rm-mono" style={{
                        backgroundColor: c.bg,
                        color: c.dark,
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: `0.5px solid ${c.accent}`,
                        flexShrink: 0,
                      }}>
                        {phase.num}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: isOpen ? c.dark : v.fg }}>
                          {phase.title}
                        </div>
                        <div style={{ fontSize: 13, color: isOpen ? c.dark : v.fgMuted, marginTop: 2, opacity: isOpen ? 0.75 : 1 }}>
                          {phase.subtitle}
                        </div>
                      </div>

                      <svg
                        className={`rm-arrow${isOpen ? " open" : ""}`}
                        width={18} height={18}
                        viewBox="0 0 24 24" fill="none"
                        stroke={c.accent} strokeWidth={2.5}
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

                    {/* Accordion panel */}
                    <div className={`rm-panel${isOpen ? " open" : ""}`}>
                      <div style={{ padding: "0 1.25rem 1.5rem" }}>

                        {/* Progress bar */}
                        <div style={{ marginBottom: "1.25rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: c.dark, marginBottom: 6, opacity: 0.8 }}>
                            <span className="rm-mono">Months {phase.months}</span>
                            <span className="rm-mono">{phase.barFill}% of 18-month roadmap</span>
                          </div>
                          <div style={{ height: 6, backgroundColor: "rgba(0,0,0,0.12)", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${phase.barFill}%`, backgroundColor: c.accent, borderRadius: 4 }} />
                          </div>
                        </div>

                        <p style={{ fontSize: 14, lineHeight: 1.7, color: c.dark, marginBottom: "1.25rem", opacity: 0.85 }}>
                          {phase.description}
                        </p>

                        {/* Skill tags */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.25rem" }}>
                          {phase.skills.map((skill) => (
                            <span key={skill} className="rm-mono" style={{
                              backgroundColor: "rgba(255,255,255,0.4)",
                              color: c.dark,
                              border: `0.5px solid ${c.accent}`,
                              borderRadius: 6,
                              padding: "5px 10px",
                              fontSize: 12,
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Deliverables */}
                        <div style={{
                          backgroundColor: "rgba(255,255,255,0.3)",
                          border: "0.5px solid rgba(0,0,0,0.1)",
                          borderRadius: 8,
                          padding: "1rem",
                        }}>
                          <div className="rm-mono" style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: c.dark,
                            marginBottom: 10,
                          }}>
                            Deliverables
                          </div>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {phase.deliverables.map((d) => (
                              <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7, fontSize: 13, color: c.dark, opacity: 0.85 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: c.accent, marginTop: 5, flexShrink: 0 }} />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Skills Matrix ── */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem", color: v.fg }}>
              DevRel Skills Matrix
            </h2>
            <div style={{
              border: `0.5px solid ${v.border}`,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: v.card,
            }}>
              {skillsMatrix.map((skill, idx) => {
                const c = colors[skill.color];
                return (
                  <div key={skill.name} className="rm-skill-row" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0.875rem 1.25rem",
                    borderBottom: idx < skillsMatrix.length - 1 ? `0.5px solid ${v.border}` : "none",
                  }}>
                    <div className="rm-skill-name" style={{ width: 200, flexShrink: 0, fontSize: 14, fontWeight: 500, color: v.fg }}>
                      {skill.name}
                    </div>
                    <div style={{ flex: 1, height: 6, backgroundColor: v.muted, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${skill.fill}%`, backgroundColor: c.accent, borderRadius: 4 }} />
                    </div>
                    <span className="rm-mono rm-skill-label" style={{
                      width: 90,
                      textAlign: "right",
                      flexShrink: 0,
                      fontSize: 11,
                      fontWeight: 600,
                      color: priorityColor[skill.priority] || v.fgMuted,
                    }}>
                      {skill.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Resources ── */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem", color: v.fg }}>
              Resources
            </h2>
            <div className="rm-res" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {resources.map((r) => (
                <div key={r.title} style={{
                  border: `0.5px solid ${v.border}`,
                  borderRadius: 12,
                  padding: "1.25rem",
                  backgroundColor: v.card,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: "0.875rem", color: v.fg }}>{r.title}</div>
                  {r.items.map((item, i) => (
                    <div key={item} style={{
                      fontSize: 12,
                      color: v.fgMuted,
                      padding: "7px 0",
                      borderBottom: i < r.items.length - 1 ? `0.5px solid ${v.border}` : "none",
                      lineHeight: 1.5,
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA Strip ── */}
          <div style={{
            backgroundColor: "rgba(83,74,183,0.12)",
            border: "0.5px solid rgba(83,74,183,0.35)",
            borderRadius: 12,
            padding: "2rem 2.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}>
            <div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 6, color: v.fg }}>
                Ready to accelerate your DevRel journey?
              </div>
              <div style={{ fontSize: 14, color: v.fgMuted, maxWidth: 420 }}>
                Join the DevRel Strategy Room — a community of practitioners building strategic,
                business-aligned developer programs.
              </div>
            </div>
            <a href="/events" style={{
              backgroundColor: "#534AB7",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              flexShrink: 0,
              display: "inline-block",
            }}>
              Join the Strategy Room →
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service"
        description="The terms governing your use of Stack Index."
        path="/terms"
      />
      <Header />

      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold font-mono mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: April 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Acceptance</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Stack Index (<strong>stackindex.io</strong>), you agree to be
              bound by these Terms of Service. If you do not agree, do not use the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. What Stack Index provides</h2>
            <p className="text-muted-foreground leading-relaxed">
              Stack Index is an informational and AI-assisted platform for discovering and comparing
              DevOps and cloud tools. Content includes curated tool profiles, scoring data, blog
              articles, and AI-generated analysis. All content is provided for informational purposes
              only and does not constitute professional or legal advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. AI-generated content</h2>
            <p className="text-muted-foreground leading-relaxed">
              The AI Analyzer and search features use large language models (Anthropic Claude) to
              generate responses based on publicly available documentation and data. AI outputs may
              contain inaccuracies. Always verify critical information against official documentation
              before making architectural or procurement decisions. Stack Index is not liable for
              decisions made based on AI-generated analysis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Acceptable use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Use the platform to scrape, harvest, or collect data at scale via automated means</li>
              <li>Attempt to circumvent rate limits or abuse the AI Analyzer API</li>
              <li>Submit harmful, illegal, or misleading content through the contact form</li>
              <li>Use the platform to infringe on the intellectual property of tool vendors or other parties</li>
              <li>Reverse-engineer or replicate the platform's scoring methodology for commercial resale</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Intellectual property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All original content on Stack Index — including blog articles, scoring frameworks,
              editorial copy, and UI design — is the intellectual property of Stack Index. Tool names,
              logos, and trademarks belong to their respective owners and are referenced for
              informational purposes only. Stack Index is not affiliated with or endorsed by any tool
              vendor listed in the catalog.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Newsletter</h2>
            <p className="text-muted-foreground leading-relaxed">
              By subscribing to the newsletter, you consent to receive periodic emails from Stack
              Index. You may unsubscribe at any time via the unsubscribe link in any email. We will
              not send spam or share your email with advertisers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Disclaimer of warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              Stack Index is provided "as is" without warranties of any kind, express or implied. We
              do not guarantee uptime, accuracy of tool data, or completeness of AI analysis. Use of
              the platform is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Limitation of liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Stack Index shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of — or inability
              to use — the platform or its AI-generated content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">9. Changes to these terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms as the platform grows. Changes will be communicated via the
              newsletter or a notice on the site. Continued use after notice constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these terms?{' '}
              <a href="mailto:thestackindex@gmail.com" className="text-primary hover:underline">
                thestackindex@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

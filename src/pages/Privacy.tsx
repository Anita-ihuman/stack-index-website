import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy"
        description="How Stack Index collects, uses, and protects your data."
        path="/privacy"
      />
      <Header />

      <main className="container py-16">
        <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold font-mono mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: April 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Who we are</h2>
            <p className="text-muted-foreground leading-relaxed">
              Stack Index (<strong>stackindex.io</strong>) is an AI-native platform that helps developers
              discover, compare, and adopt DevOps and cloud tooling. We are operated independently and
              can be reached at <a href="mailto:thestackindex@gmail.com" className="text-primary hover:underline">thestackindex@gmail.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. What we collect</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-medium text-foreground">Newsletter subscriptions</h3>
                <p>When you subscribe to our newsletter, we collect your email address and optionally
                your first name. This data is stored on our server and synced to Brevo (our email
                platform) to send you our digest.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Contact form</h3>
                <p>When you submit our contact form, we collect your name, email, and message. This is
                delivered to our inbox and not stored permanently on external services.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Usage analytics</h3>
                <p>We use privacy-respecting analytics to understand how the site is used (pages viewed,
                referral sources, feature usage). No personally identifiable information is collected
                through analytics. We do not use advertising cookies.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">AI Analyzer queries</h3>
                <p>Queries submitted to the AI Analyzer are forwarded to Anthropic's API to generate
                responses. We do not store these queries beyond the duration of your session. Please
                review <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic's privacy policy</a> for
                how they handle API data.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. How we use your data</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>To send newsletter digests and DevRel content you subscribed to</li>
              <li>To respond to contact form enquiries</li>
              <li>To improve the platform using aggregated, anonymous usage data</li>
              <li>We do not sell, rent, or trade your personal data to third parties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Third-party services</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">Brevo</strong> — email delivery platform for newsletter. Your email is stored in Brevo under their <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a>.</p>
              <p><strong className="text-foreground">Anthropic</strong> — powers the AI Analyzer. API queries are subject to <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic's privacy policy</a>.</p>
              <p><strong className="text-foreground">Vercel</strong> — hosts the frontend. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel's privacy policy</a>.</p>
              <p><strong className="text-foreground">Railway</strong> — hosts the backend API. See <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Railway's privacy policy</a>.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Stack Index does not use tracking or advertising cookies. We use browser
              <code className="text-xs bg-muted px-1 py-0.5 rounded">localStorage</code> only to
              store blog comments you write (client-side only, never sent to our servers). Our
              analytics are cookieless.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Data retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Newsletter subscriber data is retained until you unsubscribe. You may unsubscribe at any
              time via the link in any email or by contacting us directly. Contact form submissions are
              retained in our inbox for up to 12 months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Your rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal data. To exercise these
              rights, email us at{' '}
              <a href="mailto:thestackindex@gmail.com" className="text-primary hover:underline">
                thestackindex@gmail.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Changes to this policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this policy as the platform evolves. Material changes will be announced
              via the newsletter or a notice on the site. Continued use of Stack Index after such
              notice constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions or concerns about this policy?{' '}
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

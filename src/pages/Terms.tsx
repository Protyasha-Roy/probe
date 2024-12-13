import { Helmet } from 'react-helmet-async'

export function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Probe</title>
        <meta name="description" content="Terms of Service for using Probe - Your expert guide to learning anything." />
      </Helmet>

      <div className="container py-12 font-space-grotesk">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8">
            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-primary-black/70">
                By accessing and using Probe, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
              <ul className="list-disc list-inside text-primary-black/70 space-y-2">
                <li>You must be at least 13 years old to use Probe</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You may not use another user's account without permission</li>
              </ul>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">3. Content Guidelines</h2>
              <ul className="list-disc list-inside text-primary-black/70 space-y-2">
                <li>You retain ownership of content you create</li>
                <li>Content must not violate any laws or rights</li>
                <li>We may remove content that violates our policies</li>
                <li>You grant us license to use your content on our platform</li>
              </ul>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">4. Service Usage</h2>
              <ul className="list-disc list-inside text-primary-black/70 space-y-2">
                <li>Free tier users have limited access to features</li>
                <li>Pay-as-you-go pricing for additional features</li>
                <li>We may modify or discontinue services at any time</li>
                <li>Usage must comply with fair use policies</li>
              </ul>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">5. Termination</h2>
              <p className="text-primary-black/70">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
              </p>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
              <p className="text-primary-black/70">
                We reserve the right to modify these terms at any time. We will notify users of any changes by updating the date at the top of this page.
              </p>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
              <p className="text-primary-black/70">
                If you have any questions about these Terms, please contact us at support@probe.learning
              </p>
            </section>
          </div>

          <div className="mt-8 text-center text-primary-black/50">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  )
} 
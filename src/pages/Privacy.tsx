import { Helmet } from 'react-helmet-async'

export function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Probe</title>
        <meta name="description" content="Privacy Policy for Probe - Learn how we protect and handle your data." />
      </Helmet>

      <div className="container py-12 font-space-grotesk">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-primary-black/70">
                <p>We collect information that you provide directly to us:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Account information (email, name)</li>
                  <li>Profile information</li>
                  <li>Content you create or share</li>
                  <li>Communications with us</li>
                </ul>
              </div>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-primary-black/70 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information</li>
              </ul>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-primary-black/70">
                We do not sell, trade, or rent your personal information to third parties. We may share generic aggregated demographic information not linked to any personal identification information.
              </p>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <ul className="list-disc list-inside text-primary-black/70 space-y-2">
                <li>We use industry-standard encryption</li>
                <li>Regular security assessments</li>
                <li>Secure data storage practices</li>
                <li>Limited access to personal information</li>
              </ul>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
              <ul className="list-disc list-inside text-primary-black/70 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
              <p className="text-primary-black/70">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">7. Changes to Privacy Policy</h2>
              <p className="text-primary-black/70">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the date below.
              </p>
            </section>

            <section className="brutal-card">
              <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
              <p className="text-primary-black/70">
                If you have any questions about this Privacy Policy, please contact us at privacy@probe.learning
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
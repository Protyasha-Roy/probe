import { Helmet } from 'react-helmet-async'
import { Contact as ContactSection } from '../components/features/landing/Contact'
import { BackButton } from '../components/common/BackButton'

export function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact - Probe</title>
        <meta name="description" content="Get in touch with Probe - We'd love to hear from you and help with any questions." />
      </Helmet>

      <div className="container py-12">
        <BackButton />
        <ContactSection />
      </div>
    </>
  )
} 
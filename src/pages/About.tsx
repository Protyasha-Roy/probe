import { Helmet } from 'react-helmet-async'
import { About as AboutSection } from '../components/features/landing/About'
import { BackButton } from '../components/common/BackButton'

export function About() {
  return (
    <>
      <Helmet>
        <title>About - Probe</title>
        <meta name="description" content="Learn more about Probe - Your expert guide to learning anything." />
      </Helmet>

      <div className="container py-12">
        <BackButton />
        <AboutSection />
      </div>
    </>
  )
} 
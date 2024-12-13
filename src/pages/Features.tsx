import { Helmet } from 'react-helmet-async'
import { Features as FeaturesSection } from '../components/features/landing/Features'
import { BackButton } from '../components/common/BackButton'

export function Features() {
  return (
    <>
      <Helmet>
        <title>Features - Probe</title>
        <meta name="description" content="Discover the powerful features of Probe that make learning easier and more effective." />
      </Helmet>

      <div className="container py-12">
        <BackButton />
        <FeaturesSection />
      </div>
    </>
  )
} 
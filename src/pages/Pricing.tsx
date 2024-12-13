import { Helmet } from 'react-helmet-async'
import { Pricing as PricingSection } from '../components/features/landing/Pricing'
import { BackButton } from '../components/common/BackButton'

export function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing - Probe</title>
        <meta name="description" content="Simple and transparent pricing plans for Probe - Start with our free plan and upgrade as you grow." />
      </Helmet>

      <div className="container py-12">
        <BackButton />
        <PricingSection />
      </div>
    </>
  )
} 
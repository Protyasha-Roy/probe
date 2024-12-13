import { Helmet } from 'react-helmet-async'
import { Hero } from '../components/features/landing/Hero'
import { About } from '../components/features/landing/About'
import { Features } from '../components/features/landing/Features'
import { Pricing } from '../components/features/landing/Pricing'
import { Contact } from '../components/features/landing/Contact'

export function Landing() {
  return (
    <>
      <Helmet>
        <title>Probe - Your Expert Guide to Learning Anything</title>
        <meta name="description" content="Create detailed roadmaps with 100% free resources for any subject. Save time and money while learning from expert-curated paths." />
        <meta name="keywords" content="learning platform, roadmap creator, free resources, education, learning paths, expert guides" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://probe.learning" />
        <meta property="og:title" content="Probe - Your Expert Guide to Learning Anything" />
        <meta property="og:description" content="Create detailed roadmaps with 100% free resources for any subject. Save time and money while learning from expert-curated paths." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://probe.learning" />
        <meta property="twitter:title" content="Probe - Your Expert Guide to Learning Anything" />
        <meta property="twitter:description" content="Create detailed roadmaps with 100% free resources for any subject. Save time and money while learning from expert-curated paths." />
        <meta property="twitter:image" content="/og-image.png" />

        {/* Additional SEO tags */}
        <link rel="canonical" href="https://probe.learning" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen">
        <Hero />
        <About />
        <Features />
        <Pricing />
        <Contact />
      </div>
    </>
  )
} 
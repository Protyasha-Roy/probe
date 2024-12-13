import { Link } from 'react-router-dom'
import { Button } from '../../common/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#FF5F1F_1px,transparent_1px)] bg-[length:32px_32px] opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-20 sm:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <div className="mb-8 text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter">
            <span className="bg-gradient-to-br from-primary-orange via-primary-orange to-primary-black bg-clip-text text-transparent">
              PROBE
            </span>
          </div>

          {/* Tagline */}
          <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl">
            <span className="inline-block transform hover:-rotate-2 transition-transform duration-200">
              Your Expert Guide to
            </span>{' '}
            <span className="inline-block text-primary-orange transform hover:rotate-2 transition-transform duration-200">
              Learning Anything
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg sm:text-xl max-w-2xl text-primary-black/80">
            Create detailed roadmaps with 100% free resources for any subject. Save time and money while learning from expert-curated paths.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                Get Started Free
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Roadmaps Created', value: '50K+' },
              { label: 'Success Rate', value: '95%' },
              { label: 'Free Resources', value: '100%' },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="brutal-card p-4 hover:scale-105 transition-transform hover:rotate-1"
              >
                <div className="text-3xl font-bold text-primary-orange mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-black/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 
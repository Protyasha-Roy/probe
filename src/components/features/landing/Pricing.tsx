import { Link } from 'react-router-dom'
import { Button } from '../../common/Button'

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: '0',
      currency: 'BDT',
      features: [
        '2 AI generated roadmaps',
        '2 custom roadmaps',
        'Progress tracking',
        'Public roadmap sharing',
      ],
    },
    {
      name: 'Pay as You Go',
      description: 'For serious learners',
      features: [
        '35 BDT per AI roadmap',
        '15 BDT per custom roadmap',
        'Progress tracking',
        'Public roadmap sharing',
        'Priority support',
      ],
      featured: true,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-primary-orange">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-white brutal-shadow">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-primary-white/90 max-w-2xl mx-auto">
            Start with our free plan and upgrade as you grow. Pay only for what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`brutal-card bg-primary-white ${
                plan.featured ? 'transform md:-translate-y-4' : ''
              }`}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-primary-black/70 mb-6">{plan.description}</p>
                {plan.price && (
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-primary-black/70"> {plan.currency}</span>
                  </div>
                )}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/auth">
                  <Button
                    className="w-full"
                    variant={plan.featured ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 
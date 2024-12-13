export function About() {
  return (
    <section id="about" className="py-20 bg-primary-orange">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image/Illustration */}
          <div className="order-2 md:order-1">
            <div className="brutal-card bg-primary-white transform rotate-2 hover:rotate-0 transition-transform">
              <div className="aspect-square bg-[linear-gradient(45deg,#000000_1px,transparent_1px)] bg-[length:16px_16px] opacity-20" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-white mb-6 brutal-shadow">
              Why Choose Probe?
            </h2>
            <div className="space-y-6 text-lg text-primary-white/90">
              <p>
                Tired of endless searching for the right learning resources? Probe is your solution. 
                We combine AI intelligence with expert knowledge to create comprehensive learning paths 
                that are 100% free.
              </p>
              <p>
                Our platform doesn't just give you a list of resources - it creates a structured, 
                step-by-step roadmap tailored to your learning style and schedule. Whether you're 
                a beginner or advanced learner, we've got you covered.
              </p>
              <div className="pt-4">
                <div className="brutal-card bg-primary-white text-primary-black transform -rotate-1">
                  <h3 className="text-xl font-bold mb-4">What Makes Us Different</h3>
                  <ul className="space-y-2">
                    <li>✓ AI-powered resource curation</li>
                    <li>✓ Expert-verified learning paths</li>
                    <li>✓ 100% free resources</li>
                    <li>✓ Personalized learning experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import {
  Zap, MessageCircle, BarChart2, Users, ArrowRight,
  CheckCircle, Instagram, Bot, Clock
} from 'lucide-react'

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'DM Automation',
    desc: 'Auto-reply to Instagram DMs with keyword triggers. Nurture leads 24/7 without lifting a finger.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Replies',
    desc: 'Let Claude generate smart, contextual responses that feel human and convert better.',
  },
  {
    icon: Zap,
    title: 'Comment-to-DM',
    desc: 'When someone comments on your post, automatically send them a private DM instantly.',
  },
  {
    icon: Users,
    title: 'Contact CRM',
    desc: 'Build a subscriber list from Instagram. Tag, segment, and track every interaction.',
  },
  {
    icon: Clock,
    title: 'Sequences',
    desc: 'Set up drip campaigns. Follow up automatically over days and weeks.',
  },
  {
    icon: BarChart2,
    title: 'Analytics',
    desc: 'See open rates, reply rates, and conversions for every flow you run.',
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['1 Instagram account', '500 contacts', '2 active flows', 'Basic analytics'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    features: ['3 Instagram accounts', '10,000 contacts', 'Unlimited flows', 'AI replies', 'Advanced analytics', 'Priority support'],
    cta: 'Start 7-day trial',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/month',
    features: ['Unlimited accounts', 'Unlimited contacts', 'White label', 'API access', 'Dedicated support'],
    cta: 'Contact us',
    highlight: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 instagram-gradient rounded-lg flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">AutoFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand text-sm px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Now with AI-powered replies
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Turn Instagram DMs into
            <span className="gradient-text block">revenue, automatically</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            AutoFlow automates your Instagram conversations — DMs, comments, story mentions —
            so you capture every lead and never miss a customer again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="text-sm text-text-muted mt-4">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 border-y border-dark-border bg-dark-surface/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-text-muted text-sm">
            Join thousands of creators and businesses automating their Instagram growth
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to grow on Instagram</h2>
            <p className="text-text-secondary text-lg">Powerful automation tools that work while you sleep</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-brand/30 transition-all group">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <f.icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-dark-surface/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-text-secondary text-lg">Start free. Upgrade when you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-7 flex flex-col ${
                  plan.highlight
                    ? 'bg-brand/10 border-brand'
                    : 'bg-dark-card border-dark-border'
                }`}
              >
                {plan.highlight && (
                  <span className="text-xs font-semibold text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-full self-start mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-text-muted mb-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to automate your Instagram?</h2>
          <p className="text-text-secondary mb-8">Set up your first automation in minutes.</p>
          <Link href="/register">
            <Button size="lg">
              Get started for free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 instagram-gradient rounded flex items-center justify-center">
              <Instagram className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">AutoFlow</span>
          </div>
          <p className="text-text-muted text-sm">© 2025 AutoFlow. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary">Privacy</a>
            <a href="#" className="hover:text-text-primary">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

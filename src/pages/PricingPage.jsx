import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { PremiumButton, Badge } from '../../components/shared/PremiumUI'
import PremiumNavbar from '../../components/landing/PremiumNavbar'
import PremiumFooter from '../../components/landing/PremiumFooter'
import '../../styles/designSystem.css'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('annual')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individual teachers',
      price: billingPeriod === 'annual' ? 99 : 9,
      period: billingPeriod === 'annual' ? '/year' : '/month',
      features: [
        'Analyze up to 50 papers/month',
        'Basic reporting',
        'Student dashboard',
        'Email support',
        'Community access',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Best for small schools',
      price: billingPeriod === 'annual' ? 499 : 49,
      period: billingPeriod === 'annual' ? '/year' : '/month',
      features: [
        'Analyze unlimited papers',
        'Advanced AI insights',
        'Multi-user accounts (up to 10)',
        'Parent portal',
        'Priority support',
        'Monthly reports',
        'Custom branding',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large schools & districts',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited everything',
        'Custom integrations',
        'SSO & advanced security',
        'Unlimited user accounts',
        'Dedicated support',
        'Data analytics',
        'Custom development',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const features = [
    {
      category: 'Analysis',
      items: [
        { name: 'AI Paper Analysis', plans: [true, true, true] },
        { name: 'Handwriting Pattern Matching', plans: [true, true, true] },
        { name: 'Dyslexia Detection', plans: [true, true, true] },
        { name: 'Dysgraphia Detection', plans: [true, true, true] },
      ],
    },
    {
      category: 'Reporting',
      items: [
        { name: 'Basic Reports', plans: [true, true, true] },
        { name: 'Advanced Analytics', plans: [false, true, true] },
        { name: 'Custom Reports', plans: [false, false, true] },
        { name: 'Progress Tracking', plans: [false, true, true] },
      ],
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Parent Portal', plans: [false, true, true] },
        { name: 'Multi-user Accounts', plans: [false, true, true] },
        { name: 'Team Collaboration', plans: [false, true, true] },
        { name: 'Integration API', plans: [false, false, true] },
      ],
    },
    {
      category: 'Support',
      items: [
        { name: 'Email Support', plans: [true, true, true] },
        { name: 'Priority Support', plans: [false, true, true] },
        { name: 'Dedicated Account Manager', plans: [false, false, true] },
        { name: '24/7 Phone Support', plans: [false, false, true] },
      ],
    },
  ]

  const faqs = [
    {
      q: 'Can I try NeuroScan for free?',
      a: 'Yes! All plans include a 14-day free trial. No credit card required.',
    },
    {
      q: 'How does the monthly limit work?',
      a: 'Your plan comes with a monthly allotment of papers you can analyze. Unused allotments roll over.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. Cancel your subscription anytime. No questions asked, no hidden fees.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, PayPal, and ACH transfers for enterprise accounts.',
    },
    {
      q: 'Do you offer discounts for annual billing?',
      a: 'Yes! Annual billing saves you 2-3 months of fees compared to monthly.',
    },
    {
      q: 'How do I upgrade or downgrade my plan?',
      a: 'You can change your plan anytime from your account settings. Changes take effect immediately.',
    },
  ]

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <PremiumNavbar />

      {/* Header */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary">Simple, transparent pricing</Badge>
            <h1 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'var(--font-bold)',
              marginTop: 16,
              marginBottom: 20,
            }}>
              Plans for every school
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              marginBottom: 40,
            }}>
              From individual teachers to large school districts, we have a plan that fits your needs.
            </p>

            {/* Billing toggle */}
            <div style={{
              display: 'inline-flex',
              gap: 16,
              background: 'var(--color-surface-medium)',
              padding: 4,
              borderRadius: 'var(--radius-full)',
            }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                style={{
                  padding: '10px 20px',
                  background: billingPeriod === 'monthly' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--easing-out)',
                  boxShadow: billingPeriod === 'monthly' ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                style={{
                  padding: '10px 20px',
                  background: billingPeriod === 'annual' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--easing-out)',
                  boxShadow: billingPeriod === 'annual' ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Annual{' '}
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                  (Save 20%)
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing cards */}
      <section style={{
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
              marginBottom: 80,
            }}
          >
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-2xl)',
                  border: plan.popular ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: plan.popular ? 'linear-gradient(135deg, var(--color-primary-background), rgba(0, 188, 212, 0.05))' : 'var(--color-surface)',
                  padding: 'var(--space-8)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--duration-normal) var(--easing-out)',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: plan.popular ? 'var(--shadow-lg)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = plan.popular ? 'var(--shadow-lg)' : 'none'
                  e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: 16,
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}>
                    Most Popular
                  </div>
                )}

                <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 8 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 24 }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    fontSize: typeof plan.price === 'string' ? 'var(--text-2xl)' : 'var(--text-4xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-primary)',
                  }}>
                    {plan.price}
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <Link to="/register" style={{ marginBottom: 24, textDecoration: 'none' }}>
                  <PremiumButton
                    variant={plan.popular ? 'primary' : 'secondary'}
                    fullWidth
                    size="lg"
                  >
                    {plan.cta} <ArrowRight size={18} />
                  </PremiumButton>
                </Link>

                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.features.map((feature) => (
                      <div key={feature} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <CheckCircle size={18} color="var(--color-success)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature comparison */}
      <section style={{
        padding: '80px 40px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 16,
            }}>
              Detailed feature comparison
            </h2>
          </motion.div>

          {features.map((section) => (
            <div key={section.category} style={{ marginBottom: 40 }}>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                padding: '16px 0',
                marginBottom: 16,
                borderBottom: '2px solid var(--color-border)',
              }}>
                {section.category}
              </h3>
              {section.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: 16,
                    padding: '12px 0',
                    borderBottom: '1px solid var(--color-border)',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    {item.name}
                  </div>
                  {item.plans.map((included, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                      {included ? (
                        <CheckCircle size={18} color="var(--color-success)" style={{ margin: '0 auto' }} />
                      ) : (
                        <div style={{ width: 18, height: 2, background: 'var(--color-border)', margin: '0 auto' }} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section style={{
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 16,
            }}>
              Frequently asked questions
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>
              Have a question? We've got answers.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, idx) => (
              <motion.div
                key={faq.q}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)',
                  background: 'var(--color-surface)',
                }}
              >
                <details style={{ cursor: 'pointer' }}>
                  <summary style={{
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}>
                    {faq.q}
                  </summary>
                  <p style={{
                    marginTop: 12,
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                  }}>
                    {faq.a}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px',
        background: 'var(--primary-gradient)',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 16,
            }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'var(--text-lg)',
              marginBottom: 32,
              opacity: 0.95,
            }}
          >
            Start your free 14-day trial today. No credit card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/register">
              <PremiumButton size="lg" variant="secondary">
                Start Free Trial <ArrowRight size={18} />
              </PremiumButton>
            </Link>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  )
}

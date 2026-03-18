import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MessageSquare, FileText, Video, CheckCircle } from 'lucide-react'
import { Badge, PremiumButton } from '../components/shared/PremiumUI.jsx'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'
import '../styles/designSystem.css'

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Articles', count: 24 },
    { id: 'getting-started', label: 'Getting Started', count: 6 },
    { id: 'analysis', label: 'Analysis & Reports', count: 8 },
    { id: 'security', label: 'Security & Privacy', count: 5 },
    { id: 'billing', label: 'Billing & Plans', count: 5 },
  ]

  const articles = [
    {
      id: 1,
      title: 'Getting started with NeuroScan',
      category: 'getting-started',
      description: 'Learn how to set up your account and start analyzing papers in minutes.',
      icon: '🚀',
    },
    {
      id: 2,
      title: 'How uploading and scanning works',
      category: 'getting-started',
      description: 'Step-by-step guide to scanning or uploading student test papers.',
      icon: '📱',
    },
    {
      id: 3,
      title: 'Understanding AI analysis results',
      category: 'analysis',
      description: 'Deep dive into how our AI detects patterns and generates insights.',
      icon: '🧠',
    },
    {
      id: 4,
      title: 'Creating custom reports',
      category: 'analysis',
      description: 'Learn how to generate detailed reports for parents and specialists.',
      icon: '📊',
    },
    {
      id: 5,
      title: 'Data privacy and FERPA compliance',
      category: 'security',
      description: 'How we protect student data and comply with education regulations.',
      icon: '🔒',
    },
    {
      id: 6,
      title: 'Two-factor authentication setup',
      category: 'security',
      description: 'Secure your account with two-factor authentication.',
      icon: '🔐',
    },
    {
      id: 7,
      title: 'Managing team members',
      category: 'getting-started',
      description: 'Invite teachers, parents, or staff to collaborate on NeuroScan.',
      icon: '👥',
    },
    {
      id: 8,
      title: 'Upgrading your plan',
      category: 'billing',
      description: 'How to upgrade to a higher tier or add additional features.',
      icon: '⬆️',
    },
  ]

  const faqs = [
    {
      q: 'What types of learning disorders can NeuroScan detect?',
      a: 'NeuroScan specializes in detecting dyslexia and dysgraphia through handwriting analysis. Our AI is trained on patterns associated with these specific learning disabilities.',
    },
    {
      q: 'How accurate is the detection?',
      a: 'Our AI has a 94% detection accuracy rate, validated by educational psychologists. However, NeuroScan is a screening tool, not a diagnostic instrument.',
    },
    {
      q: 'How long does analysis take?',
      a: 'Analysis typically takes 30 seconds per paper. The AI processes handwriting patterns in real-time and generates insights immediately.',
    },
    {
      q: 'What image quality is needed for accurate analysis?',
      a: 'We recommend clear, well-lit images of the handwritten work. Our AI can still process lower quality images, but clarity improves accuracy.',
    },
    {
      q: 'Is student data encrypted?',
      a: 'Yes. All student information is encrypted end-to-end using AES-256 encryption. We comply with FERPA and other education privacy regulations.',
    },
    {
      q: 'Can parents see their child\'s analysis?',
      a: 'Yes. With parental access enabled, parents can view their child\'s analysis reports and track progress over time through their private portal.',
    },
  ]

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides to get the most out of NeuroScan.',
      icon: Video,
      link: '#',
    },
    {
      title: 'API Documentation',
      description: 'Developer docs for integrating NeuroScan with your school management system.',
      icon: FileText,
      link: '#',
    },
    {
      title: 'Contact Support',
      description: 'Need help? Email our support team or start a live chat.',
      icon: MessageSquare,
      link: '/contact',
    },
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <PremiumNavbar />

      {/* Hero */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 16,
            }}>
              Help & Support
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              marginBottom: 32,
            }}>
              Find answers, tutorials, and resources to help you get the most out of NeuroScan.
            </p>

            {/* Search */}
            <div style={{
              position: 'relative',
              marginBottom: 20,
            }}>
              <Search size={18} style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)',
              }} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--color-border)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--duration-fast) var(--easing-out)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section style={{
        padding: '60px 40px',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 40 }}>
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-bold)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing-wide)',
              marginBottom: 16,
              color: 'var(--color-text-tertiary)',
            }}>
              Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    background: selectedCategory === cat.id ? 'var(--color-primary-background)' : 'transparent',
                    border: selectedCategory === cat.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                    borderRadius: 'var(--radius-lg)',
                    color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: selectedCategory === cat.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast) var(--easing-out)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {cat.label}
                  <span style={{ fontSize: 'var(--text-sm)', opacity: 0.6 }}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ marginBottom: 60 }}>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 24,
              }}>
                {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.label}
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
              }}>
                {filteredArticles.map((article) => (
                  <motion.a
                    key={article.id}
                    href="#"
                    style={{
                      padding: 'var(--space-6)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      color: 'inherit',
                      background: 'var(--color-surface)',
                      transition: 'all var(--duration-fast) var(--easing-out)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>
                      {article.icon}
                    </div>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-semibold)',
                      marginBottom: 8,
                      color: 'var(--color-text-primary)',
                    }}>
                      {article.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                    }}>
                      {article.description}
                    </p>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div style={{ marginBottom: 60 }}>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 24,
              }}>
                Frequently asked questions
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    style={{
                      padding: 'var(--space-6)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
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
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 24,
              }}>
                Additional resources
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
              }}>
                {resources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <a
                      key={resource.title}
                      href={resource.link}
                      style={{
                        padding: 'var(--space-6)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        transition: 'all var(--duration-fast) var(--easing-out)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'none'
                      }}
                    >
                      <Icon size={32} color="var(--color-primary)" />
                      <div>
                        <h3 style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-semibold)',
                          marginBottom: 4,
                        }}>
                          {resource.title}
                        </h3>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                        }}>
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '60px 40px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 16,
          }}>
            Can't find what you're looking for?
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            marginBottom: 24,
          }}>
            Our support team is here to help. Contact us anytime.
          </p>
          <PremiumButton size="lg">
            Contact Support
          </PremiumButton>
        </motion.div>
      </section>

      <PremiumFooter />
    </div>
  )
}

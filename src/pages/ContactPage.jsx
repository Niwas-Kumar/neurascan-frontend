import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { PremiumButton, Badge } from '../../components/shared/PremiumUI'
import PremiumNavbar from '../../components/landing/PremiumNavbar'
import PremiumFooter from '../../components/landing/PremiumFooter'
import '../../styles/designSystem.css'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Thank you! We\'ll get back to you soon.')
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      info: 'hello@neurascan.ai',
      desc: 'We\'ll respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Phone',
      info: '+1 (234) 567-8900',
      desc: 'Available Monday-Friday, 9am-6pm EST',
    },
    {
      icon: MapPin,
      title: 'Office',
      info: 'San Francisco, CA',
      desc: '123 Education Street, Suite 400',
    },
  ]

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <PremiumNavbar />

      {/* Hero */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-primary-background) 0%, rgba(0, 188, 212, 0.05) 100%)',
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
              Get in touch
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
            }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact methods */}
      <section style={{
        padding: '80px 40px',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
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
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  textAlign: 'center',
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
                <Icon size={40} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  marginBottom: 8,
                }}>
                  {method.title}
                </h3>
                <p style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  marginBottom: 4,
                }}>
                  {method.info}
                </p>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  {method.desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Contact form */}
      <section style={{
        padding: '80px 40px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 24,
              textAlign: 'center',
            }}>
              Send us a message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-lg)',
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  color: '#155724',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                <CheckCircle size={24} />
                <div>
                  <strong>Thank you!</strong> We've received your message and will get back to you soon.
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 6,
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
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

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 6,
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
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

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 6,
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
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

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 6,
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Message *
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows="6"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-base)',
                      fontFamily: 'var(--font-body)',
                      transition: 'all var(--duration-fast) var(--easing-out)',
                      resize: 'vertical',
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

                <PremiumButton
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  <Send size={18} /> Send Message
                </PremiumButton>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  )
}

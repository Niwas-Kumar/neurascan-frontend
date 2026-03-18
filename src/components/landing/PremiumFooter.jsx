import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Twitter, Linkedin, Github } from 'lucide-react'
import { BrandLogo } from '../shared/PremiumUI.jsx'

export default function PremiumFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Community', href: '/community' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'FERPA', href: '/ferpa' },
    ],
  }

  return (
    <footer style={{
      background: 'var(--color-text-primary)',
      color: 'white',
      paddingTop: 'var(--space-16)',
      paddingBottom: 'var(--space-8)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
        {/* Main footer content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40,
          marginBottom: 60,
        }}>
          {/* Brand section */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <BrandLogo size={40} variant="icon" />
            </div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 12,
              color: 'white',
            }}>
              NeuroScan
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.7,
              marginBottom: 20,
            }}>
              AI-powered learning disorder detection for educators and parents.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color var(--duration-fast) var(--easing-out)' }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                <Twitter size={18} />
              </a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color var(--duration-fast) var(--easing-out)' }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                <Linkedin size={18} />
              </a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color var(--duration-fast) var(--easing-out)' }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-bold)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing-wide)',
                marginBottom: 16,
                color: 'white',
              }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast) var(--easing-out)',
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-bold)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing-wide)',
              marginBottom: 16,
              color: 'white',
            }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="mailto:hello@neurascan.ai" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 'var(--text-sm)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color var(--duration-fast) var(--easing-out)',
              }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
              >
                <Mail size={16} />
                hello@neurascan.ai
              </a>
              <a href="tel:+1234567890" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 'var(--text-sm)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color var(--duration-fast) var(--easing-out)',
              }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
              >
                <Phone size={16} />
                +1 (234) 567-8900
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--text-sm)',
          color: 'rgba(255, 255, 255, 0.6)',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>© {currentYear} NeuroScan. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="/privacy" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

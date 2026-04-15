import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Twitter, Linkedin, Github } from 'lucide-react'
import { NeuraScanLogo } from '../shared/Logo.jsx'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  secondary: '#14B8A6',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  bgDark: '#0F172A',
  bgDarkSubtle: '#1E293B',
}

export default function PremiumFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
      { label: 'Integrations', href: '/integrations' },
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
      { label: 'Research', href: '/research' },
      { label: 'Case Studies', href: '/case-studies' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'FERPA', href: '/ferpa' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ]

  return (
    <footer style={{
      background: COLORS.bgDark,
      color: 'white',
      paddingTop: 80,
      paddingBottom: 32,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Main footer content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(4, 1fr)',
          gap: 48,
          marginBottom: 64,
        }}>
          {/* Brand section */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <NeuraScanLogo size={42} variant="light" />
            </div>
            <p style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: 1.75,
              marginBottom: 24,
              maxWidth: 280,
            }}>
              AI-powered learning disorder detection helping educators and parents identify and support students with learning differences.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.primary
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 20,
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: "'Inter', sans-serif",
              }}>
                {category}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {links.map(({ label, href }) => (
                  <Link
                    key={label}
                    to={href}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.55)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.55)'}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div style={{
          display: 'flex',
          gap: 48,
          paddingBottom: 40,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: 32,
          flexWrap: 'wrap',
        }}>
          <a
            href="mailto:hello.neurascan@gmail.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.secondary}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            <Mail size={16} />
            hello.neurascan@gmail.com
          </a>
          <a
            href="tel:+919599364556"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.secondary}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            <Phone size={16} />
            +91 9599364556
          </a>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.6)',
          }}>
            <MapPin size={16} />
            Noida, Uttar Pradesh
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          color: 'rgba(255, 255, 255, 0.45)',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif" }}>
            © {currentYear} NeuraScan. Released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'underline' }}>MIT License</a>. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            <Link
              to="/privacy"
              style={{
                color: 'rgba(255, 255, 255, 0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.45)'}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              style={{
                color: 'rgba(255, 255, 255, 0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.45)'}
            >
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              style={{
                color: 'rgba(255, 255, 255, 0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.45)'}
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          footer > div > div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  )
}

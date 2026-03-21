import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Zap, Shield, BarChart3, TrendingUp, Users, Award, CheckCircle,
  ArrowRight, Play, Quote, Sparkles, FileSearch, ClipboardCheck, LineChart
} from 'lucide-react'
import { NeuraScanLogo, NeuraScanLogoAnimated } from '../components/shared/Logo.jsx'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'
import '../styles/designSystem.css'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  // Primary: Deep Indigo
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',

  // Secondary: Soft Teal
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryLight: '#2DD4BF',
  secondaryBg: '#CCFBF1',

  // Neutrals
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Backgrounds
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } },
}

// ════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════
function Badge({ children, variant = 'primary' }) {
  const styles = {
    primary: {
      background: COLORS.primaryBg,
      color: COLORS.primary,
      border: `1px solid rgba(49, 46, 129, 0.15)`,
    },
    secondary: {
      background: COLORS.secondaryBg,
      color: COLORS.secondaryDark,
      border: `1px solid rgba(20, 184, 166, 0.15)`,
    },
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 600,
      ...styles[variant],
    }}>
      {children}
    </span>
  )
}

function PremiumButton({ children, variant = 'primary', size = 'md', ...props }) {
  const sizeStyles = {
    sm: { padding: '10px 18px', fontSize: 13 },
    md: { padding: '12px 24px', fontSize: 14 },
    lg: { padding: '16px 32px', fontSize: 15 },
  }

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 14px rgba(49, 46, 129, 0.25)',
    },
    secondary: {
      background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryLight} 100%)`,
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 14px rgba(20, 184, 166, 0.25)',
    },
    outline: {
      background: 'transparent',
      color: COLORS.primary,
      border: `2px solid ${COLORS.primary}`,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: COLORS.textSecondary,
      border: 'none',
      boxShadow: 'none',
    },
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        borderRadius: 12,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.2s ease',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function FeatureCard({ icon: Icon, title, description, color = 'primary' }) {
  const colorMap = {
    primary: { bg: COLORS.primaryBg, icon: COLORS.primary },
    secondary: { bg: COLORS.secondaryBg, icon: COLORS.secondary },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(49, 46, 129, 0.12)' }}
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: 32,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: c.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Icon size={24} color={c.icon} strokeWidth={2} />
      </div>
      <h3 style={{
        fontSize: 18,
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: 10,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 1.7,
      }}>
        {description}
      </p>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div style={{
      background: '#FFFFFF',
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        width: 400,
        height: 400,
        background: `radial-gradient(circle, ${COLORS.primaryBg} 0%, transparent 70%)`,
        borderRadius: '50%',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '0%',
        width: 300,
        height: 300,
        background: `radial-gradient(circle, ${COLORS.secondaryBg} 0%, transparent 70%)`,
        borderRadius: '50%',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '80px 40px' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
        >
          {/* Left: Copy */}
          <div>
            <motion.div variants={itemVariants}>
              <Badge variant="primary">
                <Sparkles size={14} />
                AI-Powered Learning Assessment
              </Badge>
              <div style={{ height: 28 }} />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                lineHeight: 1.1,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: COLORS.textPrimary,
              }}
            >
              Identify learning disorders{' '}
              <span style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                with precision.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: 18,
                color: COLORS.textSecondary,
                lineHeight: 1.75,
                marginBottom: 40,
                maxWidth: 520,
              }}
            >
              Equip educators and parents with clinically-validated AI analysis that detects dyslexia, dysgraphia, and learning disabilities through handwriting assessment.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <PremiumButton size="lg">
                  Start Assessment <ArrowRight size={18} />
                </PremiumButton>
              </Link>
              <PremiumButton size="lg" variant="outline">
                <Play size={18} /> Watch Overview
              </PremiumButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{
                marginTop: 56,
                display: 'flex',
                gap: 40,
                paddingTop: 32,
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              {[
                { num: '12,400+', label: 'Students assessed' },
                { num: '340+', label: 'Schools partnered' },
                { num: '94%', label: 'Detection accuracy' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: COLORS.primary,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    {num}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: COLORS.textMuted,
                    marginTop: 4,
                    fontWeight: 500,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 520,
              background: `linear-gradient(135deg, ${COLORS.primaryBg} 0%, ${COLORS.secondaryBg} 100%)`,
              borderRadius: 24,
              border: `1px solid ${COLORS.border}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${COLORS.primary}08 0%, ${COLORS.secondary}08 100%)`,
            }} />

            {/* Neural network visualization placeholder */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}>
              <NeuraScanLogoAnimated size={120} />
              <div style={{
                fontSize: 16,
                color: COLORS.textMuted,
                fontWeight: 500,
                textAlign: 'center',
              }}>
                AI-Powered Analysis Engine
              </div>
            </div>

            {/* Floating stats cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: 40,
                right: 30,
                background: COLORS.bgSurface,
                borderRadius: 16,
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Analysis Speed</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.secondary }}>Under 30s</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              style={{
                position: 'absolute',
                bottom: 50,
                left: 30,
                background: COLORS.bgSurface,
                borderRadius: 16,
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Disorders Detected</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>Dyslexia, Dysgraphia +3</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// FEATURES SECTION
// ════════════════════════════════════════════════════════════════
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Rapid AI Analysis',
      description: 'Process handwriting samples in under 30 seconds with our specialized neural networks trained on clinical data.',
      color: 'primary',
    },
    {
      icon: Shield,
      title: 'FERPA Compliant',
      description: 'All student data encrypted with AES-256. Enterprise-grade security with full regulatory compliance.',
      color: 'secondary',
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Reports',
      description: 'Detailed analysis with actionable recommendations designed for educators and intervention specialists.',
      color: 'primary',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor student development over time with longitudinal data visualization and milestone tracking.',
      color: 'secondary',
    },
    {
      icon: Users,
      title: 'Collaborative Platform',
      description: 'Share assessment results securely between teachers, parents, and learning specialists.',
      color: 'primary',
    },
    {
      icon: Award,
      title: 'Research-Validated',
      description: 'Developed in collaboration with educational psychologists and validated against clinical standards.',
      color: 'secondary',
    },
  ]

  return (
    <section id="features" style={{
      padding: '120px 40px',
      background: COLORS.bgSurface,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <Badge variant="secondary">Platform Capabilities</Badge>
          <h2 style={{
            fontSize: 40,
            fontWeight: 800,
            marginTop: 20,
            marginBottom: 16,
            color: COLORS.textPrimary,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Clinical-grade assessment tools
          </h2>
          <p style={{
            fontSize: 17,
            color: COLORS.textSecondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Comprehensive features designed to support early identification and intervention for learning disorders.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 28,
          }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// HOW IT WORKS SECTION
// ════════════════════════════════════════════════════════════════
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: FileSearch,
      title: 'Upload Sample',
      description: 'Scan or photograph student handwriting samples and upload to our secure platform.',
    },
    {
      num: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our neural network analyzes stroke patterns, letter formations, and spatial relationships.',
    },
    {
      num: '03',
      icon: ClipboardCheck,
      title: 'Review Results',
      description: 'Receive comprehensive reports with risk indicators and specific pattern observations.',
    },
    {
      num: '04',
      icon: LineChart,
      title: 'Track Progress',
      description: 'Monitor development over time and measure intervention effectiveness.',
    },
  ]

  return (
    <section style={{
      padding: '120px 40px',
      background: COLORS.bgBase,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <h2 style={{
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 16,
            color: COLORS.textPrimary,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Assessment workflow
          </h2>
          <p style={{
            fontSize: 17,
            color: COLORS.textSecondary,
            maxWidth: 540,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            A streamlined process from sample collection to actionable insights.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 32,
          }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              style={{ position: 'relative' }}
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 44,
                  left: '60%',
                  width: '80%',
                  height: 2,
                  background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                  opacity: 0.3,
                }} />
              )}

              <div style={{
                width: 88,
                height: 88,
                borderRadius: 24,
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0 8px 24px rgba(49, 46, 129, 0.2)',
                position: 'relative',
              }}>
                <step.icon size={36} color="white" strokeWidth={1.5} />
                <div style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: COLORS.secondary,
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {step.num}
                </div>
              </div>

              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 10,
                color: COLORS.textPrimary,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {step.title}
              </h3>
              <p style={{
                color: COLORS.textSecondary,
                lineHeight: 1.7,
                fontSize: 14,
              }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// TESTIMONIALS SECTION
// ════════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const testimonials = [
    {
      author: 'Dr. Sarah Mitchell',
      role: 'Learning Specialist, Westbrook Academy',
      text: 'NeuraScan identified three students in my class with early signs of dysgraphia that traditional screening missed. The detailed reports made it straightforward to develop targeted intervention plans.',
      initials: 'SM',
    },
    {
      author: 'James Rodriguez',
      role: 'Elementary School Principal',
      text: 'We reduced our assessment processing time by 70% while improving early detection rates. The platform has become an essential part of our student support infrastructure.',
      initials: 'JR',
    },
    {
      author: 'Emily Chen',
      role: 'Parent',
      text: 'After months of uncertainty, NeuraScan provided the evidence we needed to get proper support for our son. The assessment report helped us communicate effectively with his school.',
      initials: 'EC',
    },
  ]

  return (
    <section style={{
      padding: '120px 40px',
      background: COLORS.bgSurface,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <h2 style={{
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 16,
            color: COLORS.textPrimary,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Trusted by educators nationwide
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 28,
          }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.author} variants={itemVariants}>
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.primaryBg} 0%, ${COLORS.bgSurface} 100%)`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 32,
                height: '100%',
              }}>
                <Quote size={24} color={COLORS.primary} style={{ opacity: 0.3, marginBottom: 16 }} />
                <p style={{
                  fontSize: 15,
                  color: COLORS.textSecondary,
                  lineHeight: 1.8,
                  marginBottom: 28,
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                  }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      fontSize: 15,
                    }}>
                      {testimonial.author}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: COLORS.textMuted,
                      marginTop: 2,
                    }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// CTA SECTION
// ════════════════════════════════════════════════════════════════
function CTASection() {
  return (
    <section style={{
      padding: '100px 40px',
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 50%, ${COLORS.secondary} 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 20,
            color: 'white',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Early detection enables better outcomes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 18,
            marginBottom: 40,
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.7,
          }}
        >
          Join over 340 schools using NeuraScan to identify and support students with learning differences.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 700,
                background: 'white',
                color: COLORS.primary,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              Begin Free Assessment <ArrowRight size={18} />
            </motion.button>
          </Link>
          <Link to="/pricing" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ background: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 600,
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              View Pricing
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ════════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div style={{ background: COLORS.bgBase }}>
      <PremiumNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <PremiumFooter />
    </div>
  )
}

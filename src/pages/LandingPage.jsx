import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Zap, Shield, BarChart3, TrendingUp, Users, Award, CheckCircle,
  Star, ArrowRight, Play, Quote, Mail, Lock
} from 'lucide-react'
import { BrandLogo, PremiumButton, PremiumCard, Badge, IconBox } from '../../components/shared/PremiumUI.jsx'
import PremiumNavbar from '../../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../../components/landing/PremiumFooter.jsx'
import '../../styles/designSystem.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } },
}

// ════════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf2ff 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 300,
        height: 300,
        background: 'var(--primary-gradient)',
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '10%',
        width: 250,
        height: 250,
        background: 'var(--color-accent)',
        borderRadius: '50%',
        opacity: 0.06,
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '60px 40px' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
        >
          {/* Left: Copy */}
          <div>
            <motion.div variants={itemVariants}>
              <Badge variant="primary" size="md">
                🎯 AI-Powered Learning Detection
              </Badge>
              <div style={{ height: 24 }} />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 'var(--text-6xl)',
                fontWeight: 'var(--font-black)',
                letterSpacing: 'var(--letter-spacing-tighter)',
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              Detect learning disorders{' '}
              <span style={{ background: 'var(--primary-gradient)', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                in seconds.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                marginBottom: 40,
                maxWidth: 500,
              }}
            >
              Empower educators and parents with AI-powered handwriting analysis that identifies dyslexia, dysgraphia, and learning disabilities before they fall behind.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register">
                <PremiumButton size="lg">
                  Start Free Trial <ArrowRight size={18} />
                </PremiumButton>
              </Link>
              <PremiumButton size="lg" variant="secondary">
                <Play size={18} /> Watch Demo
              </PremiumButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{
                marginTop: 48,
                display: 'flex',
                gap: 32,
                paddingTop: 32,
                borderTop: '1px solid var(--color-border)',
              }}
            >
              {[
                { num: '12K+', label: 'Students analyzed' },
                { num: '340+', label: 'Schools onboard' },
                { num: '94%', label: 'Detection accuracy' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)' }}>
                    {num}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustration placeholder */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 500,
              background: 'linear-gradient(135deg, var(--color-primary-background), rgba(0, 188, 212, 0.1))',
              borderRadius: 'var(--radius-3xl)',
              border: '1px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--primary-gradient)',
              opacity: 0.05,
            }} />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <Brain size={120} color="var(--color-primary)" opacity={0.3} />
            </div>
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
      title: 'Instant AI Analysis',
      desc: 'Analyze student papers in under 30 seconds with advanced neural networks.',
      color: 'primary',
    },
    {
      icon: Shield,
      title: 'FERPA Compliant',
      desc: 'All student data encrypted end-to-end. Enterprise-grade security.',
      color: 'success',
    },
    {
      icon: BarChart3,
      title: 'Real-time Insights',
      desc: 'Track progress over time with detailed reports and actionable recommendations.',
      color: 'warning',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      desc: 'Identify at-risk students early to enable preventative interventions.',
      color: 'info',
    },
    {
      icon: Users,
      title: 'Collaboration Tools',
      desc: 'Share insights between teachers, parents, and specialists seamlessly.',
      color: 'accent',
    },
    {
      icon: Award,
      title: 'Research-Backed',
      desc: 'Validated by leading educational psychologists and neurologists.',
      color: 'primary',
    },
  ]

  return (
    <section style={{
      padding: '120px 40px',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <Badge variant="secondary">Why educators choose us</Badge>
          <h2 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)', marginTop: 16, marginBottom: 20 }}>
            Powerful features for modern classrooms
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            Everything you need to identify and support students with learning disorders.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
          }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <PremiumCard hoverable padding="var(--space-8)">
                <IconBox icon={feature.icon} size="lg" color={feature.color} />
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginTop: 16, marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {feature.desc}
                </p>
              </PremiumCard>
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
    { num: '1', title: 'Upload', desc: 'Scan or upload student test papers directly' },
    { num: '2', title: 'Analyze', desc: 'AI analyzes handwriting patterns in seconds' },
    { num: '3', title: 'Insights', desc: 'Get detailed reports with actionable insights' },
    { num: '4', title: 'Act', desc: 'Create intervention plans and track progress' },
  ]

  return (
    <section style={{
      padding: '120px 40px',
      background: 'var(--color-background)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <h2 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)', marginBottom: 20 }}>
            How it works
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            Simple, intuitive, effective. Four steps to actionable insights.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 40,
          }}
        >
          {steps.map((step, idx) => (
            <motion.div key={step.title} variants={itemVariants} style={{ position: 'relative' }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 20,
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', marginBottom: 8 }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {step.desc}
              </p>

              {idx < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 30,
                  right: -50,
                  width: 40,
                  height: 2,
                  background: 'var(--primary-gradient)',
                  display: 'none',
                  '@media (min-width: 1024px)': {
                    display: 'block',
                  },
                }} />
              )}
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
      author: 'Sarah Johnson',
      role: 'High School Teacher',
      text: '"NeuroScan identified 3 students in my class with potential dyslexia that we missed. Incredible tool."',
      avatar: '👩‍🏫',
    },
    {
      author: 'Michael Chen',
      role: 'School Principal',
      text: '"We reduced our assessment time by 70% and improved our early detection rate. Game-changer."',
      avatar: '👨‍💼',
    },
    {
      author: 'Emma Rodriguez',
      role: 'Parent',
      text: '"Finally found solid evidence for my son\'s learning challenges. This empowered us to get proper support."',
      avatar: '👩‍🦰',
    },
  ]

  return (
    <section style={{
      padding: '120px 40px',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <h2 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)', marginBottom: 20 }}>
            Loved by educators and parents
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.author} variants={itemVariants}>
              <PremiumCard gradient padding="var(--space-8)">
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} color="var(--color-warning)" fill="var(--color-warning)" />
                  ))}
                </div>
                <Quote size={20} color="var(--color-text-tertiary)" style={{ opacity: 0.5 }} />
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: '16px 0', lineHeight: 1.8 }}>
                  {testimonial.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: '2rem' }}>{testimonial.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {testimonial.author}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </PremiumCard>
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
      padding: '120px 40px',
      background: 'var(--primary-gradient)',
      color: 'white',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'var(--text-5xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 20,
          }}
        >
          Start identifying learning disorders today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'var(--text-xl)',
            marginBottom: 32,
            opacity: 0.95,
          }}
        >
          Join 340+ schools using NeuroScan to detect and support students with learning disabilities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/register">
            <PremiumButton size="lg" variant="secondary">
              Start Free Trial <ArrowRight size={18} />
            </PremiumButton>
          </Link>
          <Link to="/pricing">
            <button style={{
              padding: '16px 32px',
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--easing-out)',
            }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white'
                e.target.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = 'white'
              }}
            >
              View Pricing
            </button>
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
    <div style={{ background: 'var(--color-background)' }}>
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

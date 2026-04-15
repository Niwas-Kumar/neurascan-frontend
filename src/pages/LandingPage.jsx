import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  BarChart3,
  ClipboardList,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Star,
  Lock,
  GraduationCap,
  Award,
} from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar'
import PremiumFooter from '../components/landing/PremiumFooter'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',       // Deep indigo
  primary: '#14B8A6',       // Soft teal
  primaryHover: '#0D9488',
  indigo: '#6366F1',
  violet: '#7C3AED',
  emerald: '#059669',
  amber: '#D97706',
  rose: '#E11D48',

  bgBase: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  border: '#E2E8F0',

  // Feature icon backgrounds
  primaryBg: 'rgba(20, 184, 166, 0.1)',
  indigoBg: '#EEF2FF',
  violetBg: '#F5F3FF',
  emeraldBg: '#ECFDF5',
  amberBg: '#FFFBEB',
  roseBg: '#FFF1F2',
}

const features = [
  {
    icon: Upload,
    title: 'AI Handwriting Analysis',
    description: 'Upload student test papers and get instant AI-powered analysis detecting dyslexia and dysgraphia patterns.',
    color: COLORS.primary,
    bg: COLORS.primaryBg,
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track progress over time with trend charts, risk distributions, and class-wide insights.',
    color: COLORS.indigo,
    bg: COLORS.indigoBg,
  },
  {
    icon: ClipboardList,
    title: 'AI-Generated Quizzes',
    description: 'Create targeted quizzes for students, distribute via email, and track learning gaps automatically.',
    color: COLORS.violet,
    bg: COLORS.violetBg,
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Secure data handling with role-based access. Teachers and parents each see only what they need.',
    color: COLORS.emerald,
    bg: COLORS.emeraldBg,
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get dyslexia and dysgraphia scores within seconds of upload, with actionable AI commentary.',
    color: COLORS.amber,
    bg: COLORS.amberBg,
  },
  {
    icon: Users,
    title: 'Parent Collaboration',
    description: 'Keep parents informed with a dedicated portal to view progress reports and quiz results.',
    color: COLORS.rose,
    bg: COLORS.roseBg,
  },
]

const stats = [
  { value: '89%', label: 'Detection Accuracy' },
  { value: '5s', label: 'Avg. Analysis Time' },
  { value: '2K+', label: 'Papers Analyzed' },
  { value: '50+', label: 'Schools Trust Us' },
]

const testimonials = [
  {
    name: 'Anjali Verma',
    role: 'Special Education Teacher',
    school: 'DPS Noida',
    quote: 'NeuraScan helped me identify 3 students who needed early intervention. The AI analysis is remarkably accurate.',
    rating: 5,
  },
  {
    name: 'Dr. Kavita Nair',
    role: 'School Psychologist',
    school: 'Ryan International School',
    quote: 'The handwriting analysis complements our traditional assessments beautifully. A game-changer for early detection.',
    rating: 5,
  },
  {
    name: 'Rajesh Gupta',
    role: 'Parent',
    school: 'Amity International School',
    quote: "Being able to track my daughter's progress in real-time has been incredibly reassuring. Highly recommended.",
    rating: 5,
  },
]

const howItWorks = [
  {
    step: '1',
    title: 'Upload Handwriting',
    desc: "Take a photo or scan of any student's handwriting sample — tests, homework, or dictation.",
  },
  {
    step: '2',
    title: 'AI Analyzes Patterns',
    desc: 'Our model scans for 30+ dyslexia and dysgraphia indicators including letter reversals and spacing anomalies.',
  },
  {
    step: '3',
    title: 'Get Actionable Insights',
    desc: "Receive risk scores, AI commentary, and recommendations to support each student's unique needs.",
  },
]

// ════════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ════════════════════════════════════════════════════════════════
function Button({ children, variant = 'primary', size = 'md', style = {}, ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    border: 'none',
  }

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '14px 32px', fontSize: 15 },
  }

  const variantStyles = {
    primary: {
      background: COLORS.primary,
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      color: COLORS.textSecondary,
    },
    outline: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  }

  return (
    <button
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// ════════════════════════════════════════════════════════════════
// CARD COMPONENT
// ════════════════════════════════════════════════════════════════
function Card({ children, style = {}, hover = false }) {
  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        transition: hover ? 'box-shadow 0.2s ease, transform 0.2s ease' : 'none',
        ...style,
      }}
      className={hover ? 'card-hover' : ''}
    >
      {children}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// BADGE COMPONENT
// ════════════════════════════════════════════════════════════════
function Badge({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 100,
        fontSize: 13,
        fontWeight: 500,
        background: 'rgba(20, 184, 166, 0.2)',
        color: 'white',
        border: '1px solid rgba(20, 184, 166, 0.3)',
      }}
    >
      {children}
    </span>
  )
}

// ════════════════════════════════════════════════════════════════
// SCROLL REVEAL COMPONENT
// ════════════════════════════════════════════════════════════════
function ScrollReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ════════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgBase }}>
      {/* ══════════════════════════════════════════════════════════
          NAVBAR (shared across all public pages)
          ══════════════════════════════════════════════════════════ */}
      <PremiumNavbar />

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(to bottom, ${COLORS.sidebar}, rgba(49, 46, 129, 0.8))`,
          padding: '80px 24px 112px',
        }}
      >
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: -160,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'rgba(20, 184, 166, 0.1)',
              filter: 'blur(80px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 256,
              height: 256,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}
        >
          <Badge>
            <Zap size={12} />
            AI-Powered Learning Disability Detection
          </Badge>

          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'white',
              marginTop: 24,
            }}
          >
            Identify Dyslexia &{' '}
            <span style={{ color: COLORS.primary }}>Dysgraphia</span>
            <br />
            Before They Hold Students Back
          </h1>

          <p
            style={{
              fontSize: 18,
              color: '#A5B4FC',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '24px auto 0',
            }}
          >
            NeuraScan uses advanced AI to analyze student handwriting, detect learning disability
            patterns early, and help teachers take action when it matters most.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              marginTop: 40,
            }}
          >
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button size="lg">
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS SECTION
          ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.bgCard,
          padding: '48px 24px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 32,
            }}
          >
            {stats.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 36,
                    fontWeight: 700,
                    color: COLORS.primary,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ marginTop: 4, fontSize: 14, color: COLORS.textMuted }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUSTED BY SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: COLORS.bgCard, padding: '32px 24px 48px' }}>
        <ScrollReveal>
          <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: COLORS.textLight,
                marginBottom: 28,
              }}
            >
              Trusted by leading educational institutions
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 48,
                flexWrap: 'wrap',
                opacity: 0.45,
              }}
            >
              {['DPS Noida', 'Ryan International', 'Amity International', 'Kendriya Vidyalaya', 'DAV Public School'].map(
                (name) => (
                  <span
                    key={name}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: COLORS.textSecondary,
                      letterSpacing: '-0.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {name}
                  </span>
                )
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES SECTION
          ══════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                }}
              >
                Everything you need for early intervention
              </h2>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: COLORS.textMuted,
                  maxWidth: 640,
                  margin: '16px auto 0',
                }}
              >
                Powerful tools designed for teachers and parents working together to support students
                with learning differences.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 1: AI Handwriting Analysis — mini upload + result UI */}
          <ScrollReveal delay={0.1}>
            <div
              className="feature-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 64,
                marginBottom: 72,
              }}
            >
              {/* Mock UI: Paper analysis result card */}
              <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 16,
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Title bar */}
                  <div style={{
                    padding: '12px 20px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: COLORS.bgMuted,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }} />
                    <span style={{ marginLeft: 12, fontSize: 12, color: COLORS.textLight, fontFamily: "'Inter', sans-serif" }}>Analysis Result</span>
                  </div>
                  {/* Mock content */}
                  <div style={{ padding: 20 }}>
                    {/* Upload zone */}
                    <div style={{
                      border: `2px dashed ${COLORS.border}`,
                      borderRadius: 10,
                      padding: '16px',
                      textAlign: 'center',
                      marginBottom: 16,
                      background: 'rgba(20, 184, 166, 0.03)',
                    }}>
                      <Upload size={20} color={COLORS.primary} style={{ marginBottom: 4 }} />
                      <p style={{ fontSize: 12, color: COLORS.textMuted }}>student_paper.jpg uploaded</p>
                      <div style={{
                        marginTop: 8,
                        height: 4,
                        borderRadius: 2,
                        background: COLORS.border,
                        overflow: 'hidden',
                      }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: 2, background: COLORS.primary }} />
                      </div>
                    </div>
                    {/* Results */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                      <div style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'rgba(20, 184, 166, 0.08)',
                        border: '1px solid rgba(20, 184, 166, 0.15)',
                      }}>
                        <p style={{ fontSize: 10, color: COLORS.textLight, marginBottom: 2 }}>Dyslexia Risk</p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>Low</p>
                      </div>
                      <div style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'rgba(217, 119, 6, 0.08)',
                        border: '1px solid rgba(217, 119, 6, 0.15)',
                      }}>
                        <p style={{ fontSize: 10, color: COLORS.textLight, marginBottom: 2 }}>Dysgraphia Risk</p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.amber }}>Medium</p>
                      </div>
                    </div>
                    {/* Score bar */}
                    <p style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Overall Confidence</p>
                    <div style={{ height: 6, borderRadius: 3, background: COLORS.border }}>
                      <div style={{ width: '92%', height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.indigo})` }} />
                    </div>
                    <p style={{ fontSize: 10, color: COLORS.textLight, marginTop: 4, textAlign: 'right' }}>92%</p>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div style={{ flex: '1 1 340px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Upload size={24} color={COLORS.primary} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
                  {features[0].title}
                </h3>
                <p style={{ marginTop: 12, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 420 }}>
                  {features[0].description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 2: Detailed Analytics — mini chart mockup */}
          <ScrollReveal delay={0.1}>
            <div
              className="feature-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 64,
                flexDirection: 'row-reverse',
                marginBottom: 72,
              }}
            >
              {/* Mock UI: Analytics dashboard snippet */}
              <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 16,
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Title bar */}
                  <div style={{
                    padding: '12px 20px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: COLORS.bgMuted,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }} />
                    <span style={{ marginLeft: 12, fontSize: 12, color: COLORS.textLight, fontFamily: "'Inter', sans-serif" }}>Student Analytics</span>
                  </div>
                  {/* Chart area */}
                  <div style={{ padding: 20 }}>
                    {/* Mini stat row */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                      {[
                        { label: 'Students', val: '126', trend: '+12%', up: true },
                        { label: 'At Risk', val: '8', trend: '-3%', up: false },
                        { label: 'Improved', val: '34', trend: '+28%', up: true },
                      ].map((s) => (
                        <div key={s.label} style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: COLORS.bgMuted,
                          border: `1px solid ${COLORS.border}`,
                        }}>
                          <p style={{ fontSize: 10, color: COLORS.textLight }}>{s.label}</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{s.val}</p>
                          <p style={{ fontSize: 10, color: s.up ? '#059669' : COLORS.primary, fontWeight: 600 }}>{s.trend}</p>
                        </div>
                      ))}
                    </div>
                    {/* Fake bar chart */}
                    <p style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 10 }}>Weekly Trend</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                      {[40, 55, 35, 70, 60, 85, 75].map((h, i) => (
                        <div key={i} style={{
                          flex: 1,
                          height: `${h}%`,
                          borderRadius: '4px 4px 0 0',
                          background: i === 5
                            ? `linear-gradient(180deg, ${COLORS.indigo}, ${COLORS.primary})`
                            : COLORS.border,
                          transition: 'height 0.3s ease',
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                        <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: COLORS.textLight }}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div style={{ flex: '1 1 340px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.indigoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <BarChart3 size={24} color={COLORS.indigo} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
                  {features[1].title}
                </h3>
                <p style={{ marginTop: 12, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 420 }}>
                  {features[1].description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 3: AI-Generated Quizzes — mini quiz card mockup */}
          <ScrollReveal delay={0.1}>
            <div
              className="feature-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 64,
                marginBottom: 72,
              }}
            >
              {/* Mock UI: Quiz card */}
              <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 16,
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Title bar */}
                  <div style={{
                    padding: '12px 20px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: COLORS.bgMuted,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }} />
                    <span style={{ marginLeft: 12, fontSize: 12, color: COLORS.textLight, fontFamily: "'Inter', sans-serif" }}>Quiz Builder</span>
                  </div>
                  {/* Quiz content */}
                  <div style={{ padding: 20 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>Reading Assessment</span>
                      <span style={{
                        fontSize: 10,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(124, 58, 237, 0.1)',
                        color: COLORS.violet,
                        fontWeight: 600,
                      }}>AI Generated</span>
                    </div>
                    {/* Question */}
                    <div style={{
                      padding: 14,
                      borderRadius: 10,
                      background: COLORS.bgMuted,
                      border: `1px solid ${COLORS.border}`,
                      marginBottom: 12,
                    }}>
                      <p style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 6 }}>Question 3 of 10</p>
                      <p style={{ fontSize: 13, color: COLORS.textPrimary, lineHeight: 1.5 }}>
                        Which word is the correct spelling?
                      </p>
                    </div>
                    {/* Options */}
                    {['becuase', 'because', 'becouse', 'becasue'].map((opt, i) => (
                      <div key={opt} style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: `1px solid ${i === 1 ? COLORS.primary : COLORS.border}`,
                        background: i === 1 ? 'rgba(20, 184, 166, 0.06)' : 'transparent',
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                        <div style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: `2px solid ${i === 1 ? COLORS.primary : COLORS.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {i === 1 && <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.primary }} />}
                        </div>
                        <span style={{ fontSize: 13, color: i === 1 ? COLORS.primary : COLORS.textSecondary, fontWeight: i === 1 ? 600 : 400 }}>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div style={{ flex: '1 1 340px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.violetBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <ClipboardList size={24} color={COLORS.violet} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
                  {features[2].title}
                </h3>
                <p style={{ marginTop: 12, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 420 }}>
                  {features[2].description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Additional features — compact card grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              marginTop: 16,
            }}
          >
            {features.slice(3).map((feature, i) => {
              const Icon = feature.icon
              return (
                <ScrollReveal key={feature.title} delay={i * 0.1}>
                  <Card hover style={{ padding: 24 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: feature.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <Icon size={24} color={feature.color} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: COLORS.textPrimary,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: COLORS.textMuted,
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </p>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: COLORS.bgMuted, padding: '80px 24px' }}>
        <ScrollReveal>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              How it works
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 32,
            }}
          >
            {howItWorks.map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: COLORS.sidebar,
                    color: 'white',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: COLORS.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <ScrollReveal>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              Trusted by educators
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {testimonials.map((t) => (
              <Card key={t.name} style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: COLORS.textMuted,
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                  }}
                >
                  "{t.quote}"
                </p>
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: `1px solid ${COLORS.border}`,
                  }}
                >
                  <p style={{ fontWeight: 500, fontSize: 14, color: COLORS.textPrimary }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    {t.role} · {t.school}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST & SECURITY SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: COLORS.bgMuted, padding: '64px 24px' }}>
        <ScrollReveal>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              Built for Trust & Compliance
            </h2>
            <p
              style={{
                marginTop: 12,
                fontSize: 16,
                color: COLORS.textMuted,
                maxWidth: 600,
                margin: '12px auto 0',
              }}
            >
              NeuraScan is designed with education-grade security and privacy standards from the ground up.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24,
            }}
          >
            {[
              {
                icon: Lock,
                title: 'Data Encryption',
                desc: 'All student data is encrypted at rest and in transit using industry-standard AES-256 encryption.',
                color: COLORS.indigo,
                bg: COLORS.indigoBg,
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                desc: 'Strict role-based access control ensures teachers and parents only see authorized data.',
                color: COLORS.emerald,
                bg: COLORS.emeraldBg,
              },
              {
                icon: GraduationCap,
                title: 'Research-Backed AI',
                desc: 'Our detection models are trained on peer-reviewed research in dyslexia and dysgraphia screening.',
                color: COLORS.primary,
                bg: COLORS.primaryBg,
              },
              {
                icon: Award,
                title: 'FERPA Compliant',
                desc: 'Built to meet FERPA requirements for protecting student education records and privacy.',
                color: COLORS.violet,
                bg: COLORS.violetBg,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} style={{ padding: 24 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={22} color={item.color} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                      marginBottom: 6,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: COLORS.sidebar, padding: '64px 24px' }}>
        <ScrollReveal>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              color: 'white',
            }}
          >
            Ready to support every learner?
          </h2>
          <p style={{ marginTop: 16, fontSize: 16, color: '#A5B4FC' }}>
            Join hundreds of schools using NeuraScan to detect learning disabilities early and make
            a real difference.
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 32,
            }}
          >
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button size="lg">
                Get Started
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER (shared across all public pages)
          ══════════════════════════════════════════════════════════ */}
      <PremiumFooter />

      {/* Hover + responsive styles */}
      <style>{`
        .card-hover:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .feature-row {
            flex-direction: column !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  )
}

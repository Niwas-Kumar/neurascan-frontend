import { Link } from 'react-router-dom'
import {
  Brain,
  Upload,
  BarChart3,
  ClipboardList,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react'

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
  { value: '95%', label: 'Detection Accuracy' },
  { value: '3s', label: 'Avg. Analysis Time' },
  { value: '10K+', label: 'Papers Analyzed' },
  { value: '500+', label: 'Schools Trust Us' },
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Special Education Teacher',
    school: 'Riverside Elementary',
    quote: 'NeuraScan helped me identify 3 students who needed early intervention. The AI analysis is remarkably accurate.',
    rating: 5,
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'School Psychologist',
    school: 'Westlake Academy',
    quote: 'The handwriting analysis complements our traditional assessments beautifully. A game-changer for early detection.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Parent',
    school: 'Lincoln Elementary',
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
// MAIN LANDING PAGE
// ════════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgBase }}>
      {/* ══════════════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${COLORS.border}`,
          background: 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: COLORS.sidebar,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Brain size={20} color={COLORS.primary} />
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              NeuraScan
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

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

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
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
                  Start Free Trial
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
            <p style={{ fontSize: 14, color: '#818CF8' }}>
              No credit card required · Free for up to 10 students
            </p>
          </div>
        </div>
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
          FEATURES SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
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

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} hover style={{ padding: 24 }}>
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
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: COLORS.bgMuted, padding: '80px 24px' }}>
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
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
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
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════════════ */}
      <section style={{ background: COLORS.sidebar, padding: '64px 24px' }}>
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
                Create Free Account
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 24,
              marginTop: 24,
              fontSize: 14,
              color: '#818CF8',
            }}
          >
            {['Free for 10 students', 'No credit card', 'Cancel anytime'].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color={COLORS.primary} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          background: COLORS.bgCard,
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: COLORS.sidebar,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Brain size={16} color={COLORS.primary} />
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              NeuraScan
            </span>
          </div>
          <p style={{ fontSize: 14, color: COLORS.textMuted }}>
            © 2024 NeuraScan. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Hover styles */}
      <style>{`
        .card-hover:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

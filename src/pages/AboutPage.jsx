import React from 'react'
import { motion } from 'framer-motion'
import { Award, Users, Target } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'
import { Badge, IconBox } from '../components/shared/PremiumUI.jsx'
import '../styles/designSystem.css'

export default function AboutPage() {
  const stats = [
    { num: '7+', label: 'Years of research' },
    { num: '340+', label: 'Schools & districts' },
    { num: '12K+', label: 'Students helped' },
    { num: '94%', label: 'Detection accuracy' },
  ]

  const team = [
    { name: 'Niwas Kumar', role: 'CEO & Co-founder', bio: 'Software engineer with a passion for education technology' },
    { name: 'Ratish Raj', role: 'Chief Science Officer', bio: 'Leading AI researcher in learning sciences' },
    { name: 'Lavit Tyagi', role: 'VP Product', bio: 'Former product lead at EdTech pioneer' },
  ]

  const values = [
    {
      icon: Target,
      title: 'Impact-driven',
      desc: 'We\'re on a mission to identify and support every student with learning disabilities.',
    },
    {
      icon: Users,
      title: 'Inclusive',
      desc: 'Every student deserves equal opportunities to succeed, regardless of learning differences.',
    },
    {
      icon: Award,
      title: 'Excellence',
      desc: 'We maintain the highest standards of accuracy, privacy, and research-backed insights.',
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
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary">Our Story</Badge>
            <h1 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'var(--font-bold)',
              marginTop: 16,
              marginBottom: 16,
            }}>
              Transforming learning disability detection
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
            }}>
              We believe every student deserves to be identified and supported. NeuroScan was founded to make learning disability detection fast, accurate, and accessible to all schools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section style={{
        padding: '80px 40px',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 20,
            }}>
              Our mission
            </h2>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              marginBottom: 16,
            }}>
              To democratize learning disability detection through AI, empowering educators and parents with the insights they need to provide timely, targeted support.
            </p>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
            }}>
              We're dedicated to eliminating the achievement gap and ensuring that learning differences are identified early so students can thrive academically and socially.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}>
            {stats.map(({ num, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--primary-gradient-soft)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-primary)',
                  marginBottom: 4,
                }}>
                  {num}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values */}
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
              Our values
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
            }}
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  background: 'linear-gradient(135deg, var(--color-primary-background), rgba(0, 188, 212, 0.05))',
                }}
              >
                <IconBox icon={value.icon} size="lg" color="primary" />
                <h3 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)',
                  marginTop: 16,
                  marginBottom: 8,
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section style={{
        padding: '80px 40px',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
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
            Meet the team
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: 500,
            margin: '0 auto',
          }}>
            Led by researchers and educators passionate about transforming learning disability detection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                textAlign: 'center',
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
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-gradient)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold',
              }}>
                {member.name[0]}
              </div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                marginBottom: 4,
              }}>
                {member.name}
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-primary)',
                fontWeight: 600,
                marginBottom: 8,
              }}>
                {member.role}
              </p>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-tertiary)',
              }}>
                {member.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <PremiumFooter />
    </div>
  )
}

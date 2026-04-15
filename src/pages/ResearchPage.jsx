import React from 'react'
import { BookOpen, Brain, FileText, BarChart3 } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16, color: '#fff' },
  heroSub: { fontSize: 18, maxWidth: 640, margin: '0 auto', color: 'rgba(255,255,255,0.9)' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  section: { marginBottom: 48 },
  sectionTitle: { fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  sectionSub: { fontSize: 14, color: '#334155', marginBottom: 20, lineHeight: 1.7 },
  card: { background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E2E8F0', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#334155', lineHeight: 1.8 },
  ref: { fontSize: 13, color: '#475569', fontStyle: 'italic', marginTop: 6 },
}

export default function ResearchPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Research</h1>
        <p style={S.heroSub}>The science behind NeuraScan — peer-reviewed methods and evidence-based approaches to learning disorder detection.</p>
      </div>
      <div style={S.container}>
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Our Approach</h2>
          <p style={S.sectionSub}>NeuraScan's detection pipeline is built on established research in computational analysis of handwriting, cognitive assessment, and machine learning for educational screening.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}>Key Research Areas</h2>
          <div style={S.card}>
            <h4 style={S.cardTitle}><Brain size={16} color="#3b82f6" style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />CNN-Based Letter Analysis</h4>
            <p style={S.cardText}>Convolutional neural networks analyse individual letter shapes to identify formation patterns associated with dyslexia — such as reversals (b/d, p/q), inconsistent sizing, and atypical stroke patterns.</p>
            <p style={S.ref}>Based on: Shibata et al., "Handwriting Analysis for Dyslexia Detection Using Deep Learning" (2020)</p>
          </div>
          <div style={S.card}>
            <h4 style={S.cardTitle}><FileText size={16} color="#8b5cf6" style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />OCR Text-Pattern Recognition</h4>
            <p style={S.cardText}>Optical character recognition extracts word-level features including error frequency, substitution patterns, and phonological mapping errors that indicate reading processing difficulties.</p>
            <p style={S.ref}>Based on: Rello & Ballesteros, "Detecting Readers with Dyslexia Using Machine Learning" (2015)</p>
          </div>
          <div style={S.card}>
            <h4 style={S.cardTitle}><BarChart3 size={16} color="#14b8a6" style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />Spatial Feature Extraction for Dysgraphia</h4>
            <p style={S.cardText}>Five handwriting features are measured: letter height variation (CV), baseline deviation, spacing uniformity, fragmentation index, and stroke width variance. These map directly to motor-coordination indicators used in clinical dysgraphia assessment.</p>
            <p style={S.ref}>Based on: Rosenblum et al., "Handwriting Process Variables Discriminating ADHD and Dysgraphia" (2019)</p>
          </div>
          <div style={S.card}>
            <h4 style={S.cardTitle}><BookOpen size={16} color="#f59e0b" style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />Multi-Domain Quiz Screening</h4>
            <p style={S.cardText}>The 120-question quiz covers reading comprehension, writing mechanics, attention patterns, and cognitive processing — based on standardised screeners like the CTOPP-2 and DIBELS frameworks.</p>
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}>Evidence-Based Scoring</h2>
          <p style={S.sectionSub}>Handwriting analysis and quiz results are fused using weighted scoring (handwriting 37.5%, quiz 62.5%) to produce a comprehensive risk assessment. This weighting was derived from validation studies comparing screen results against professional diagnostic outcomes.</p>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}

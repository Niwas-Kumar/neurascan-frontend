import React from 'react';
import { BookOpen, PenTool, ClipboardList, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

/* ── Section colour mapping ─────────────────────────────────── */
const SECTION_META = {
  '📖': { icon: BookOpen,      color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', label: 'Reading & Letter Recognition' },
  '✍️':  { icon: PenTool,       color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', label: 'Handwriting & Motor Skills' },
  '📋': { icon: ClipboardList, color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)', label: 'What This Means' },
};

/* ── Decide which status icon to show for score mentions ──── */
function scoreIcon(text) {
  // Try to pull a percentage from the first sentence-like fragment
  const m = text.match(/score:\s*(\d+)%/i);
  if (!m) return null;
  const v = parseInt(m[1], 10);
  if (v >= 60) return <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />;
  if (v >= 30) return <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />;
  return <CheckCircle size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />;
}

/* ── Render a single paragraph, handling bullet lists ──────── */
function Paragraph({ text, color, fontSize }) {
  // If the paragraph contains bullet lines, split them out.
  const lines = text.split('\n');
  const intro = [];
  const bullets = [];
  let inBullets = false;
  lines.forEach(l => {
    if (l.trim().startsWith('•')) { inBullets = true; bullets.push(l.trim().slice(1).trim()); }
    else if (inBullets) { bullets.push(l.trim()); }
    else { intro.push(l); }
  });

  return (
    <>
      {intro.length > 0 && (
        <p style={{ margin: 0, fontSize, color, lineHeight: 1.7 }}>
          {intro.join(' ')}
        </p>
      )}
      {bullets.length > 0 && (
        <ul style={{ margin: '6px 0 0 0', paddingLeft: 18, listStyle: 'none' }}>
          {bullets.map((b, i) => (
            <li key={i} style={{
              fontSize,
              color,
              lineHeight: 1.8,
              position: 'relative',
              paddingLeft: 14,
            }}>
              <span style={{ position: 'absolute', left: 0, color: '#14b8a6', fontWeight: 700 }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* ── Main exported component ───────────────────────────────── */
export default function AiCommentary({ text, fontSize = 14 }) {
  if (!text) return null;

  // Split raw text on double-newlines into paragraphs
  const paragraphs = text.split('\n\n').filter(Boolean);

  // Group into sections: each section starts with an emoji header line
  const sections = [];
  let current = null;

  paragraphs.forEach(p => {
    const trimmed = p.trim();
    // Check if this paragraph is a section header (starts with known emoji)
    const matchedKey = Object.keys(SECTION_META).find(emoji => trimmed.startsWith(emoji));
    if (matchedKey) {
      current = { meta: SECTION_META[matchedKey], content: [] };
      sections.push(current);
    } else if (current) {
      current.content.push(trimmed);
    } else {
      // No header yet — treat as a standalone paragraph
      sections.push({ meta: null, content: [trimmed] });
    }
  });

  // If nothing could be parsed (old-format text), just render plain paragraphs
  if (sections.length === 0 || sections.every(s => !s.meta)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ fontSize, color: '#475569', lineHeight: 1.7, margin: 0 }}>
            {para}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sections.map((sec, i) => {
        if (!sec.meta) {
          // Standalone paragraph without a section header
          return (
            <p key={i} style={{ fontSize, color: '#475569', lineHeight: 1.7, margin: 0 }}>
              {sec.content.join(' ')}
            </p>
          );
        }

        const { icon: Icon, color, bg, border, label } = sec.meta;
        const statusEl = sec.content.length > 0 ? scoreIcon(sec.content[0]) : null;

        return (
          <div key={i} style={{
            background: bg,
            border: `1px solid ${border}`,
            borderLeft: `4px solid ${color}`,
            borderRadius: 10,
            padding: '14px 16px',
          }}>
            {/* Section header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: sec.content.length > 0 ? 10 : 0,
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} color={color} />
              </div>
              <span style={{
                fontSize: fontSize + 1,
                fontWeight: 700,
                color,
                flex: 1,
              }}>
                {label}
              </span>
              {statusEl}
            </div>

            {/* Section content */}
            {sec.content.map((para, j) => (
              <Paragraph key={j} text={para} color="#334155" fontSize={fontSize} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

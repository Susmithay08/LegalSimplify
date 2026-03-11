import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/index.js'
import {
  AlertTriangle, Shield, CheckCircle, RotateCcw, Scale,
  ChevronDown, ChevronUp, Eye, FileText, Zap, ArrowRight
} from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────
const SAMPLE = `TERMS OF SERVICE — EXAMPLE APP
By using this service you grant us a worldwide, royalty-free, sublicensable, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your content. We may share your data with third-party advertising partners. We reserve the right to terminate your account at any time without notice or reason. You waive your right to participate in class action lawsuits. All disputes must be resolved through binding arbitration in Delaware. We may change these terms at any time and your continued use constitutes acceptance. We collect your location data, browsing history, contacts, and device information. You agree to indemnify us against any claims arising from your use of the service.`

function verdictColor(v = '') {
  if (v.includes('Avoid')) return 'var(--red)'
  if (v.includes('caution') || v.includes('carefully')) return 'var(--amber)'
  return 'var(--green)'
}
function verdictBg(v = '') {
  if (v.includes('Avoid')) return 'var(--red-bg)'
  if (v.includes('caution') || v.includes('carefully')) return 'var(--amber-bg)'
  return 'var(--green-bg)'
}
function VerdictIcon({ v = '', size = 20 }) {
  if (v.includes('Avoid')) return <AlertTriangle size={size} color="var(--red)" />
  if (v.includes('caution') || v.includes('carefully')) return <AlertTriangle size={size} color="var(--amber)" />
  return <Shield size={size} color="var(--green)" />
}
function severityColor(s) {
  if (s === 'high') return 'var(--red)'
  if (s === 'medium') return 'var(--amber)'
  return 'var(--green)'
}

// ── ScoreRing ─────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 44, circ = 2 * Math.PI * r
  const color = score >= 70 ? 'var(--red)' : score >= 40 ? 'var(--amber)' : 'var(--green)'
  const label = score >= 70 ? 'HIGH RISK' : score >= 40 ? 'CAUTION' : 'LOOKS OK'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <svg width={108} height={108} viewBox="0 0 108 108">
        <circle cx={54} cy={54} r={r} fill="none" stroke="var(--border2)" strokeWidth={6} />
        <motion.circle cx={54} cy={54} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '54px 54px' }} />
        <text x={54} y={50} textAnchor="middle" fill={color}
          style={{ fontSize: 22, fontFamily: 'Fraunces,serif', fontWeight: 900 }}>{score}</text>
        <text x={54} y={66} textAnchor="middle" fill="var(--ink3)"
          style={{ fontSize: 9, fontFamily: 'JetBrains Mono,monospace' }}>/100</text>
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color, letterSpacing: '0.1em' }}>{label}</span>
    </div>
  )
}

// ── SketchyClause ─────────────────────────────────────────────────────────────
function SketchyClause({ clause, index }) {
  const [open, setOpen] = useState(false)
  const sc = severityColor(clause.severity)
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      style={{ border: `1px solid var(--border2)`, borderRadius: 10, overflow: 'hidden', background: 'var(--card)' }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{clause.title}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: sc, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 8 }}>{clause.severity}</span>
        {open ? <ChevronUp size={14} color="var(--ink3)" /> : <ChevronDown size={14} color="var(--ink3)" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--bg3)', borderRadius: 7, padding: '10px 14px', marginBottom: 10, borderLeft: `3px solid var(--border2)` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 5, letterSpacing: '0.1em' }}>ORIGINAL CLAUSE</div>
                <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, fontStyle: 'italic' }}>"{clause.quote}"</p>
              </div>
              <div style={{ background: `${sc}15`, borderRadius: 7, padding: '10px 14px', marginBottom: 10, borderLeft: `3px solid ${sc}` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: sc, marginBottom: 5, letterSpacing: '0.1em' }}>WHAT IT ACTUALLY MEANS</div>
                <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>{clause.plain}</p>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>
                <span style={{ color: sc, fontWeight: 600 }}>Why this matters: </span>{clause.why_sketchy}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────────
function Results({ data }) {
  const { reset } = useStore()
  const vc = verdictColor(data.verdict)
  const vbg = verdictBg(data.verdict)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 80px' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingTop: 32 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.12em', marginBottom: 4 }}>{data.document_type?.toUpperCase()}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: 'var(--ink)' }}>{data.title}</h2>
        </div>
        <button onClick={reset}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 8, padding: '9px 14px', fontSize: 12, color: 'var(--ink2)', cursor: 'pointer' }}>
          <RotateCcw size={12} /> Analyze another
        </button>
      </div>

      {/* Verdict hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: vbg, border: `1px solid ${vc}40`, borderRadius: 16, padding: '28px 32px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 28 }}>
        <ScoreRing score={data.risk_score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <VerdictIcon v={data.verdict} size={18} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: vc, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
              {data.verdict}
            </span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7, marginBottom: 10 }}>{data.plain_summary}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', fontStyle: 'italic' }}>{data.verdict_reason}</p>
        </div>
      </motion.div>

      {/* TL;DR */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 12, padding: '14px 22px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.1em', paddingTop: 3, flexShrink: 0 }}>TL;DR</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic' }}>"{data.one_liner}"</p>
      </motion.div>

      {/* Red flags */}
      {data.red_flags?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'var(--red-bg)', border: '1px solid rgba(232,69,60,0.25)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={15} color="var(--red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.1em' }}>RED FLAGS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.red_flags.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--red)', fontSize: 12, marginTop: 2, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* You agreed to + Your rights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FileText size={14} color="var(--ink3)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.1em' }}>YOU AGREED TO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {data.what_you_agree_to?.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink3)', marginTop: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <CheckCircle size={14} color="var(--green)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em' }}>YOUR RIGHTS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {data.your_rights?.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <CheckCircle size={10} color="var(--green)" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sketchy clauses */}
      {data.sketchy_clauses?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Eye size={15} color="var(--amber)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.1em' }}>SKETCHY CLAUSES — CLICK TO EXPAND</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 'auto' }}>{data.sketchy_clauses.length} found</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.sketchy_clauses.map((c, i) => (
              <SketchyClause key={i} clause={c} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { result } = useStore()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--red) 0%, var(--amber) 50%, transparent 100%)' }} />
      <nav style={{ padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scale size={20} color="var(--red)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18 }}>LegalSimplify</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.12em' }}></div>
      </nav>
      {result ? <Results data={result} /> : <HeroInner />}
    </div>
  )
}

function HeroInner() {
  const { analyze, loading, error } = useStore()
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ minHeight: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 720, width: '100%' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(232,69,60,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 28 }}>
            <Zap size={10} fill="var(--red)" /> AI LEGAL ANALYST
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,7vw,86px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Know what<br />
            <span style={{ color: 'var(--red)', fontStyle: 'italic' }}>you're signing.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Paste any Terms of Service, Privacy Policy, or contract. Get a plain-English breakdown, every sketchy clause exposed, and a risk score in seconds.
          </p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'var(--card)', borderRadius: 16, border: `1px solid ${focused ? 'rgba(232,69,60,0.4)' : 'var(--border2)'}`, padding: 24, maxWidth: 680, margin: '0 auto', transition: 'border-color 0.2s', boxShadow: focused ? '0 0 0 3px rgba(232,69,60,0.08)' : 'none' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.1em' }}>PASTE LEGAL TEXT</label>
              <button onClick={() => setText(SAMPLE)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', background: 'none', border: 'none', letterSpacing: '0.05em', textDecoration: 'underline', cursor: 'pointer' }}>
                load sample
              </button>
            </div>

            <textarea value={text} onChange={e => setText(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder="Paste Terms of Service, Privacy Policy, contract, EULA, or any legal document here..."
              rows={9}
              style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: 'var(--ink2)', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>{text.length.toLocaleString()} chars</span>
              <button onClick={() => analyze(text)} disabled={loading || text.trim().length < 100}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: text.trim().length >= 100 ? 'var(--red)' : 'var(--bg3)', color: text.trim().length >= 100 ? '#fff' : 'var(--ink3)', border: 'none', borderRadius: 9, padding: '12px 22px', fontSize: 13, fontWeight: 600, opacity: loading ? 0.7 : 1, transition: 'all 0.15s', cursor: 'pointer' }}>
                {loading
                  ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}><Zap size={14} /></motion.div> Analyzing...</>
                  : <>Analyze Document <ArrowRight size={14} /></>}
              </button>
            </div>

            {error && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 10, fontFamily: 'var(--font-mono)' }}>⚠ {error}</p>}
          </motion.div>
        </motion.div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, flexWrap: 'wrap' }}>
          {[['Risk Score', 'var(--red)'], ['Plain English', 'var(--amber)'], ['Sketchy Clauses', 'var(--red)'], ['Your Rights', 'var(--green)'], ['One-line TL;DR', 'var(--ink3)']].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.06em' }}>{label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
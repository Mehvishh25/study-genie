'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  FileText, CreditCard, Brain, Camera, BookOpen, Mic,
  ArrowRight, ChevronRight, Star, Users, Zap, Shield,
  CheckCircle, Play, Sparkles, GraduationCap, TrendingUp,
  MessageSquare, Upload, BarChart2,
  Circle,
  CircleAlertIcon
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';

const features = [
  {
    icon: FileText,
    title: 'Worksheet Generator',
    desc: 'Create curriculum-aligned worksheets instantly. Set grade, subject, difficulty. AI builds the perfect material.',
    tag: 'AI Generated',
  },
  {
    icon: CreditCard,
    title: 'Flashcard Generator',
    desc: 'Transform lecture notes into interactive flashcards. Smart card-flip animations for active recall learning.',
    tag: 'Study Tool',
  },
  {
    icon: Brain,
    title: 'Quiz Generator',
    desc: 'Adaptive MCQ quizzes generated from any topic. Instant grading with detailed answer explanations.',
    tag: 'Assessment',
  },
  {
    icon: Camera,
    title: 'Face Attendance',
    desc: 'Touchless attendance powered by facial recognition. Real-time detection, CSV export, and registration.',
    tag: 'AI Vision',
  },
  {
    icon: BookOpen,
    title: 'RAG System',
    desc: 'Upload PDFs and chat with them. Retrieval-augmented generation surfaces precise answers with citations.',
    tag: 'Document AI',
  },
  {
    icon: Mic,
    title: 'Lecture Intelligence',
    desc: 'Upload lecture audio. Get transcripts, summaries, key points, and interactive Q&A — instantly.',
    tag: 'Audio AI',
  },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up in seconds. No credit card required.' },
  { num: '02', title: 'Choose a Tool', desc: 'Pick from 6 powerful AI-powered education tools.' },
  { num: '03', title: 'Input Your Content', desc: 'Upload files, paste text, or describe your topic.' },
  { num: '04', title: 'Get Results', desc: 'AI delivers polished, accurate results in moments.' },
];

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Senior Educator, IIT Delhi',
    text: 'Study Genie has completely transformed how I prepare teaching material. What used to take hours now takes minutes.',
    rating: 5,
  },
  {
    name: 'Ahmed Al-Rashidi',
    role: 'University Professor',
    text: 'The RAG system is incredible. My students can now query any research paper directly. Revolutionary.',
    rating: 5,
  },
  {
    name: 'Fatima Malik',
    role: 'High School Teacher',
    text: 'Face attendance alone saves me 15 minutes every class. The worksheet generator is icing on the cake.',
    rating: 5,
  },
];

const stats = [
  { value: '50K+', label: 'Students Served' },
  { value: '1.2M', label: 'Worksheets Generated' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '4.9/5', label: 'User Rating' },
];

// ----------------------------------------------------------------
// Animated floating orb
// ----------------------------------------------------------------
function FloatingOrb({ x, y, size, delay = 0, opacity = 0.06 }: {
  x: string; y: string; size: number; delay?: number; opacity?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity, scale: 1, y: [0, -20, 0] }}
      transition={{
        opacity: { delay, duration: 1 },
        scale: { delay, duration: 1 },
        y: { delay, duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,200,200,0.15) 0%, transparent 70%)',
        filter: `blur(${size * 0.3}px)`,
        pointerEvents: 'none',
      }}
    />
  );
}

// ----------------------------------------------------------------
// Animated grid / noise background
// ----------------------------------------------------------------
function HeroBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(128,128,128,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.6,
        }}
      />
      {/* Large ambient blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          background: 'radial-gradient(ellipse, rgba(150,150,150,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          background: 'radial-gradient(ellipse, rgba(120,120,120,0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Floating orbs */}
      <FloatingOrb x="15%" y="20%" size={180} delay={0} opacity={0.08} />
      <FloatingOrb x="70%" y="10%" size={120} delay={0.5} opacity={0.06} />
      <FloatingOrb x="80%" y="60%" size={200} delay={1} opacity={0.05} />
      <FloatingOrb x="10%" y="70%" size={140} delay={1.5} opacity={0.07} />
      <FloatingOrb x="50%" y="40%" size={80} delay={2} opacity={0.04} />
    </div>
  );
}

// ----------------------------------------------------------------
// Dashboard mockup
// ----------------------------------------------------------------
function DashboardMockup() {
  const items = [
    { label: 'Worksheet', color: '#e0e0e0' },
    { label: 'Flashcards', color: '#cccccc' },
    { label: 'Quiz', color: '#d4d4d4' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: 480,
        }}
      >
        {/* Titlebar */}
        <div
          style={{
            background: 'var(--bg-tertiary)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'block' }} />
          <span style={{
            flex: 1, textAlign: 'center', fontSize: '0.75rem',
            color: 'var(--text-muted)', fontFamily: 'var(--font-inter)'
          }}>
            study-genie.ai/dashboard
          </span>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', height: 300 }}>
          {/* Sidebar mini */}
          <div style={{
            width: 180,
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border-color)',
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 24, height: 24, background: 'var(--text-primary)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={12} color="var(--bg-primary)" />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Study Genie</span>
            </div>
            {['Dashboard', 'Worksheet', 'Flashcards', 'Quiz', 'Face AI', 'RAG', 'Lecture'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  color: i === 1 ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  background: i === 1 ? 'var(--text-primary)' : 'transparent',
                  fontWeight: i === 1 ? 600 : 400,
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>

          {/* Main area */}
          <div style={{ flex: 1, padding: '1rem', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Worksheet Generator
            </div>
            {/* Input area */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '0.5rem 0.75rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}>
              Grade 10 Mathematics · Algebra
            </div>
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '0.5rem 0.75rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
            }}>
              Topic: Quadratic Equations · 10 Questions
            </div>
            {/* Output */}
            <motion.div
              initial={{ scaleY: 0, transformOrigin: 'top' }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 8,
                padding: '0.625rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              {['Q1. Solve: x² - 5x + 6 = 0', 'Q2. Factor: x² + 7x + 12', 'Q3. Find roots of 2x² - x - 1 = 0'].map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + i * 0.15 }}
                  style={{
                    fontSize: '0.655rem',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem 0',
                    borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none',
                  }}
                >
                  {q}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Feature Card
// ----------------------------------------------------------------
function FeatureCard({ icon: Icon, title, desc, tag, index }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-color-hover)' : 'var(--border-color)'}`,
        borderRadius: 16,
        padding: '1.75rem',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 0% 0%, rgba(128,128,128,0.04) 0%, transparent 60%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: hovered ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
            }}
          >
            <Icon size={20} color={hovered ? 'var(--bg-primary)' : 'var(--text-primary)'} strokeWidth={1.8} />
          </div>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-tertiary)',
              padding: '0.25rem 0.6rem',
              borderRadius: 999,
              border: '1px solid var(--border-color)',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {tag}
          </span>
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {desc}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '1.25rem',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 500,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          Try it <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      <Navbar />
      <section
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <HeroBackground />

        <div className="container-lg" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              alignItems: 'center',
              padding: '1.5rem 0 3rem',
            }}
            className="hero-grid"
          >
            {/* Left */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 999,
                  padding: '0.375rem 0.875rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                }}
              >
                <CircleAlertIcon size={12} strokeWidth={2} />
                AI-Powered Education Platform
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                  color: 'var(--text-primary)',
                }}
              >
                Unlock the future<br />
                <span style={{ color: 'var(--text-secondary)' }}>of education</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                  maxWidth: 440,
                }}
              >
                Study Genie brings together 6 powerful AI tools, from worksheet generation to face attendance, all in one elegant platform designed for educators and students.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2rem' }}
              >
                <a href="/dashboard" className="btn-primary" style={{ fontSize: '0.9rem' }}>
                  Start for Free <ArrowRight size={16} />
                </a>
                <a href="#features" className="btn-secondary" style={{ fontSize: '0.9rem' }}>
                  <Play size={16} /> See Features
                </a>
              </motion.div>

              {/* Trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="var(--text-primary)" color="var(--text-primary)" />
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Trusted by <strong style={{ color: 'var(--text-secondary)' }}>6700+</strong> educators & students
                </span>
              </motion.div>
            </div>

            {/* Right — Dashboard Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <DashboardMockup />

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: -10 }}
                transition={{ delay: 1, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '0.75rem 1rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  zIndex: 20,
                }}
              >
                <CheckCircle size={16} color="#4ade80" />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Worksheet Generated!</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 10 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  bottom: -15,
                  left: -20,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '0.75rem 1rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  zIndex: 20,
                }}
              >
                <Users size={16} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>+1,284 active today</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS STRIP
      ============================================================ */}
      <section style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '3rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container-lg">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'var(--font-jakarta)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
      ============================================================ */}
      <section id="features" className="section">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              marginBottom: '0.75rem', display: 'block'
            }}>
              Platform Features
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Everything you need to teach smarter
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
              Six powerful AI tools, one unified platform. Built for the modern classroom.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section id="how-it-works" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }} className="section">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>
              How It Works
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Up and running in minutes
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute',
              top: 28,
              left: '12%',
              right: '12%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--border-color-hover), var(--border-color-hover), transparent)',
              zIndex: 0,
            }} />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT PREVIEW
      ============================================================ */}
      <section id="pricing" className="section">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>
              Product Preview
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Experience the dashboard
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              A clean, focused workspace for AI-powered learning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Browser chrome */}
            <div style={{
              background: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-color)',
              padding: '0.875rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{
                flex: 1, background: 'var(--bg-primary)', borderRadius: 6,
                padding: '0.3rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}>
                app.study-genie.ai/dashboard
              </div>
            </div>

            {/* Dashboard layout preview */}
            <div style={{ display: 'flex', height: 420 }}>
              {/* Sidebar */}
              <div style={{
                width: 200,
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--border-color)',
                padding: '1rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={14} />Study Genie
                </div>
                {[
                  { label: 'Dashboard', icon: BarChart2 },
                  { label: 'Worksheet', icon: FileText },
                  { label: 'Flashcards', icon: CreditCard },
                  { label: 'Quiz', icon: Brain },
                  { label: 'Face Attendance', icon: Camera },
                  { label: 'RAG System', icon: BookOpen },
                  { label: 'Lecture AI', icon: Mic },
                ].map((item, i) => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.45rem 0.75rem', borderRadius: 8, fontSize: '0.75rem',
                    background: i === 1 ? 'var(--text-primary)' : 'transparent',
                    color: i === 1 ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontWeight: i === 1 ? 600 : 400,
                  }}>
                    <item.icon size={13} />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Content area */}
              <div style={{ flex: 1, padding: '1.5rem', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Worksheet Generator</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Create AI-powered worksheets</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Grade 10
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Mathematics
                    </div>
                  </div>
                </div>

                {/* Chat-like output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '0.875rem', fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>📝 Generated Worksheet: Quadratic Equations</strong>
                    Q1. Solve for x: x² − 5x + 6 = 0<br />
                    Q2. A rocket is launched, its height h = −16t² + 64t. Find time at max height.<br />
                    Q3. Factor completely: 2x² + 7x + 3
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={12} /> Download PDF
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      Regenerate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
      ============================================================ */}
      <section className="section">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 28,
              padding: 'clamp(3rem, 6vw, 5rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(128,128,128,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <GraduationCap
                size={48}
                color="var(--text-muted)"
                style={{ margin: '0 auto 1.5rem' }}
              />
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                lineHeight: 1.1,
              }}>
                Start Using Study Genie Today
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
                Join thousands of educators who are already teaching smarter with AI.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                  Get Started Free <ArrowRight size={18} />
                </a>
                <a href="#features" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                  View All Features
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0 2rem', background: 'var(--bg-secondary)' }}>
        <div className="container-lg">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.55rem' }}>Study Genie</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                AI-powered education platform for the modern classroom.
              </p>
            </div>
            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'How It Works', 'Pricing', 'Dashboard'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>
                  {col.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              © 2025 Study Genie. All rights reserved.
            </span>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          footer div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
          footer div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

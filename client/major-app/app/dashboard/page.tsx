'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FileText, CreditCard, Brain, Camera, BookOpen, Mic,
    ArrowUpRight, TrendingUp, Users, Zap, Clock
} from 'lucide-react';

const tools = [
    { label: 'Worksheet Generator', icon: FileText, href: '/dashboard/worksheet', desc: 'Generate curriculum-aligned worksheets', count: '2.4k worksheets' },
    { label: 'Flashcard Generator', icon: CreditCard, href: '/dashboard/flashcards', desc: 'Create interactive study flashcards', count: '8.1k cards' },
    { label: 'Quiz Generator', icon: Brain, href: '/dashboard/quiz', desc: 'Build adaptive MCQ quizzes', count: '1.2k quizzes' },
    { label: 'Face Attendance', icon: Camera, href: '/dashboard/face-attendance', desc: 'Facial recognition attendance system', count: '320 sessions' },
    { label: 'RAG System', icon: BookOpen, href: '/dashboard/rag', desc: 'Chat with your uploaded PDFs', count: '540 docs' },
    { label: 'Lecture Intelligence', icon: Mic, href: '/dashboard/lecture-intelligence', desc: 'Summarize & analyze lectures', count: '180 lectures' },
];

import { useState, useEffect } from 'react';
import { getActivities, formatTime, Activity } from '@/app/lib/activity';

const iconMap = {
    worksheet: FileText,
    flashcards: CreditCard,
    quiz: Brain,
    attendance: Camera,
    rag: BookOpen,
    lecture: Mic,
};

export default function DashboardHome() {
    const [activities, setActivities] = useState<Activity[]>([]);

    const refreshActivities = () => {
        setActivities(getActivities());
    };

    useEffect(() => {
        refreshActivities();

        window.addEventListener('activity_updated', refreshActivities);
        const interval = setInterval(() => setActivities(prev => [...prev]), 60000); // Trigger re-render to update time

        return () => {
            window.removeEventListener('activity_updated', refreshActivities);
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            {/* Welcome banner */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="welcome-banner"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 16,
                    padding: '1.25rem 1.75rem',
                    marginBottom: '1.5rem',
                    gap: '0.75rem',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div style={{
                    position: 'absolute', top: -40, right: -40, width: 200, height: 200,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,128,128,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 500 }}>
                        Good afternoon 👋
                    </p>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                        Welcome to Study Genie
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                        All 6 AI tools are active and ready to use.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', flexShrink: 0 }}>
                    {[
                        { value: '6', label: 'Active Tools', icon: Zap },
                        { value: '∞', label: 'Generations', icon: TrendingUp },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-jakarta, sans-serif)' }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Tools Grid */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                    AI Tools
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {tools.map((tool, i) => (
                        <motion.div
                            key={tool.href}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i, duration: 0.4 }}
                        >
                            <Link
                                href={tool.href}
                                style={{
                                    display: 'block',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 14,
                                    padding: '1rem 1.25rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color-hover)';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <div style={{
                                        width: 36, height: 36, background: 'var(--bg-tertiary)',
                                        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <tool.icon size={16} color="var(--text-primary)" strokeWidth={1.8} />
                                    </div>
                                    <ArrowUpRight size={14} color="var(--text-muted)" />
                                </div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                                    {tool.label}
                                </div>
                                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    {tool.desc}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {tool.count}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
            >
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                    Recent Activity
                </h3>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 14,
                    overflow: 'hidden',
                }}>
                    {activities.length > 0 ? (
                        activities.map((item, i) => {
                            const Icon = iconMap[item.type] || Clock;
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '1rem 1.25rem',
                                        borderBottom: i < activities.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, background: 'var(--bg-tertiary)', borderRadius: 8,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <Icon size={14} color="var(--text-secondary)" strokeWidth={1.8} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.action}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.detail}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-muted)', fontSize: '0.7rem', flexShrink: 0 }}>
                                        <Clock size={10} />
                                        {formatTime(item.timestamp)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            No recent activity found.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}


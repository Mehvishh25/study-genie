'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Loader2, Shuffle, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { logActivity } from '@/app/lib/activity';

interface Flashcard {
    Question: string;
    Answer: string;
}

export default function FlashcardsPage() {
    const [text, setText] = useState('');
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [error, setError] = useState('');

    const generate = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setCards([]);
        setError('');
        setCurrentIdx(0);
        setFlipped(false);
        try {
            const res = await fetch('http://localhost:5000/flashcards/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setCards(data);
                logActivity('flashcards', 'Flashcards generated', text.slice(0, 30) + '...');
            } else {
                setError(data.error || 'Invalid response format');
            }
        } catch {
            setError('Error generating flashcards. Please ensure the server is running.');
        }
        setLoading(false);
    };

    const shuffle = () => {
        setCards(c => [...c].sort(() => Math.random() - 0.5));
        setCurrentIdx(0);
        setFlipped(false);
    };

    const prev = () => { setCurrentIdx(i => Math.max(0, i - 1)); setFlipped(false); };
    const next = () => { setCurrentIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); };

    return (
        <div>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--bg-tertiary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={18} color="var(--text-primary)" strokeWidth={1.8} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Flashcard Generator</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Paste lecture notes or topic text below. AI will generate interactive flashcards for active recall.
                </p>
            </motion.div>

            <div className="feature-grid">
                <motion.div
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}
                >
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Input</h3>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Paste lecture notes, textbook content, or topic summary here..."
                        rows={10}
                        style={{
                            width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                            borderRadius: 10, color: 'var(--text-primary)', padding: '0.75rem 1rem',
                            fontSize: '0.875rem', resize: 'vertical', lineHeight: 1.7, outline: 'none', fontFamily: 'inherit',
                        }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                    />
                    <button
                        onClick={generate}
                        disabled={loading || !text.trim()}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', opacity: loading || !text.trim() ? 0.7 : 1 }}
                    >
                        {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                            : <><Sparkles size={16} /> Generate Flashcards</>}
                    </button>
                    {cards.length > 0 && (
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={shuffle}
                                style={{
                                    flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                    borderRadius: 10, padding: '0.6rem', cursor: 'pointer', color: 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 500,
                                }}
                            >
                                <Shuffle size={14} /> Shuffle
                            </button>
                            <button
                                onClick={() => { setCards([]); setText(''); setError(''); }}
                                style={{
                                    flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                    borderRadius: 10, padding: '0.6rem', cursor: 'pointer', color: 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 500,
                                }}
                            >
                                <RotateCcw size={14} /> Reset
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Flashcard display */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    {!loading && cards.length === 0 && !error && (
                        <div style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
                            height: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        }}>
                            <div style={{ width: 56, height: 56, background: 'var(--bg-tertiary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CreditCard size={24} color="var(--text-muted)" strokeWidth={1.5} />
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', maxWidth: 240 }}>
                                Paste your notes and generate flashcards to start studying.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
                            height: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                        }}>
                            <div style={{ width: 48, height: 48, border: '2px solid var(--border-color)', borderTop: '2px solid var(--text-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Creating flashcards...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
                            padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem',
                        }}>
                            {error}
                        </div>
                    )}

                    {cards.length > 0 && (
                        <div>
                            {/* Progress */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    Card {currentIdx + 1} of {cards.length}
                                </span>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    {cards.map((_, i) => (
                                        <div key={i} style={{
                                            width: i === currentIdx ? 20 : 6, height: 6, borderRadius: 999,
                                            background: i === currentIdx ? 'var(--text-primary)' : 'var(--border-color)',
                                            transition: 'all 0.3s ease', cursor: 'pointer',
                                        }} onClick={() => { setCurrentIdx(i); setFlipped(false); }} />
                                    ))}
                                </div>
                            </div>

                            {/* Card */}
                            <div
                                onClick={() => setFlipped(f => !f)}
                                style={{
                                    perspective: 1000,
                                    cursor: 'pointer',
                                    marginBottom: '1rem',
                                    height: 300,
                                    userSelect: 'none',
                                }}
                            >
                                <motion.div
                                    animate={{ rotateY: flipped ? 180 : 0 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
                                >
                                    {/* Front */}
                                    <div style={{
                                        position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)',
                                    }}>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 600 }}>
                                            Question
                                        </span>
                                        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                            {cards[currentIdx].Question}
                                        </p>
                                        <span style={{ position: 'absolute', bottom: 20, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Click to reveal answer
                                        </span>
                                    </div>
                                    {/* Back */}
                                    <div style={{
                                        position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                        background: 'var(--bg-secondary)', border: '1px solid var(--border-color-hover)', borderRadius: 20,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)',
                                    }}>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 600 }}>
                                            Answer
                                        </span>
                                        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                            {cards[currentIdx].Answer}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Navigation */}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                <button
                                    onClick={prev}
                                    disabled={currentIdx === 0}
                                    style={{
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12,
                                        padding: '0.75rem 1.5rem', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                                        color: currentIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                                        display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500,
                                    }}
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <button
                                    onClick={next}
                                    disabled={currentIdx === cards.length - 1}
                                    style={{
                                        background: currentIdx === cards.length - 1 ? 'var(--bg-card)' : 'var(--text-primary)',
                                        border: '1px solid var(--border-color)', borderRadius: 12,
                                        padding: '0.75rem 1.5rem', cursor: currentIdx === cards.length - 1 ? 'not-allowed' : 'pointer',
                                        color: currentIdx === cards.length - 1 ? 'var(--text-muted)' : 'var(--bg-primary)',
                                        display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500,
                                    }}
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
            <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

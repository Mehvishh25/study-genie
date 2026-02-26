'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, CheckCircle, XCircle, ChevronDown, Sparkles, RotateCcw } from 'lucide-react';
import { logActivity } from '@/app/lib/activity';

interface Question {
    question: string;
    options: Record<string, string>;
    answer: string;
}

export default function QuizPage() {
    const [form, setForm] = useState({ grade: '', subject: '', topic: '', difficulty: 'Medium', num_questions: 10, text_input: '' });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const generate = async () => {
        setLoading(true); setQuestions([]); setUserAnswers({}); setSubmitted(false); setError('');
        try {
            const res = await fetch('http://localhost:5000/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, num_questions: Number(form.num_questions) }),
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuestions(data);
                logActivity('quiz', 'Quiz created', `${form.subject} · ${form.topic}`);
            }
            else setError(data.error || 'Invalid response');
        } catch { setError('Server error. Please check the Flask server is running.'); }
        setLoading(false);
    };

    const score = submitted ? Object.entries(userAnswers).filter(([qi]) => userAnswers[+qi] === questions[+qi]?.answer).length : 0;
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

    const inputStyle: React.CSSProperties = {
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: 10, color: 'var(--text-primary)', padding: '0.65rem 0.875rem',
        fontSize: '0.875rem', outline: 'none', width: '100%', fontFamily: 'inherit',
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--bg-tertiary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={18} color="var(--text-primary)" strokeWidth={1.8} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Quiz Generator</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Generate adaptive MCQ quizzes, answer them, and get instant scored feedback.</p>
            </motion.div>

            <div className="feature-grid">
                <motion.div
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}
                >
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Configure</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {[
                            { name: 'grade', label: 'Grade', placeholder: 'e.g., Grade 10' },
                            { name: 'subject', label: 'Subject', placeholder: 'e.g., Biology' },
                            { name: 'topic', label: 'Topic', placeholder: 'e.g., Cell Division' },
                        ].map(f => (
                            <div key={f.name}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>{f.label}</label>
                                <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} placeholder={f.placeholder}
                                    style={inputStyle}
                                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        ))}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Difficulty</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="difficulty" value={form.difficulty} onChange={handleChange}
                                        style={{ ...inputStyle, appearance: 'none', paddingRight: '1.75rem', cursor: 'pointer' }}
                                        onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                                    >
                                        <option>Easy</option><option>Medium</option><option>Hard</option>
                                    </select>
                                    <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Questions</label>
                                <input name="num_questions" type="number" value={form.num_questions} onChange={handleChange} min={1} max={30}
                                    style={inputStyle}
                                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                                Reference Text <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                            </label>
                            <textarea name="text_input" value={form.text_input} onChange={handleChange}
                                placeholder="Optional reference..." rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        <button onClick={generate} disabled={loading} className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                                : <><Sparkles size={16} /> Generate Quiz</>}
                        </button>
                    </div>
                </motion.div>

                {/* Quiz area */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    {!loading && questions.length === 0 && !error && (
                        <div style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
                            height: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        }}>
                            <div style={{ width: 56, height: 56, background: 'var(--bg-tertiary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Brain size={24} color="var(--text-muted)" strokeWidth={1.5} />
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', maxWidth: 260 }}>
                                Configure the quiz settings and click Generate.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
                            height: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                        }}>
                            <div style={{ width: 48, height: 48, border: '2px solid var(--border-color)', borderTop: '2px solid var(--text-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Generating quiz questions...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    {questions.length > 0 && (
                        <div>
                            {submitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        background: pct >= 70 ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                                        border: `1px solid ${pct >= 70 ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                                        borderRadius: 14, padding: '1.25rem 1.5rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        marginBottom: '1.25rem',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                            Score: {score}/{questions.length} — {pct}%
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                            {pct >= 90 ? 'Excellent! 🎉' : pct >= 70 ? 'Good job! 👍' : 'Keep practicing 📚'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setUserAnswers({}); setSubmitted(false); }}
                                        style={{
                                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 10,
                                            padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-secondary)',
                                            fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem',
                                        }}
                                    >
                                        <RotateCcw size={13} /> Retry
                                    </button>
                                </motion.div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {questions.map((q, qi) => {
                                    const userAns = userAnswers[qi];
                                    const correct = q.answer;
                                    return (
                                        <motion.div
                                            key={qi}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: qi * 0.04 }}
                                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '1.25rem 1.5rem' }}
                                        >
                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.875rem', fontSize: '0.925rem', lineHeight: 1.5 }}>
                                                <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem', fontSize: '0.8rem' }}>Q{qi + 1}.</span>
                                                {q.question}
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {Object.entries(q.options).map(([key, val]) => {
                                                    const isSelected = userAns === key;
                                                    const isCorrect = submitted && key === correct;
                                                    const isWrong = submitted && isSelected && key !== correct;
                                                    return (
                                                        <button
                                                            key={key}
                                                            disabled={submitted}
                                                            onClick={() => setUserAnswers(prev => ({ ...prev, [qi]: key }))}
                                                            style={{
                                                                textAlign: 'left', padding: '0.6rem 0.875rem', borderRadius: 10,
                                                                border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.4)' : isWrong ? 'rgba(248,113,113,0.4)' : isSelected ? 'var(--text-muted)' : 'var(--border-color)'}`,
                                                                background: isCorrect ? 'rgba(74,222,128,0.07)' : isWrong ? 'rgba(248,113,113,0.07)' : isSelected ? 'var(--bg-tertiary)' : 'transparent',
                                                                cursor: submitted ? 'default' : 'pointer',
                                                                fontSize: '0.875rem', color: 'var(--text-secondary)',
                                                                display: 'flex', alignItems: 'center', gap: '0.625rem',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                        >
                                                            <span style={{
                                                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                                                border: `1.5px solid ${isCorrect ? 'rgba(74,222,128,0.6)' : isSelected ? 'var(--text-muted)' : 'var(--border-color)'}`,
                                                                background: isSelected && !submitted ? 'var(--text-primary)' : 'transparent',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '0.7rem', fontWeight: 700,
                                                                color: isSelected && !submitted ? 'var(--bg-primary)' : 'var(--text-muted)',
                                                            }}>
                                                                {key}
                                                            </span>
                                                            {val}
                                                            {isCorrect && <CheckCircle size={15} color="rgb(74,222,128)" style={{ marginLeft: 'auto' }} />}
                                                            {isWrong && <XCircle size={15} color="rgb(248,113,113)" style={{ marginLeft: 'auto' }} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {!submitted && (
                                <button
                                    onClick={() => setSubmitted(true)}
                                    className="btn-primary"
                                    style={{ marginTop: '1.5rem', justifyContent: 'center', width: '100%', fontSize: '0.95rem', padding: '0.875rem' }}
                                >
                                    Submit Quiz
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

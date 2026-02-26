'use client';

import { FileText, Download, RotateCcw, Loader2, ChevronDown, Sparkles } from 'lucide-react';
import { logActivity } from '@/app/lib/activity';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WorksheetPage() {
    const [form, setForm] = useState({
        grade: '',
        subject: '',
        topic: '',
        difficulty: 'Medium',
        num_questions: 10,
        question_types: 'MCQ, Short Answer',
        text_input: '',
    });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const generateWorksheet = async () => {
        setLoading(true);
        setResult('');
        try {
            const res = await fetch('http://localhost:5000/worksheet/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    num_questions: Number(form.num_questions),
                    question_types: form.question_types.split(',').map(q => q.trim()),
                }),
            });
            const data = await res.json();
            setResult(data.output);
            logActivity('worksheet', 'Worksheet generated', `${form.grade} · ${form.topic}`);
        } catch {
            setResult('Error generating worksheet. Please ensure the server is running.');
        }
        setLoading(false);
    };

    const inputStyle = {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        color: 'var(--text-primary)',
        padding: '0.7rem 1rem',
        width: '100%',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        fontFamily: 'inherit',
    };

    const labelStyle = {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '0.375rem',
        display: 'block',
    };

    const fieldStyle = { display: 'flex', flexDirection: 'column' as const };

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--bg-tertiary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} color="var(--text-primary)" strokeWidth={1.8} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: 'var(--text-primary)' }}>
                        Worksheet Generator
                    </h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Configure the parameters below. AI will generate a polished, curriculum-aligned worksheet.
                </p>
            </motion.div>

            <div className="feature-grid">
                {/* Left — Form panel */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 16,
                        padding: '1.5rem',
                    }}
                >
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Configuration
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Grade Level</label>
                            <input name="grade" value={form.grade} onChange={handleChange}
                                placeholder="e.g., Grade 10, Class 8"
                                style={inputStyle}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Subject</label>
                            <input name="subject" value={form.subject} onChange={handleChange}
                                placeholder="e.g., Mathematics, Physics"
                                style={inputStyle}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Topic</label>
                            <input name="topic" value={form.topic} onChange={handleChange}
                                placeholder="e.g., Quadratic Equations"
                                style={inputStyle}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Difficulty</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="difficulty" value={form.difficulty} onChange={handleChange}
                                        style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}
                                        onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Questions</label>
                                <input name="num_questions" type="number" value={form.num_questions} onChange={handleChange}
                                    min={1} max={50}
                                    style={inputStyle}
                                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Question Types</label>
                            <input name="question_types" value={form.question_types} onChange={handleChange}
                                placeholder="MCQ, Short Answer, True/False"
                                style={inputStyle}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Reference Text <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                            <textarea name="text_input" value={form.text_input} onChange={handleChange}
                                placeholder="Paste notes or chapter text here..."
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        <button
                            onClick={generateWorksheet}
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? (
                                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                            ) : (
                                <><Sparkles size={16} /> Generate Worksheet</>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Right — Output panel */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 16,
                        overflow: 'hidden',
                        minHeight: 500,
                    }}
                >
                    {/* Panel header */}
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Output
                        </span>
                        {result && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setResult('')}
                                    style={{
                                        background: 'none', border: '1px solid var(--border-color)', borderRadius: 8,
                                        padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
                                    }}
                                >
                                    <RotateCcw size={12} /> Clear
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem' }}
                                >
                                    <Download size={12} /> Download PDF
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '1.5rem', minHeight: 440 }}>
                        {loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 380, gap: '1rem' }}>
                                <div style={{ width: 48, height: 48, border: '2px solid var(--border-color)', borderTop: '2px solid var(--text-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>AI is generating your worksheet...</p>
                            </div>
                        )}
                        {!loading && !result && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 380, gap: '0.75rem', textAlign: 'center' }}>
                                <div style={{ width: 56, height: 56, background: 'var(--bg-tertiary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={24} color="var(--text-muted)" strokeWidth={1.5} />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 260 }}>
                                    Fill in the form and click "Generate Worksheet" to see results here.
                                </p>
                            </div>
                        )}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose"
                                style={{
                                    fontFamily: 'var(--font-jakarta, sans-serif)',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.8,
                                }}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {result}
                                </ReactMarkdown>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

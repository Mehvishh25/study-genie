'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Upload, Loader2, FileAudio, BookText, List, ChevronDown, ChevronUp } from 'lucide-react';
import { logActivity } from '@/app/lib/activity';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LectureIntelligencePage() {
    const [file, setFile] = useState<File | null>(null);
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    const extractKeyPoints = (text: string): string[] => {
        if (!text) return [];
        return text
            .split(/[.\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 40)
            .slice(0, 6);
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setTranscript('');
        setSummary('');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('http://localhost:5000/lecture/summarize', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Server error');
            const data = await res.json();
            setTranscript(data.transcript || '');
            setSummary(data.summary || '');
            logActivity('lecture', 'Lecture analyzed', file.name);
        } catch {
            setSummary('Error processing lecture. Please ensure the Flask server is running and try again.');
        }
        setLoading(false);
    };

    const keyPoints = extractKeyPoints(summary);

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--bg-tertiary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mic size={18} color="var(--text-primary)" strokeWidth={1.8} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Lecture Intelligence</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Upload a lecture audio file (.mp3). AI will transcribe it, generate a summary, and extract key takeaways.
                </p>
            </motion.div>

            {/* Upload card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}
            >
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                    Upload Lecture Audio
                </h3>

                <div
                    onClick={() => document.getElementById('lecture-file-input')?.click()}
                    style={{
                        border: `2px dashed ${file ? 'var(--text-muted)' : 'var(--border-color)'}`,
                        borderRadius: 14, padding: '2.5rem', textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.2s ease', background: 'var(--bg-secondary)',
                        marginBottom: '1.25rem',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--text-muted)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = file ? 'var(--text-muted)' : 'var(--border-color)'}
                >
                    <input
                        id="lecture-file-input"
                        type="file"
                        accept=".mp3,.wav,.m4a,.ogg"
                        onChange={e => e.target.files && e.target.files.length > 0 && setFile(e.target.files[0])}
                        style={{ display: 'none' }}
                    />
                    <div style={{ width: 48, height: 48, background: 'var(--bg-tertiary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <FileAudio size={22} color="var(--text-muted)" strokeWidth={1.5} />
                    </div>
                    {file ? (
                        <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{file.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Click to upload or drag & drop
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MP3, WAV, M4A, OGG supported</div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.875rem', opacity: !file || loading ? 0.7 : 1 }}
                >
                    {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing Lecture...</>
                        : <><Upload size={16} /> Upload & Analyze</>}
                </button>

                {loading && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                            {['Transcribing audio...', 'Analyzing content...', 'Building summary...'].map((step, i) => (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Loader2 size={11} style={{ animation: `spin ${0.8 + i * 0.2}s linear infinite` }} />
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Output area */}
            {(summary || transcript) && (
                <div className="intelligence-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <BookText size={16} color="var(--text-muted)" strokeWidth={1.8} />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Summary</h3>
                        </div>
                        <div className="prose">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {summary}
                            </ReactMarkdown>
                        </div>
                    </motion.div>

                    {/* Key Points */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <List size={16} color="var(--text-muted)" strokeWidth={1.8} />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Key Points</h3>
                        </div>
                        {keyPoints.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                {keyPoints.map((point, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        <span style={{
                                            width: 20, height: 20, background: 'var(--bg-tertiary)', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)',
                                            flexShrink: 0, marginTop: 1,
                                        }}>{i + 1}</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Key points extracted from summary above.</p>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Transcript (collapsible) */}
            {transcript && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ marginTop: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden' }}
                >
                    <button
                        onClick={() => setShowTranscript(s => !s)}
                        style={{
                            width: '100%', padding: '1.125rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            color: 'var(--text-primary)', fontFamily: 'inherit',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mic size={15} color="var(--text-muted)" />
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Transcript</span>
                        </div>
                        {showTranscript ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                    </button>
                    {showTranscript && (
                        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <div className="prose" style={{ marginTop: '1rem' }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {transcript}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {!transcript && !summary && !loading && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Upload a lecture audio file to see the AI-generated transcript, summary, and key points here.
                </div>
            )}

            <style jsx global>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 800px) {
                    .intelligence-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

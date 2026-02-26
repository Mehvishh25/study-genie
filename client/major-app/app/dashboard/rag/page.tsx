'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, Send, Loader2, FileText, X, MessageSquare } from 'lucide-react';
import { logActivity } from '@/app/lib/activity';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: { file: string; page: number; snippet: string }[];
}

export default function RagPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [question, setQuestion] = useState('');
    const [uploading, setUploading] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const uploadFiles = async (files: FileList) => {
        setUploading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append('files', files[i]);
        try {
            const res = await fetch('http://localhost:5000/rag/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.error) {
                setMessages(m => [...m, { role: 'assistant', content: `❌ Upload error: ${data.error}` }]);
            } else {
                const names = Array.from(files).map(f => f.name);
                setUploadedFiles(prev => [...prev, ...names]);
                setMessages(m => [...m, {
                    role: 'assistant',
                    content: `✅ Uploaded ${files.length} file(s): ${names.join(', ')}. You can now ask questions about ${files.length > 1 ? 'them' : 'it'}.`,
                }]);
                logActivity('rag', 'PDF uploaded', names.join(', '));
            }
        } catch {
            setMessages(m => [...m, { role: 'assistant', content: '❌ Upload failed. Please check the server.' }]);
        }
        setUploading(false);
    };

    const askQuestion = async () => {
        if (!question.trim()) return;
        const q = question.trim();
        setQuestion('');
        setMessages(m => [...m, { role: 'user', content: q }]);
        setThinking(true);
        try {
            const res = await fetch('http://localhost:5000/rag/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q }),
            });
            const data = await res.json();
            setMessages(m => [...m, {
                role: 'assistant',
                content: data.answer || data.error || 'No answer returned.',
                sources: data.sources,
            }]);
        } catch {
            setMessages(m => [...m, { role: 'assistant', content: 'Error reaching the server.' }]);
        }
        setThinking(false);
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askQuestion(); }
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--bg-tertiary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={18} color="var(--text-primary)" strokeWidth={1.8} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>RAG System</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Upload PDFs · Ask questions · Get cited answers</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="btn-primary"
                        style={{ fontSize: '0.875rem', opacity: uploading ? 0.7 : 1 }}
                    >
                        {uploading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</>
                            : <><Upload size={15} /> Upload PDF(s)</>}
                    </button>
                    <input type="file" accept="application/pdf" multiple ref={fileRef} style={{ display: 'none' }}
                        onChange={e => e.target.files && uploadFiles(e.target.files)} />
                </div>

                {/* Uploaded files chips */}
                {uploadedFiles.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.875rem' }}>
                        {uploadedFiles.map((f, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                borderRadius: 999, padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)',
                            }}>
                                <FileText size={11} /> {f}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Chat area */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
                    display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: 480, overflow: 'hidden',
                }}
            >
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                    {messages.length === 0 && (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textAlign: 'center' }}>
                            <div style={{ width: 56, height: 56, background: 'var(--bg-tertiary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={24} color="var(--text-muted)" strokeWidth={1.5} />
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 280, lineHeight: 1.6 }}>
                                Upload one or more PDFs above, then ask any question about their content.
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                                >
                                    <div
                                        className={msg.role === 'assistant' ? 'prose' : ''}
                                        style={{
                                            maxWidth: '75%', padding: '0.75rem 1.125rem', borderRadius: 14,
                                            background: msg.role === 'user' ? 'var(--text-primary)' : 'var(--bg-secondary)',
                                            color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                            border: '1px solid var(--border-color)',
                                            fontSize: '0.9rem', lineHeight: 1.6,
                                            borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                                            borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 14,
                                        }}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.content
                                        )}
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.625rem' }}>
                                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                                                    Sources
                                                </div>
                                                {msg.sources.map((src, si) => (
                                                    <div key={si} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                        📄 {src.file} · p.{src.page} — <em>{src.snippet}...</em>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {thinking && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem',
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 14,
                                    fontSize: '0.85rem', color: 'var(--text-muted)',
                                }}>
                                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Thinking...
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Input bar */}
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.625rem', alignItems: 'flex-end' }}>
                    <textarea
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask a question about your uploaded PDFs... (Enter to send)"
                        rows={1}
                        style={{
                            flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                            borderRadius: 10, color: 'var(--text-primary)', padding: '0.7rem 1rem',
                            fontSize: '0.9rem', outline: 'none', resize: 'none', lineHeight: 1.5, fontFamily: 'inherit',
                            maxHeight: 120, overflowY: 'auto',
                        }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--text-muted)'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}
                    />
                    <button
                        onClick={askQuestion}
                        disabled={!question.trim() || thinking}
                        style={{
                            width: 42, height: 42, background: question.trim() ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)', borderRadius: 10, cursor: question.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease',
                        }}
                    >
                        <Send size={16} color={question.trim() ? 'var(--bg-primary)' : 'var(--text-muted)'} />
                    </button>
                </div>
            </motion.div>
            <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

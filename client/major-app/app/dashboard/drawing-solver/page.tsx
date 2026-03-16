'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Loader2, ImageIcon, Volume2 } from 'lucide-react';

export default function DrawingSolver() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const solve = async () => {
    if (!image && !text) {
      setError('Please upload an image or provide a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');
    setAudioUrl('');

    try {
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('text', text);

      const res = await fetch('http://127.0.0.1:5000/solve-drawing', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      setResult(data.result);
      setAudioUrl(data.audio);
    } catch {
      setError('Server error. Please check backend.');
    }

    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    padding: '0.65rem 0.875rem',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Drawing Solver
          </h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Upload a diagram or sketch and get AI-powered explanations with voice.
        </p>
      </motion.div>

      <div className="feature-grid">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 16,
            padding: '1.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            Input
          </h3>

          {/* Upload */}
          <label
            style={{
              border: '1px dashed var(--border-color)',
              borderRadius: 12,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            <Upload size={18} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {image ? image.name : 'Upload Drawing'}
            </span>

            <input
              type="file"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          {/* Prompt */}
          <textarea
            placeholder="Optional prompt (e.g. explain this diagram)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          {/* Button */}
          <button
            onClick={solve}
            disabled={loading}
            className="btn-primary"
            style={{
              marginTop: '1rem',
              width: '100%',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Solving...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Solve Drawing
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <p style={{ marginTop: '0.75rem', color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </p>
          )}
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {!loading && !result && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
              }}
            >
              <ImageIcon size={28} color="var(--text-muted)" />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Upload a drawing to get started
              </p>
            </div>
          )}

          {loading && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  border: '2px solid var(--border-color)',
                  borderTop: '2px solid var(--text-primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ color: 'var(--text-muted)' }}>Analyzing drawing...</p>
            </div>
          )}

          {result && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                padding: '1.25rem',
              }}
            >
              <h3 style={{ marginBottom: '0.75rem' }}>Result</h3>

              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {result}
              </pre>

              {audioUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <Volume2 size={16} />
                    <span style={{ fontSize: '0.85rem' }}>
                      Listen Explanation
                    </span>
                  </div>

                  <audio controls src={audioUrl} style={{ width: '100%' }} />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
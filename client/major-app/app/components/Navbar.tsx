'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, GraduationCap, ArrowRight } from 'lucide-react';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const close = () => setMobileOpen(false);

    return (
        <>
            <nav style={{
                position: 'relative',
                zIndex: 100,
                padding: '1.25rem 0',
                background: 'transparent',
                borderBottom: 'none',
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    padding: '0 1.5rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                }}>

                    {/* ── Logo ── */}
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center',
                        gap: '0.5rem', textDecoration: 'none', flexShrink: 0,
                    }}>
                        <div style={{
                            width: 30, height: 30,
                            background: 'var(--text-primary)',
                            borderRadius: 7,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <GraduationCap size={15} color="var(--bg-primary)" strokeWidth={2} />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-jakarta)',
                            fontWeight: 700, fontSize: '1.05rem',
                            letterSpacing: '-0.02em',
                            color: 'var(--text-primary)',
                        }}>
                            Study Genie
                        </span>
                    </Link>

                    {/* ── Desktop nav (hidden on mobile via JS) ── */}
                    {!isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    style={{
                                        padding: '0.45rem 0.8rem', borderRadius: 8,
                                        fontSize: '0.875rem', fontWeight: 500,
                                        color: 'var(--text-secondary)', textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* ── Right actions ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        {/* Desktop CTA */}
                        {!isMobile && (
                            <a
                                href="/dashboard"
                                className="btn-primary"
                                style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}
                            >
                                Dashboard
                            </a>
                        )}

                        <ThemeToggle size="sm" />

                        {/* Hamburger — mobile only */}
                        {isMobile && (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={mobileOpen}
                                style={{
                                    width: 36, height: 36,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: mobileOpen ? 'var(--bg-tertiary)' : 'transparent',
                                    border: '1px solid',
                                    borderColor: mobileOpen ? 'var(--border-color-hover)' : 'var(--border-color)',
                                    borderRadius: 8,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0,
                                }}
                            >
                                <span style={{
                                    display: 'flex',
                                    transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.25s ease',
                                }}>
                                    {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Backdrop ── */}
            {isMobile && (
                <div
                    onClick={close}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 98,
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(4px)',
                        transition: 'opacity 0.25s ease',
                        opacity: mobileOpen ? 1 : 0,
                        pointerEvents: mobileOpen ? 'auto' : 'none',
                    }}
                    aria-hidden
                />
            )}

            {/* ── Mobile Slide Drawer ── */}
            {isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, right: 0, bottom: 0,
                        width: 'min(290px, 82vw)',
                        zIndex: 99,
                        background: 'var(--bg-card)',
                        borderLeft: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflowY: 'auto',
                        boxShadow: mobileOpen ? '-8px 0 32px rgba(0,0,0,0.15)' : 'none',
                    }}
                    aria-hidden={!mobileOpen}
                >
                    {/* Drawer header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid var(--border-color)',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: 26, height: 26, background: 'var(--text-primary)',
                                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <GraduationCap size={12} color="var(--bg-primary)" strokeWidth={2} />
                            </div>
                            <span style={{
                                fontWeight: 700, fontSize: '0.9rem',
                                letterSpacing: '-0.02em', color: 'var(--text-primary)',
                                fontFamily: 'var(--font-jakarta)',
                            }}>
                                Study Genie
                            </span>
                        </div>
                        <button
                            onClick={close}
                            aria-label="Close menu"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: 4, borderRadius: 6,
                                display: 'flex', alignItems: 'center',
                            }}
                        >
                            <X size={17} />
                        </button>
                    </div>

                    {/* Drawer nav */}
                    <nav style={{
                        flex: 1, padding: '1rem 0.875rem',
                        display: 'flex', flexDirection: 'column', gap: '0.25rem',
                    }}>
                        <p style={{
                            fontSize: '0.68rem', fontWeight: 600,
                            color: 'var(--text-muted)', textTransform: 'uppercase',
                            letterSpacing: '0.09em', padding: '0 0.5rem',
                            marginBottom: '0.375rem',
                        }}>
                            Navigation
                        </p>
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={close}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.7rem 0.875rem',
                                    borderRadius: 9,
                                    fontSize: '0.9rem', fontWeight: 500,
                                    color: 'var(--text-secondary)', textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                }}
                            >
                                {link.label}
                                <ArrowRight size={13} color="var(--text-muted)" />
                            </a>
                        ))}
                    </nav>

                    {/* Drawer CTA */}
                    <div style={{
                        padding: '0.875rem 0.875rem 1.5rem',
                        borderTop: '1px solid var(--border-color)',
                        flexShrink: 0,
                    }}>
                        <a
                            href="/dashboard"
                            onClick={close}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', padding: '0.7rem' }}
                        >
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

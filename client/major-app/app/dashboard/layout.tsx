'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, FileText, CreditCard, Brain, Camera,
    BookOpen, Mic, LogOut, ChevronLeft, ChevronRight,
    GraduationCap, Menu, Search, X,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', desc: 'Home overview' },
    { label: 'Worksheet Generator', icon: FileText, href: '/dashboard/worksheet', desc: 'AI worksheets' },
    { label: 'Flashcard Generator', icon: CreditCard, href: '/dashboard/flashcards', desc: 'Study flashcards' },
    { label: 'Quiz Generator', icon: Brain, href: '/dashboard/quiz', desc: 'MCQ quizzes' },
    { label: 'Face Attendance', icon: Camera, href: '/dashboard/face-attendance', desc: 'Facial recognition' },
    { label: 'RAG System', icon: BookOpen, href: '/dashboard/rag', desc: 'Chat with PDFs' },
    { label: 'Lecture Intelligence', icon: Mic, href: '/dashboard/lecture-intelligence', desc: 'Audio summaries' },
];

const bottomItems = [
    { label: 'Logout', icon: LogOut, href: '/' },
];

function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim()
        ? navItems.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase())
        )
        : navItems; // show all when just focused with empty query

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Reset active index when results change
    useEffect(() => { setActiveIdx(0); }, [query]);

    const navigate = useCallback((href: string) => {
        router.push(href);
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
    }, [router]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            if (filtered[activeIdx]) navigate(filtered[activeIdx].href);
        } else if (e.key === 'Escape') {
            setOpen(false);
            setQuery('');
            inputRef.current?.blur();
        }
    };

    return (
        <div
            ref={containerRef}
            style={{ position: 'relative', flex: 1, minWidth: 140, maxWidth: 280 }}
            className="hidden sm:block"
        >
            {/* Input */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--bg-secondary)',
                border: `1px solid ${open ? 'var(--border-color-hover)' : 'var(--border-color)'}`,
                borderRadius: open && filtered.length > 0 ? '10px 10px 0 0' : 10,
                padding: '0.35rem 0.75rem',
                transition: 'border-color 0.15s ease, border-radius 0.15s ease',
            }}>
                <Search size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search tools..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        width: '100%',
                        fontFamily: 'inherit',
                    }}
                    aria-label="Search dashboard tools"
                    aria-autocomplete="list"
                    aria-expanded={open}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: 0, display: 'flex',
                            alignItems: 'center', flexShrink: 0,
                        }}
                        tabIndex={-1}
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && filtered.length > 0 && (
                <div
                    role="listbox"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0, right: 0,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color-hover)',
                        borderTop: 'none',
                        borderRadius: '0 0 10px 10px',
                        overflow: 'hidden',
                        zIndex: 999,
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    {filtered.map((item, i) => (
                        <button
                            key={item.href}
                            role="option"
                            aria-selected={i === activeIdx}
                            onMouseEnter={() => setActiveIdx(i)}
                            onClick={() => navigate(item.href)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: i === activeIdx ? 'var(--bg-tertiary)' : 'transparent',
                                border: 'none',
                                borderTop: i > 0 ? '1px solid var(--border-color)' : 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.1s ease',
                                fontFamily: 'inherit',
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: 26, height: 26,
                                background: i === activeIdx ? 'var(--text-primary)' : 'var(--bg-secondary)',
                                borderRadius: 7,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'background 0.1s ease',
                            }}>
                                <item.icon
                                    size={12}
                                    color={i === activeIdx ? 'var(--bg-primary)' : 'var(--text-secondary)'}
                                    strokeWidth={1.8}
                                />
                            </div>

                            {/* Text */}
                            <div style={{ minWidth: 0 }}>
                                <div style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {highlightMatch(item.label, query)}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                    marginTop: 1,
                                }}>
                                    {item.desc}
                                </div>
                            </div>

                            {/* Enter hint on active */}
                            {i === activeIdx && (
                                <span style={{
                                    marginLeft: 'auto',
                                    fontSize: '0.65rem',
                                    color: 'var(--text-muted)',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 4,
                                    padding: '1px 5px',
                                    flexShrink: 0,
                                    fontFamily: 'monospace',
                                }}>
                                    ↵
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* No results */}
            {open && query.trim() && filtered.length === 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%', left: 0, right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color-hover)',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: '0.875rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    zIndex: 999,
                }}>
                    No tools match "{query}"
                </div>
            )}
        </div>
    );
}

// Bold-highlight matching characters in result label
function highlightMatch(text: string, query: string): React.ReactNode {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {text.slice(idx, idx + query.length)}
            </span>
            {text.slice(idx + query.length)}
        </>
    );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    useEffect(() => {
        const check = () => { if (window.innerWidth < 1024) setCollapsed(true); };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const currentPage = navItems.find(item => item.href === pathname) ?? navItems[0];

    return (
        <div className="dashboard-layout">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 39,
                        backdropFilter: 'blur(4px)',
                    }}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

                {/* Logo + collapse toggle */}
                <div style={{
                    borderBottom: '1px solid var(--border-color)',
                    minHeight: 56,
                    flexShrink: 0,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: collapsed ? '0.75rem 0' : '0.875rem 1.125rem',
                    transition: 'padding 0.3s ease',
                }}>
                    <Link
                        href="/"
                        style={{
                            display: 'flex', alignItems: 'center',
                            gap: '0.5rem', textDecoration: 'none',
                            overflow: 'hidden', minWidth: 0,
                        }}
                    >
                        <div style={{
                            width: 30, height: 30, background: 'var(--text-primary)',
                            borderRadius: 8, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', flexShrink: 0,
                        }}>
                            <GraduationCap size={15} color="var(--bg-primary)" strokeWidth={2} />
                        </div>
                        {!collapsed && (
                            <span style={{
                                fontFamily: 'var(--font-jakarta, sans-serif)',
                                fontWeight: 700, fontSize: '0.925rem',
                                letterSpacing: '-0.02em', color: 'var(--text-primary)',
                                whiteSpace: 'nowrap', overflow: 'hidden',
                            }}>
                                Dashboard
                            </span>
                        )}
                    </Link>

                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: 4, borderRadius: 6,
                                transition: 'color 0.2s', display: 'flex', alignItems: 'center', flexShrink: 0,
                            }}
                            className="hidden lg:flex"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}

                    {collapsed && (
                        <button
                            onClick={() => setCollapsed(false)}
                            style={{
                                position: 'absolute', bottom: -14, left: '50%',
                                transform: 'translateX(-50%)',
                                width: 24, height: 24,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-muted)', zIndex: 10, transition: 'all 0.2s',
                            }}
                            className="hidden lg:flex"
                            title="Expand sidebar"
                        >
                            <ChevronRight size={12} />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                        {!collapsed && (
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                padding: '0 0.5rem', display: 'block',
                                marginBottom: '0.5rem', marginTop: '0.25rem',
                            }}>
                                Menu
                            </span>
                        )}
                        {navItems.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`nav-item ${active ? 'active' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                    style={{
                                        marginBottom: '0.125rem',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                    }}
                                >
                                    <item.icon size={18} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                                    {!collapsed && (
                                        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Bottom */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="nav-item"
                            title={collapsed ? item.label : undefined}
                            style={{ marginBottom: '0.125rem', justifyContent: collapsed ? 'center' : 'flex-start' }}
                        >
                            <item.icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={`dashboard-main ${collapsed ? 'collapsed' : ''}`}>
                <div className="dashboard-topbar">
                    {/* Mobile menu toggle */}
                    <button
                        className="flex lg:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)', cursor: 'pointer',
                            width: 34, height: 34, borderRadius: 8,
                            alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <Menu size={18} />
                    </button>

                    {/* Page title */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {currentPage?.label ?? 'Dashboard'}
                        </h1>
                    </div>

                    {/* Real-time search */}
                    <SearchBar />

                    {/* Theme toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <ThemeToggle size="sm" />
                    </div>
                </div>

                <div className="dashboard-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

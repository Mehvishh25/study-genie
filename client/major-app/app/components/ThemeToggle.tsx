'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    size?: 'sm' | 'md';
}

export function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return (
        <div
            style={{
                width: size === 'sm' ? 36 : 40,
                height: size === 'sm' ? 36 : 40,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
            }}
        />
    );

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle theme"
            style={{
                width: size === 'sm' ? 36 : 40,
                height: size === 'sm' ? 36 : 40,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'var(--text-secondary)',
                flexShrink: 0,
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
        >
            {isDark ? (
                <Sun size={size === 'sm' ? 14 : 16} strokeWidth={2} />
            ) : (
                <Moon size={size === 'sm' ? 14 : 16} strokeWidth={2} />
            )}
        </button>
    );
}

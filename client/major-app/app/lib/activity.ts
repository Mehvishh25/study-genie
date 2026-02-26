'use client';

export type ActivityType = 'worksheet' | 'flashcards' | 'quiz' | 'attendance' | 'rag' | 'lecture';

export interface Activity {
    id: string;
    type: ActivityType;
    action: string;
    detail: string;
    timestamp: number;
}

const STORAGE_KEY = 'study_genie_activities';

export const logActivity = (type: ActivityType, action: string, detail: string) => {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const activities: Activity[] = stored ? JSON.parse(stored) : [];

        const newActivity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            action,
            detail,
            timestamp: Date.now(),
        };

        // Keep only last 10 activities
        const updated = [newActivity, ...activities].slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Dispatch a custom event so other components can listen for updates
        window.dispatchEvent(new Event('activity_updated'));
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

export const getActivities = (): Activity[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const formatTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

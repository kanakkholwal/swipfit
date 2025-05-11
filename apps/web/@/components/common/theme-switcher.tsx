'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = [
    {
        key: 'system',
        icon: Monitor,
        label: 'System theme',
    },
    {
        key: 'light',
        icon: Sun,
        label: 'Light theme',
    },
    {
        key: 'dark',
        icon: Moon,
        label: 'Dark theme',
    },
];


export type ThemeSwitcherProps = {
    onChange?: (theme: string) => void;

    className?: string;
};

export const ThemeSwitcher = ({
    onChange,
    className,
}: ThemeSwitcherProps) => {
    const { theme, setTheme } = useTheme()

    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative inline-flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
                className
            )}
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = theme === key;

                return (
                    <button
                        type="button"
                        key={key}
                        className="relative h-6 w-6 rounded-full"
                        onClick={() => setTheme(key)}
                        aria-label={label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTheme"
                                className="absolute inset-0 rounded-full bg-secondary"
                                transition={{ type: 'spring', duration: 0.5 }}
                            />
                        )}
                        <Icon
                            className={cn(
                                'relative m-auto h-4 w-4',
                                isActive ? 'text-white' : 'text-muted-foreground'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

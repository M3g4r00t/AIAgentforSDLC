'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    label: string;
}

export function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000, label }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(eased * end));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-ibm-blue-40 counter-value mb-2">
                {prefix}{count}{suffix}
            </div>
            <div className="text-ibm-gray-50 text-sm">{label}</div>
        </div>
    );
}

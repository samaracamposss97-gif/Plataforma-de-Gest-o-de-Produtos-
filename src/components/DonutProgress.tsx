import React from 'react';

interface DonutProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  trackColor?: string;
  label?: React.ReactNode;
}

const DonutProgress: React.FC<DonutProgressProps> = ({
  value,
  size = 64,
  strokeWidth = 7,
  colorFrom = 'var(--primary-light)',
  colorTo = 'var(--primary)',
  trackColor = 'var(--border)',
  label,
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const gradientId = `donut-grad-${colorFrom}-${colorTo}`.replace(/[^a-zA-Z0-9-]/g, '');

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.24, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em',
      }}>
        {label ?? `${Math.round(clamped)}%`}
      </div>
    </div>
  );
};

export default DonutProgress;

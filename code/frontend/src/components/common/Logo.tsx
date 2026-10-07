import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  textClassName?: string;
  badge?: string;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
  >
    <defs>
      <linearGradient id="unicore-grad-1" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <linearGradient id="unicore-grad-core" x1="20" y1="13" x2="20" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#818CF8" />
      </linearGradient>
      <filter id="unicore-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Background container tile with sleek subtle border */}
    <rect
      x="2.5"
      y="2.5"
      width="35"
      height="35"
      rx="10"
      fill="#0B0F19"
      stroke="url(#unicore-grad-1)"
      strokeWidth="1.5"
    />

    {/* Outer U ribbon */}
    <path
      d="M12 12V22.5C12 26.9183 15.5817 30.5 20 30.5C24.4183 30.5 28 26.9183 28 22.5V12"
      stroke="url(#unicore-grad-1)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#unicore-glow)"
    />

    {/* Core Diamond Nexus */}
    <path
      d="M20 14.5L24 20L20 25.5L16 20Z"
      fill="url(#unicore-grad-core)"
    />

    {/* Center High-Energy Nucleus */}
    <circle cx="20" cy="20" r="1.6" fill="#FFFFFF" />
  </svg>
);

export default function Logo({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
  badge
}: LogoProps) {
  const pixelSizes = {
    sm: 26,
    md: 34,
    lg: 42,
    xl: 52
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={pixelSizes[size]} />
      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${textSizes[size]} ${textClassName}`}>
            <span className="text-[var(--text-color)]">Uni</span>
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Core
            </span>
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

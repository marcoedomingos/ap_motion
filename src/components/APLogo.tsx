import React from 'react';

interface APLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  glow?: boolean;
}

export const APLogo: React.FC<APLogoProps> = ({
  className = '',
  size = 40,
  animated = false,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-sky-500/30 scale-125 pointer-events-none transition-opacity duration-300"
        />
      )}
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full relative z-10 transition-transform duration-300 ${
          animated ? 'hover:scale-105' : ''
        }`}
      >
        {/* Geometric AP Monogram - exact replica from AP brand collateral */}
        <path
          d="M 20 120 L 60 26 L 80 60 H 122 C 136 60 144 69 144 79 C 144 89 136 98 122 98 H 94 V 136"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 74 68 L 94 98"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

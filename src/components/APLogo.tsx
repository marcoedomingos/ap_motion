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
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full relative z-10 transition-transform duration-300 ${
          animated ? 'hover:scale-105' : ''
        }`}
      >
        {/* Geometric AP Monogram - exact replica of the user-provided brand mark */}
        {/* Left leg of A: from (24, 88) up to apex (56, 20) */}
        <path
          d="M 24 88 L 56 20 L 88 88"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-0"
        />
        
        {/* Continuous AP single-stroke path */}
        {/* 1. Left leg up: (24, 88) -> (56, 20) */}
        {/* 2. Right leg down to midpoint: (56, 20) -> (72, 54) */}
        {/* 3. Bowl of P extending right & looping: -> (96, 54) arc to (96, 76) -> (72, 76) */}
        {/* 4. Vertical stem of P dropping down: -> (72, 104) */}
        {/* Combined unified stroke */}
        <path
          d="M 26 88 L 58 22 L 74 54 H 92 C 104 54 104 74 92 74 H 74 V 106"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Internal horizontal bar linking the A apex crossbar cleanly */}
        <path
          d="M 64 54 H 74"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

import React from 'react';

interface RotatingStampProps {
  size?: number;
  text?: string;
  className?: string;
}

export const RotatingStamp: React.FC<RotatingStampProps> = ({
  size = 130,
  text = '• AP MOTION STUDIO • DAS IDEIAS ÀS SOLUÇÕES ',
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="animate-spin-slow origin-center"
      >
        <defs>
          <path
            id="stamp-circle-path"
            d="M 100, 100 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
          />
        </defs>

        <text className="text-[14px] font-mono font-bold uppercase fill-[#1A1D2E] tracking-[0.24em]">
          <textPath href="#stamp-circle-path" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center neon dot accent (like the reference) */}
      <div className="absolute w-2 h-2 rounded-full bg-[#A3E635] shadow-[0_0_8px_#A3E635]" />
    </div>
  );
};

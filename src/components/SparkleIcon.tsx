import React from 'react';

interface SparkleProps {
  size?: number;
  className?: string;
  variant?: '4-point' | '8-point';
}

export const SparkleIcon: React.FC<SparkleProps> = ({
  size = 40,
  className = 'text-black',
  variant = '8-point',
}) => {
  if (variant === '4-point') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className={className}
      >
        <path
          d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z"
          fill="none"
          stroke="currentColor"
        />
      </svg>
    );
  }

  // 8-point geometric star like the left one in the reference
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
    >
      <polygon points="50,0 54,35 85,15 65,46 100,50 65,54 85,85 54,65 50,100 46,65 15,85 35,54 0,50 35,46 15,15 46,35" />
    </svg>
  );
};

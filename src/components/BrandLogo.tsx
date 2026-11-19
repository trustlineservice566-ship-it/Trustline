import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: number;
}

export const ShieldCheckmarkMark: React.FC<{ variant?: 'light' | 'dark'; size?: number }> = ({
  variant = 'dark',
  size = 34,
}) => {
  const shieldFill = variant === 'light' ? '#FFFFFF' : '#0B1F3A';
  const shieldInner = variant === 'light' ? '#0B1F3A' : '#132D52';
  const goldStroke = '#C6973F';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M20 3.5L6.5 8.8V19.6C6.5 28.1 12.25 35.15 20 37.5C27.75 35.15 33.5 28.1 33.5 19.6V8.8L20 3.5Z"
        fill={shieldFill}
        stroke={goldStroke}
        strokeWidth="1.75"
      />
      <path
        d="M20 6.8L9.5 11V19.5C9.5 26.35 13.95 32.05 20 34.1C26.05 32.05 30.5 26.35 30.5 19.5V11L20 6.8Z"
        fill={shieldInner}
      />
      <path
        d="M14.5 20.2L18.2 23.9L25.8 15.8"
        stroke={goldStroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', size = 32 }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#0B1F3A]';
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-tight whitespace-nowrap shrink-0 ${textColor}`}>
      <ShieldCheckmarkMark variant={variant} size={size} />
      <span className="text-lg leading-none">Trustline</span>
    </span>
  );
};

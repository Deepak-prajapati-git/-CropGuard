import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 32,
  showText = true,
  textColor = '#174A35',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CropGuard logo"
        role="img"
      >
        {/* Shield base */}
        <path
          d="M20 3L6 8.5V19C6 27.5 12.5 34.5 20 37C27.5 34.5 34 27.5 34 19V8.5L20 3Z"
          fill="#174A35"
          fillOpacity="0.12"
          stroke="#174A35"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Leaf shape inside */}
        <path
          d="M20 12C20 12 13 15 13 22C13 26 16.5 29 20 29C23.5 29 27 26 27 22C27 15 20 12 20 12Z"
          fill="#174A35"
          fillOpacity="0.9"
        />
        {/* Leaf vein */}
        <path
          d="M20 12V29"
          stroke="#6F8F55"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Scan line (horizontal through middle) */}
        <path
          d="M14 21H26"
          stroke="#6F8F55"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
        {/* Small dots indicating scan */}
        <circle cx="11" cy="21" r="1.5" fill="#6F8F55" />
        <circle cx="29" cy="21" r="1.5" fill="#6F8F55" />
      </svg>
      {showText && (
        <span
          style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}
          className="text-[17px] font-semibold tracking-tight leading-none"
        >
          Crop<span style={{ color: '#6F8F55' }}>Guard</span>
        </span>
      )}
    </div>
  );
};

export default Logo;

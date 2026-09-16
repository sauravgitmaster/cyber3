import React from 'react';

export type ByteMood =
  | 'happy'
  | 'waving'
  | 'thinking'
  | 'excited'
  | 'caution'
  | 'proud'
  | 'detective';

interface ByteMascotProps {
  mood?: ByteMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const ByteMascot: React.FC<ByteMascotProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const getEyeExpression = () => {
    switch (mood) {
      case 'happy':
      case 'waving':
      case 'proud':
        return (
          <>
            {/* Happy curved arch eyes */}
            <path
              d="M32 46 C32 40, 40 40, 40 46"
              stroke="#243047"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M60 46 C60 40, 68 40, 68 46"
              stroke="#243047"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Starry big shining eyes */}
            <circle cx="36" cy="44" r="5" fill="#243047" />
            <circle cx="34" cy="42" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="44" r="5" fill="#243047" />
            <circle cx="62" cy="42" r="1.8" fill="#FFFFFF" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Looking up thoughtfully */}
            <circle cx="36" cy="41" r="4.5" fill="#243047" />
            <circle cx="64" cy="41" r="4.5" fill="#243047" />
          </>
        );
      case 'caution':
        return (
          <>
            {/* Wide alert eyes */}
            <ellipse cx="36" cy="44" rx="4.5" ry="5.5" fill="#243047" />
            <ellipse cx="64" cy="44" rx="4.5" ry="5.5" fill="#243047" />
          </>
        );
      case 'detective':
        return (
          <>
            {/* Left eye normal, right eye with magnifying monocle rim */}
            <circle cx="35" cy="44" r="4" fill="#243047" />
            <circle cx="64" cy="44" r="7" stroke="#FFC857" strokeWidth="2.5" fill="none" />
            <circle cx="64" cy="44" r="4" fill="#243047" />
            <line x1="69" y1="49" x2="74" y2="54" stroke="#FFC857" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <circle cx="36" cy="44" r="4" fill="#243047" />
            <circle cx="64" cy="44" r="4" fill="#243047" />
          </>
        );
    }
  };

  const getMouthExpression = () => {
    switch (mood) {
      case 'excited':
      case 'proud':
        return (
          <path
            d="M44 56 Q50 63 56 56"
            stroke="#243047"
            strokeWidth="3"
            strokeLinecap="round"
            fill="#FF6B6B"
          />
        );
      case 'thinking':
        return (
          <path
            d="M46 56 Q50 54 54 56"
            stroke="#243047"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'caution':
        return (
          <ellipse cx="50" cy="56" rx="3.5" ry="3" fill="#243047" />
        );
      default:
        return (
          <path
            d="M44 54 Q50 60 56 54"
            stroke="#243047"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className} ${
        animate ? 'transition-transform hover:scale-105 active:scale-95 duration-200' : ''
      }`}
      title="Byte, your Cyber Buddy"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Antenna */}
        <line x1="50" y1="12" x2="50" y2="24" stroke="#8B6CFF" strokeWidth="4" strokeLinecap="round" />
        {/* Antenna glowing orb */}
        <circle cx="50" cy="11" r="5" fill="#FFC857" />
        <circle cx="50" cy="11" r="2.5" fill="#FFFDF0" />

        {/* Ears / Headphone nubs */}
        <rect x="14" y="38" width="6" height="14" rx="3" fill="#4F7CFF" />
        <rect x="80" y="38" width="6" height="14" rx="3" fill="#4F7CFF" />

        {/* Main Head / Helmet */}
        <rect
          x="18"
          y="22"
          width="64"
          height="48"
          rx="18"
          fill="#4F7CFF"
        />

        {/* Face Screen Plate (Soft Cyan/White Glow) */}
        <rect
          x="24"
          y="28"
          width="52"
          height="36"
          rx="12"
          fill="#EBF3FF"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="28" cy="51" rx="3" ry="2" fill="#FF9EAA" opacity="0.8" />
        <ellipse cx="72" cy="51" rx="3" ry="2" fill="#FF9EAA" opacity="0.8" />

        {/* Eyes */}
        {getEyeExpression()}

        {/* Mouth */}
        {getMouthExpression()}

        {/* Cute Detective Hat if detective */}
        {mood === 'detective' && (
          <g>
            <path
              d="M26 24 C26 16, 74 16, 74 24 Z"
              fill="#D97706"
            />
            <line x1="20" y1="24" x2="80" y2="24" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Little Body */}
        <path
          d="M32 70 C32 68, 68 68, 68 70 L64 88 C64 91, 36 91, 36 88 Z"
          fill="#3B65E0"
        />

        {/* Chest Shield Emblem */}
        <path
          d="M50 74 L57 77 L57 82 C57 85, 50 87, 50 87 C50 87, 43 85, 43 82 L43 77 Z"
          fill="#FFC857"
        />
        <path
          d="M50 77 L53 79 L53 82 C53 83.5, 50 85, 50 85 C50 85, 47 83.5, 47 82 L47 79 Z"
          fill="#FFFFFF"
        />

        {/* Hands / Paws */}
        {mood === 'waving' ? (
          <>
            <circle cx="28" cy="78" r="4.5" fill="#8B6CFF" />
            {/* Raised waving hand */}
            <circle cx="83" cy="30" r="5" fill="#8B6CFF" />
          </>
        ) : (
          <>
            <circle cx="28" cy="78" r="4.5" fill="#8B6CFF" />
            <circle cx="72" cy="78" r="4.5" fill="#8B6CFF" />
          </>
        )}
      </svg>
    </div>
  );
};

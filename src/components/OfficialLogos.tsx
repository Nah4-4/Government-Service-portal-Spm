import React from 'react';

/**
 * Addis Ababa City Administration circular emblem (Left Logo)
 */
export const AddisAbabaEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`shrink-0 select-none ${className}`}
    role="img"
    aria-label="Addis Ababa City Administration Emblem"
  >
    {/* Outer circle */}
    <circle cx="50" cy="50" r="48" fill="#1b2432" stroke="#222" strokeWidth="2" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#d4af37" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="39" fill="#111827" stroke="#9ca3af" strokeWidth="0.8" />

    {/* Arched Monument Gates / Building of City Hall */}
    <path
      d="M30 68 L30 42 Q30 35 38 35 L42 35 L42 26 L50 20 L58 26 L58 35 L62 35 Q70 35 70 42 L70 68 Z"
      fill="#d4af37"
      stroke="#b8860b"
      strokeWidth="1"
    />
    {/* Arches */}
    <path
      d="M36 68 L36 48 Q36 43 40 43 Q44 43 44 48 L44 68 Z"
      fill="#111827"
    />
    <path
      d="M47 68 L47 45 Q47 38 50 38 Q53 38 53 45 L53 68 Z"
      fill="#111827"
    />
    <path
      d="M56 68 L56 48 Q56 43 60 43 Q64 43 64 48 L64 68 Z"
      fill="#111827"
    />

    {/* Ethiopian star / rays */}
    <circle cx="50" cy="29" r="3" fill="#eab308" />
    <path
      d="M24 72 Q50 78 76 72"
      stroke="#d4af37"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

/**
 * Addis Ababa City Administration Trade Bureau circular crest (Right Logo)
 */
export const TradeBureauLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`shrink-0 select-none ${className}`}
    role="img"
    aria-label="Addis Ababa Trade Bureau Logo"
  >
    {/* Dark outer ring */}
    <circle cx="50" cy="50" r="48" fill="#182230" stroke="#000" strokeWidth="2" />
    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1" />
    
    {/* Circular text path */}
    <defs>
      <path
        id="tradeBureauTextPath"
        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
      />
    </defs>
    <text fill="#ffffff" fontSize="7.5" fontWeight="bold" letterSpacing="0.05em">
      <textPath href="#tradeBureauTextPath" startOffset="5%">
        ADDIS ABABA TRADE BUREAU
      </textPath>
    </text>

    {/* Inner Gold / White Ring */}
    <circle cx="50" cy="50" r="28" fill="#1e3a8a" stroke="#d4af37" strokeWidth="1.8" />

    {/* Gear & Scale / Commerce symbol */}
    <g transform="translate(50, 50) scale(0.65)">
      {/* Gear teeth */}
      <circle cx="0" cy="0" r="16" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="5 3" />
      {/* Balance beam */}
      <path d="M-15 -3 L15 -3" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M0 -9 L0 14" stroke="#ffffff" strokeWidth="2.5" />
      {/* Pans */}
      <path d="M-15 -3 L-20 6 L-10 6 Z" fill="#fbbf24" />
      <path d="M15 -3 L10 6 L20 6 Z" fill="#fbbf24" />
      {/* Base */}
      <path d="M-10 14 L10 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Authentic Blue Rubber Ink Stamp (ማህተም)
 * Replicates the circular Ethiopian government registry seal seen in the reference PDF.
 */
export const BlueOfficialRubberStamp: React.FC<{
  size?: number;
  rotation?: number;
  className?: string;
}> = ({ size = 140, rotation = -8, className = '' }) => (
  <div
    style={{
      width: size,
      height: size,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
    }}
    className={`pointer-events-none select-none inline-block ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 160 160"
      width="100%"
      height="100%"
      className="overflow-visible"
    >
      <defs>
        {/* Top arc text path */}
        <path
          id="stampArcTop"
          d="M 18 80 A 62 62 0 1 1 142 80"
          fill="none"
        />
        {/* Bottom arc text path */}
        <path
          id="stampArcBottom"
          d="M 142 80 A 62 62 0 0 1 18 80"
          fill="none"
        />
      </defs>

      {/* Blue ink stamp style: semi-transparent, slight ink bleed */}
      <g stroke="#1d4ed8" fill="#1d4ed8" opacity="0.88">
        {/* Outer concentric rings */}
        <circle
          cx="80"
          cy="80"
          r="76"
          fill="none"
          strokeWidth="2.2"
          strokeDasharray="140 1"
        />
        <circle
          cx="80"
          cy="80"
          r="71"
          fill="none"
          strokeWidth="1.2"
        />

        {/* Inner concentric ring */}
        <circle
          cx="80"
          cy="80"
          r="48"
          fill="none"
          strokeWidth="1.4"
        />
        <circle
          cx="80"
          cy="80"
          r="45"
          fill="none"
          strokeWidth="0.8"
        />

        {/* Outer Circular Amharic Text on Top */}
        <text
          fontSize="10"
          fontWeight="bold"
          letterSpacing="0.04em"
          fontFamily="Noto Sans Ethiopic, Nyala, sans-serif"
        >
          <textPath href="#stampArcTop" startOffset="50%" textAnchor="middle">
            በአዲስ አበባ ከተማ አስተዳደር ንግድ ቢሮ
          </textPath>
        </text>

        {/* Outer Circular English Text on Bottom */}
        <text
          fontSize="7.8"
          fontWeight="bold"
          letterSpacing="0.06em"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          <textPath href="#stampArcBottom" startOffset="50%" textAnchor="middle">
            ★ ADDIS ABABA TRADE BUREAU ★
          </textPath>
        </text>

        {/* Center Star & Emblems */}
        {/* Central Star */}
        <path
          d="M 80 57 L 82.5 64 L 90 64 L 84 68.5 L 86 76 L 80 71.5 L 74 76 L 76 68.5 L 70 64 L 77.5 64 Z"
          fill="#1d4ed8"
        />

        {/* Center Text */}
        <text
          x="80"
          y="88"
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fontFamily="Noto Sans Ethiopic, Nyala, sans-serif"
        >
          የንግድ ፈቃድ ክፍል
        </text>
        <text
          x="80"
          y="99"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          fontFamily="Plus Jakarta Sans, sans-serif"
          letterSpacing="0.04em"
        >
          TRADE LICENSING
        </text>
        <text
          x="80"
          y="108"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="bold"
        >
          * OFFICIAL SEAL *
        </text>
      </g>
    </svg>
  </div>
);

/**
 * Official vector signature
 */
export const OfficialSignatureSvg: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 150 45"
    className={`inline-block ${className}`}
    width="130"
    height="40"
    fill="none"
    stroke="#1e3a8a"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 10 32 Q 25 8 35 26 T 55 18 Q 65 35 80 12 T 100 28 Q 115 15 135 22" />
    <path d="M 28 35 Q 75 32 140 30" strokeWidth="1.6" />
    <path d="M 40 22 Q 52 14 62 25" strokeWidth="1.4" />
  </svg>
);

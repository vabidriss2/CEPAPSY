import React from "react";

interface LogoProps {
  className?: string;
  size?: number | string;
}

export const EpaPsyLogo: React.FC<LogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <svg
      viewBox="0 0 350 250"
      className={className}
      style={{ width: size, height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo EPA PSY"
    >
      {/* Background container or group */}
      <g>
        {/* Curved dynamic swooshes - red and blue orbits */}
        {/* Outer blue-teal swoosh */}
        <path
          d="M 60,110 C 15,200 130,240 280,210 C 290,205 292,198 285,198 C 170,225 70,185 85,112 C 95,65 170,25 280,75 C 285,78 288,72 280,68 C 150,15 80,55 60,110 Z"
          fill="#046399"
        />
        {/* Inner red swoosh */}
        <path
          d="M 68,110 C 50,180 140,215 275,195 C 280,192 278,188 270,189 C 160,205 85,175 95,112 C 102,68 165,35 255,73 C 262,75 264,70 255,67 C 155,25 90,55 68,110 Z"
          fill="#FF0F0F"
        />

        {/* Text Area */}
        {/* "EPA" text */}
        <text
          x="190"
          y="65"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="bold"
          fontSize="68px"
          fill="#000000"
          letterSpacing="4"
        >
          EPA
        </text>

        {/* "PSY" text */}
        <text
          x="80"
          y="180"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="115px"
          fill="#046399"
          letterSpacing="-1"
        >
          PSY
        </text>
      </g>
    </svg>
  );
};

export const AcoRdcLogo: React.FC<LogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <svg
      viewBox="0 0 350 250"
      className={className}
      style={{ width: size, height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo ACO-RDC"
    >
      <g>
        {/* Rainbow/Arch: Yellow, Blue, Red */}
        {/* Yellow arch */}
        <path
          d="M 25,170 A 150,150 0 0,1 325,170"
          stroke="#FBBF24"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Blue arch */}
        <path
          d="M 32,170 A 143,143 0 0,1 318,170"
          stroke="#002FFF"
          strokeWidth="10"
          fill="none"
        />
        {/* Red arch */}
        <path
          d="M 39,170 A 136,136 0 0,1 311,170"
          stroke="#FF0F0F"
          strokeWidth="12"
          fill="none"
        />

        {/* Three handholding figures */}
        {/* Center Figure */}
        <g transform="translate(175, 125)">
          {/* Head */}
          <circle cx="0" cy="-35" r="13" fill="#cca890" stroke="#8C5332" strokeWidth="1.5" />
          {/* Body */}
          <path d="M -1,-22 L 1,-22 L 2,10 L -2,10 Z" fill="#cca890" stroke="#8C5332" strokeWidth="1.5" />
          {/* Arms */}
          <path d="M -22,-14 C -12,-18 0,-20 0,-18 L -35,-8" stroke="#8C5332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 22,-14 C 12,-18 0,-20 0,-18 L 35,-8" stroke="#8C5332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Legs */}
          <path d="M -1,10 L -12,38" stroke="#8C5332" strokeWidth="3" strokeLinecap="round" />
          <path d="M 1,10 L 12,38" stroke="#8C5332" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Left Figure */}
        <g transform="translate(110, 128)">
          {/* Head */}
          <circle cx="0" cy="-35" r="13" fill="#cca890" stroke="#8C5332" strokeWidth="1.5" />
          {/* Body */}
          <path d="M -1,-22 L 1,-22 L 2,10 L -2,10 Z" fill="#cca890" stroke="#8C5332" strokeWidth="1.5" />
          {/* Hand holding center */}
          <path d="M 0,-18 C 15,-18 20,-16 30,-11" stroke="#8C5332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Hand on hip / victory sign */}
          <path d="M -2,-21 Q -18,-15 -25,-1" stroke="#8C5332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Legs */}
          <path d="M -1,10 L -10,38" stroke="#8C5332" strokeWidth="3" strokeLinecap="round" />
          <path d="M 1,10 L 8,38" stroke="#8C5332" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Right Figure */}
        <g transform="translate(240, 128)">
          {/* Head */}
          <circle cx="0" cy="-35" r="13" fill="#cca890" stroke="#8C5332" strokeWidth="1.5" />
          {/* Body */}
          <path d="M -1,-22 L 1,-22 L 2,10 L -2,10 Z" fill="#cca890" stroke="#8C5332" strokeWidth="1.5" />
          {/* Hand holding center */}
          <path d="M 0,-18 C -15,-18 -20,-16 -30,-11" stroke="#8C5332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Hand on hip / victory sign */}
          <path d="M 2,-21 Q 18,-15 25,-1" stroke="#8C5332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Legs */}
          <path d="M -1,10 L -8,38" stroke="#8C5332" strokeWidth="3" strokeLinecap="round" />
          <path d="M 1,10 L 10,38" stroke="#8C5332" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Horizontal banner frame */}
        <rect
          x="15"
          y="172"
          width="320"
          height="52"
          rx="4"
          fill="#FFFFFF"
          stroke="#8C5332"
          strokeWidth="6"
        />

        {/* ACO-RDC Text */}
        <text
          x="175"
          y="211"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="41px"
          fill="#8C5332"
          textAnchor="middle"
          letterSpacing="2"
        >
          ACO-RDC
        </text>
      </g>
    </svg>
  );
};

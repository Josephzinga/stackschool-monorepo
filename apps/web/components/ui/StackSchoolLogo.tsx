import type {CSSProperties} from 'react'

export default function StackSchoolLogo({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 510"
      className={className}
      style={style}
      aria-label="StackSchool logo"
      role="img"
    >
      {/* ── Bar charts – left ── */}
      {/* Tall green bar */}
      <rect x="108" y="148" width="30" height="120" rx="6" fill="#4CB944" />
      {/* Short blue bar */}
      <rect x="145" y="183" width="30" height="85" rx="6" fill="#3B8FD4" />

      {/* ── Bar charts – right ── */}
      {/* Tall blue bar */}
      <rect x="385" y="170" width="30" height="98" rx="6" fill="#3B8FD4" />
      {/* Short green bar */}
      <rect x="422" y="212" width="30" height="56" rx="6" fill="#4CB944" />

      {/* ── Schoolhouse ── */}
      {/* Roof */}
      <polygon points="280,98 190,182 370,182" fill="#1B3A6B" />
      {/* Roof ridge cap */}
      <rect x="276" y="96" width="8" height="6" rx="2" fill="#1B3A6B" />

      {/* Flag pole */}
      <rect x="278" y="56" width="5" height="44" rx="2.5" fill="#1B3A6B" />
      {/* Ball finial */}
      <circle cx="280" cy="55" r="5.5" fill="#1B3A6B" />
      {/* Flag */}
      <polygon points="283,60 308,68 283,76" fill="#1B3A6B" />

      {/* House body */}
      <rect x="198" y="182" width="164" height="92" fill="#F4F4EE" />

      {/* Oculus / round window */}
      <circle cx="280" cy="200" r="18" fill="#DDD" />
      <circle cx="280" cy="200" r="13" fill="#1B3A6B" />
      <circle cx="280" cy="200" r="8" fill="#F4F4EE" />

      {/* 2×2 window grid */}
      {/* Top-left pane */}
      <rect x="222" y="222" width="26" height="22" rx="4" fill="#1B3A6B" />
      {/* Top-right pane */}
      <rect x="312" y="222" width="26" height="22" rx="4" fill="#1B3A6B" />
      {/* Bottom-left pane */}
      <rect x="222" y="249" width="26" height="18" rx="4" fill="#1B3A6B" />
      {/* Bottom-right pane */}
      <rect x="312" y="249" width="26" height="18" rx="4" fill="#1B3A6B" />

      {/* ── Books stack ── */}
      {/* Top book – yellow */}
      <rect x="178" y="274" width="204" height="25" rx="7" fill="#F5C518" />
      {/* Middle book – teal */}
      <rect x="162" y="296" width="236" height="25" rx="7" fill="#2AACB8" />
      {/* Bottom book – navy */}
      <rect x="145" y="318" width="270" height="30" rx="7" fill="#1B3A6B" />
      {/* Bookmark ribbon */}
      <polygon points="277,348 283,348 286,364 280,358 274,364" fill="#2AACB8" />

      {/* ── Logotype ── */}
      {/* "Stack" – navy */}
      <text
        x="273"
        y="405"
        fontFamily="'Nunito', 'Montserrat', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="74"
        fill="#1B3A6B"
        textAnchor="end"
      >
        Stack
      </text>
      {/* "School" – green */}
      <text
        x="287"
        y="405"
        fontFamily="'Nunito', 'Montserrat', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="74"
        fill="#4CB944"
        textAnchor="start"
      >
        School
      </text>

      {/* ── Divider ── */}
      <line x1="148" y1="421" x2="412" y2="421" stroke="#1B3A6B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="280" cy="421" r="4.5" fill="#4CB944" />

      {/* ── Tagline ── */}
      <text
        x="280"
        y="450"
        fontFamily="'Nunito', 'Montserrat', 'Arial', sans-serif"
        fontWeight="700"
        fontSize="18"
        fill="#1B3A6B"
        textAnchor="middle"
        letterSpacing="3.5"
      >
        GÉRER • ENSEIGNER • RÉUSSIR
      </text>
    </svg>
  )
}

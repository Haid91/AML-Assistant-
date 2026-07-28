export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="18" fill="#0d1b2e"/>

      {/* A — strokes */}
      <line x1="30" y1="16" x2="16" y2="56" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="30" y1="16" x2="44" y2="56" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="16" y1="56" x2="44" y2="56" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="16" y1="56" x2="8"  y2="83" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="44" y1="56" x2="36" y2="83" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>

      {/* i — strokes */}
      <line x1="66" y1="25" x2="66" y2="83" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="55" y1="56" x2="77" y2="56" stroke="#b8c1cc" strokeWidth="4.5" strokeLinecap="round"/>

      {/* A — nodes */}
      <circle cx="30" cy="16" r="6"   fill="#dde3ea"/>
      <circle cx="16" cy="56" r="5"   fill="#dde3ea"/>
      <circle cx="44" cy="56" r="5"   fill="#dde3ea"/>
      <circle cx="8"  cy="83" r="6.5" fill="#dde3ea"/>
      <circle cx="36" cy="83" r="6.5" fill="#dde3ea"/>

      {/* i — nodes */}
      <circle cx="66" cy="16" r="7"   fill="#c49a1a"/>
      <circle cx="55" cy="56" r="5"   fill="#dde3ea"/>
      <circle cx="77" cy="56" r="5"   fill="#dde3ea"/>
      <circle cx="66" cy="83" r="6.5" fill="#dde3ea"/>
    </svg>
  )
}

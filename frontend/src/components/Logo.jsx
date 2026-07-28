export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="14" fill="#0d1b2e"/>

      {/* Serif A */}
      <text
        x="30"
        y="80"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="74"
        fill="#f0ece3"
        textAnchor="middle"
      >A</text>

      {/* Gold crossbar overlay on the A */}
      <rect x="13" y="52" width="34" height="8" rx="1" fill="#c49a1a"/>

      {/* Serif I */}
      <text
        x="73"
        y="80"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="74"
        fill="#f0ece3"
        textAnchor="middle"
      >I</text>
    </svg>
  )
}

// The EduSphere mark: four petals meeting at a center point, like an open
// book's pages viewed from above — literally a "sphere of learning."
// Built as inline SVG (not an <img>) so it scales perfectly crisp at any
// size, from a 20px sidebar icon to a full hero mark, with zero extra
// network request.
const LogoMark = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="110" height="110" rx="24" fill="#FAFAF9" />
    <g>
      <path d="M55 55 C42 55 37 38 55 16 C73 38 68 55 55 55 Z" fill="#4338CA" />
      <path d="M55 55 C72 55 89 50 94 55 C89 60 72 55 55 55 Z" fill="#F59E0B" transform="rotate(90 55 55)" />
      <path d="M55 55 C42 55 37 38 55 16 C73 38 68 55 55 55 Z" fill="#059669" transform="rotate(180 55 55)" />
      <path d="M55 55 C72 55 89 50 94 55 C89 60 72 55 55 55 Z" fill="#818CF8" transform="rotate(270 55 55)" />
    </g>
  </svg>
);

const Logo = ({ size = 24, showWordmark = true, wordmarkClassName = '' }) => (
  <div className="flex items-center gap-2">
    <LogoMark size={size} />
    {showWordmark && (
      <span className={`font-display font-medium text-gray-900 ${wordmarkClassName}`}>EduSphere</span>
    )}
  </div>
);

export { LogoMark };
export default Logo;
// Bordered "raised" card — for bounded content (course cards, list rows,
// forms). For dashboard stat numbers, use MetricTile instead — it's
// deliberately flatter/quieter since a grid of bordered cards for plain
// numbers reads as heavier than it needs to be.
const Card = ({ children, className = '', hover = false, ...props }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl ${hover ? 'hover:border-gray-300 hover:shadow-sm transition-all' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
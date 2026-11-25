// Muted, borderless stat tile for dashboard numbers — distinct from Card
// (which has a visible border and is for bounded content, not raw metrics).
const colorMap = {
  gray: 'text-gray-900',
  primary: 'text-primary-700',
  accent: 'text-accent-700',
  success: 'text-success-700',
};

const MetricTile = ({ label, value, color = 'gray' }) => (
  <div className="bg-gray-50 rounded-lg p-3.5">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-xl font-medium ${colorMap[color]}`}>{value}</p>
  </div>
);

export default MetricTile;
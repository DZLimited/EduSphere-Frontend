const variants = {
  gray: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-800',
  success: 'bg-success-100 text-success-800',
  danger: 'bg-red-100 text-red-700',
};

const Badge = ({ children, variant = 'gray', className = '' }) => (
  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
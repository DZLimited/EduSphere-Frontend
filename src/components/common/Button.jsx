const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-800',
    secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    accent: 'bg-accent-500 text-accent-900 hover:bg-accent-600',
    success: 'bg-success-600 text-white hover:bg-success-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
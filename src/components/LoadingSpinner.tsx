
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className="relative">
      <div className={`animate-spin rounded-full border-2 border-green-500/20 border-t-green-400 ${sizeClasses[size]} ${className}`} />
      <div className={`animate-pulse absolute inset-0 rounded-full bg-gradient-to-r from-green-400/10 to-green-600/10 ${sizeClasses[size]}`} />
    </div>
  );
};

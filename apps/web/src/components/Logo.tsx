import { useTheme } from '../hooks/useTheme';

export default function Logo({ className = '' }: { className?: string }) {
  const { isDark } = useTheme();

  return (
    <div className={`${className} [&_path]:fill-primary-600 [&_text]:font-semibold ${isDark ? '[&_text]:fill-white' : '[&_text]:fill-black'}`}>
      <img src="/images/logo.svg" alt="Property AI" className="w-full h-full" />
    </div>
  );
} 

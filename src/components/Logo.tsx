import { Link } from 'react-router';
import { cn } from '../lib/utils';
import { brandAssets } from '../config';

type LogoSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-7 sm:h-8 max-w-[140px] sm:max-w-[160px]',
  md: 'h-9 sm:h-11 max-w-[180px] sm:max-w-[220px]',
  lg: 'h-11 sm:h-14 max-w-[220px] sm:max-w-[280px]',
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
  linkTo?: string | null;
  glow?: boolean;
}

export default function Logo({
  size = 'md',
  className,
  linkTo = '/',
  glow = true,
}: LogoProps) {
  const image = (
    <img
      src={brandAssets.logo}
      alt={brandAssets.logoAlt}
      width={280}
      height={157}
      className={cn(
        'w-auto object-contain object-left',
        sizeClasses[size],
        glow && 'logo-glow',
        className
      )}
      decoding="async"
    />
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-flex shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded-sm"
        aria-label={brandAssets.logoAlt}
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0">{image}</span>;
}

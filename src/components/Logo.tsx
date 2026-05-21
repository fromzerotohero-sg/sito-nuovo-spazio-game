import { Link } from 'react-router';
import { cn } from '../lib/utils';
import { brandAssets } from '../config';

type LogoSize = 'sm' | 'md' | 'lg';

/** Display height — source is 1024px wide for sharp downscaling */
const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-9 sm:h-10',
  md: 'h-11 sm:h-12',
  lg: 'h-14 sm:h-16',
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
  linkTo?: string | null;
}

export default function Logo({
  size = 'md',
  className,
  linkTo = '/',
}: LogoProps) {
  const image = (
    <img
      src={brandAssets.logo}
      srcSet={`${brandAssets.logo} 1x, ${brandAssets.logo2x} 2x`}
      alt={brandAssets.logoAlt}
      width={1024}
      height={576}
      className={cn(
        'logo-blend w-auto max-w-[min(72vw,280px)] object-contain object-left',
        sizeClasses[size],
        className
      )}
      decoding="async"
      fetchPriority="high"
    />
  );

  const wrapperClass =
    'inline-flex shrink-0 items-center bg-transparent [isolation:isolate]';

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={cn(
          wrapperClass,
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded-sm'
        )}
        aria-label={brandAssets.logoAlt}
      >
        {image}
      </Link>
    );
  }

  return <span className={wrapperClass}>{image}</span>;
}

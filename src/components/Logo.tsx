import { Link } from 'react-router';
import { cn } from '../lib/utils';
import { brandAssets } from '../config';

type LogoSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-8 sm:h-9 w-auto max-w-[min(46vw,200px)]',
  md: 'h-10 sm:h-12 w-auto max-w-[min(52vw,240px)]',
  lg: 'h-12 sm:h-16 w-auto max-w-[280px]',
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
  glow = false,
}: LogoProps) {
  const image = (
    <picture>
      <source srcSet={brandAssets.logoWebp} type="image/webp" />
      <img
        src={brandAssets.logo}
        alt={brandAssets.logoAlt}
        width={769}
        height={126}
        className={cn(
          'object-contain object-left bg-transparent',
          sizeClasses[size],
          glow && 'logo-glow',
          className
        )}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-flex shrink-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded-sm"
        aria-label={brandAssets.logoAlt}
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 bg-transparent">{image}</span>;
}

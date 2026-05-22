import { Link } from 'react-router';
import { cn } from '../lib/utils';
import { brandAssets } from '../config';
import { useSiteAsset } from '../context/SiteAssetsProvider';

type LogoSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-9 sm:h-10',
  md: 'h-11 sm:h-14',
  lg: 'h-14 sm:h-[4.5rem]',
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
  const logoSrc = useSiteAsset('brand.logo', brandAssets.logo);
  const image = (
    <img
      src={logoSrc}
      srcSet={`${logoSrc} 1x, ${logoSrc} 2x`}
      alt={brandAssets.logoAlt}
      className={cn(
        'w-auto max-w-[min(78vw,300px)] object-contain object-left',
        sizeClasses[size],
        className
      )}
      decoding="async"
      fetchPriority="high"
    />
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded-sm"
        aria-label={brandAssets.logoAlt}
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}

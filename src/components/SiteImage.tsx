import { useSiteAsset } from '../context/SiteAssetsProvider';

type SiteImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  assetKey: string;
  fallback: string;
};

export default function SiteImage({ assetKey, fallback, src, ...props }: SiteImageProps) {
  const resolved = useSiteAsset(assetKey, fallback);
  return <img {...props} src={src ?? resolved} />;
}

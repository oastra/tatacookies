import Image from "next/image";
import Link from "next/link";

const Logo = ({ className = "" }) => (
  <Link href="/" className={`shrink-0 ${className}`}>
    <Image
      src="/images/LogoTataCookies.svg"
      alt="Tatacookies logo"
      width={80}
      height={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </Link>
);

export default Logo;

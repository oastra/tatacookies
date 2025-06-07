import Image from "next/image";
import Link from "next/link";

const Logo = ({ className = "" }) => (
  <Link href="/" className={`shrink-0 ${className}`}>
    <Image
      src="/images/LogoTataCookies.svg"
      alt="Tatacookies logo"
      width={50}
      height={50}
    />
  </Link>
);

export default Logo;

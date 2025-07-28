import Link from "next/link";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Best sellers", href: "/#best-sellers" },
  { label: "About Us", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Review", href: "/#review" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
];

const NavLinks = ({ isMobile = false, onLinkClick }) => (
  <div className="text-base flex flex-col items-center gap-6 mb-6 md:flex-row md:flex-wrap md:justify-center md:gap-x-10 md:mb-0 lg:ml-6 lg:justify-start lg:gap-6">
    {navLinks.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        onClick={onLinkClick}
        className="hover:text-primary transition"
      >
        {label}
      </Link>
    ))}
  </div>
);

export default NavLinks;

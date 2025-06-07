import Link from "next/link";

const navLinks = [
  { label: "Shop", href: "#" },
  { label: "Best sellers", href: "#best-sellers" },
  { label: "About Us", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Review", href: "#review" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const NavLinks = ({ isMobile = false }) => (
  <div
    className={`${
      isMobile
        ? "flex flex-col items-center gap-6 mb-6"
        : "flex items-center gap-6 ml-6"
    } text-base`}
  >
    {navLinks.map(({ label, href }) => (
      <Link key={label} href={href} className="hover:text-primary transition">
        {label}
      </Link>
    ))}
  </div>
);

export default NavLinks;

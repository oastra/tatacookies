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

const NavLinksFooter = () => (
  <div className="text-base flex flex-col items-end md:items-center gap-3 mb-6 md:flex-col md:flex-wrap md:justify-center md:gap-x-10 md:mb- lg:flex-row lg:ml-6 lg:justify-start lg:gap-6">
    {navLinks.map(({ label, href }) => (
      <Link key={label} href={href} className="hover:text-primary transition">
        {label}
      </Link>
    ))}
  </div>
);

export default NavLinksFooter;

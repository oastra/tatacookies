import Link from "next/link";
import InstagramIcon from "../icons/InstagramIcon";
import BasketFillIcon from "../icons/BasketFillIcon";
import PhoneIcon from "../icons/PhoneIcon";
import { useCart } from "@/context/CartContext";

const NavRightIcons = ({ excludeId, onlyId, isMobile = false }) => {
  const { cartCount, setCartOpen } = useCart();

  const handleCartClick = (e) => {
    e.preventDefault();
    setCartOpen(true);
  };

  const allIcons = [
    {
      id: "instagram",
      icon: (
        <InstagramIcon className="text-title hover:text-primary transition" />
      ),
      href: "https://www.instagram.com/tatacookies.au/",
      external: true,
    },
    {
      id: "phone",
      icon: (
        <span className="flex items-center gap-1">
          <PhoneIcon className="text-title" />
          +61 412 345 678
        </span>
      ),
      href: "tel:+61412345678",
    },
    {
      id: "basket",
      icon: (
        <span className="relative">
          <BasketFillIcon className="text-title hover:text-primary transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary1 text-white text-[11px] font-medium rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </span>
      ),
      href: "#cart",
      onClick: handleCartClick,
    },
  ];

  let filteredIcons = allIcons;

  if (onlyId) {
    filteredIcons = allIcons.filter((icon) => icon.id === onlyId);
  } else if (excludeId) {
    filteredIcons = allIcons.filter((icon) => icon.id !== excludeId);
  }

  return (
    <div
      className={`${
        isMobile ? "flex flex-col items-center" : "flex items-center gap-6"
      }`}
    >
      {filteredIcons.map(({ id, href, icon, external, onClick }) =>
        onClick ? (
          <button
            key={id}
            onClick={onClick}
            className="hover:text-primary transition"
          >
            {icon}
          </button>
        ) : (
          <Link
            key={id}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="hover:text-primary transition"
          >
            {icon}
          </Link>
        )
      )}
    </div>
  );
};

export default NavRightIcons;

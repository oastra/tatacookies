import Link from "next/link";
import InstagramIcon from "../icons/InstagramIcon";
import BasketFillIcon from "../icons/BasketFillIcon";
import PhoneIcon from "../icons/PhoneIcon";

const iconLinks = [
  {
    id: "instagram",
    icon: <InstagramIcon className="text-title" />,
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
    icon: <BasketFillIcon className="text-title" />,
    href: "#cart",
    external: true,
  },
];

const NavRightIcons = ({ excludeId, onlyId, isMobile = false }) => {
  const allIcons = [
    {
      id: "instagram",
      icon: <InstagramIcon className="text-title" />,
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
      icon: <BasketFillIcon className="text-title" />,
      href: "#cart",
      external: true,
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
      {filteredIcons.map(({ id, href, icon, external }) => (
        <Link
          key={id}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="hover:text-primary transition"
        >
          {icon}
        </Link>
      ))}
    </div>
  );
};

export default NavRightIcons;

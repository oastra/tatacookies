import Link from "next/link";
import clsx from "clsx";

const PlainButtonLink = ({ href, children, className = "", ...props }) => {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center px-6  text-title hover:underline transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PlainButtonLink;

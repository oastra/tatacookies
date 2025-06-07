import clsx from "clsx";

const ButtonOrLink = ({
  isLink = false,
  href = "#",
  target,
  rel,
  children,
  onClick,
  className = "",
  type = "button",
}) => {
  const commonStyles = clsx(
    "flex items-center px-8 py-[18px] justify-center text-button rounded-full transition hover:opacity-90",
    !className.includes("w-") &&
      !className.includes("min-w-") &&
      "min-w-[280px]",
    className
  );
  return isLink ? (
    <a href={href} target={target} rel={rel} className={commonStyles}>
      {children}
    </a>
  ) : (
    <button type={type} onClick={onClick} className={commonStyles}>
      {children}
    </button>
  );
};

export default ButtonOrLink;

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
  const commonStyles = `${className} flex items-center px-8 py-[18px] justify-center text-button rounded-full transition hover:opacity-90 min-w-[280px]`;

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

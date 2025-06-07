const PrevButton = ({ className = "" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-colors duration-300`}
    role="button"
    aria-label="Previous slide"
  >
    {/* Background follows fill-current → controlled by button wrapper */}
    <rect
      x="0.75"
      y="0.75"
      width="46.5"
      height="46.5"
      rx="23.25"
      fill="currentColor"
    />

    {/* Border follows stroke-current */}
    <rect
      x="0.75"
      y="0.75"
      width="46.5"
      height="46.5"
      rx="23.25"
      className="stroke-current"
      strokeWidth="1.5"
    />

    {/* Arrow: stroke-current = white by default, changes on hover */}
    <path
      d="M29.25 13.5L18.75 24L29.25 34.5"
      className="stroke-current"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PrevButton;

const NextButton = ({ className = "" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-colors duration-300`}
    role="button"
    aria-label="Next slide"
  >
    <rect
      x="0.75"
      y="0.75"
      width="46.5"
      height="46.5"
      rx="23.25"
      fill="currentColor"
    />
    <rect
      x="0.75"
      y="0.75"
      width="46.5"
      height="46.5"
      rx="23.25"
      className="stroke-current"
      strokeWidth="1.5"
    />
    <path
      d="M18.75 13.5L29.25 24L18.75 34.5"
      className="stroke-current"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default NextButton;

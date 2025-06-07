const PagerIcon = ({ className = "" }) => (
  <svg
    width="112"
    height="48"
    viewBox="0 0 112 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Pager"
  >
    <rect
      x="0.75"
      y="0.75"
      width="46.5"
      height="46.5"
      rx="23.25"
      fill="white"
    />
    <rect
      x="0.75"
      y="0.75"
      width="46.5"
      height="46.5"
      rx="23.25"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <path
      d="M29.25 13.5L18.75 24L29.25 34.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect x="64" width="48" height="48" rx="24" fill="currentColor" />
    <path
      d="M82.75 34.5L93.25 24L82.75 13.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PagerIcon;

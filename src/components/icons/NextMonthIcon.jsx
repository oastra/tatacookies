const NextMonthIcon = ({ className = "", ...props }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" fill="white" />
    <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" stroke="#DCDCDD" />
    <g clipPath="url(#clip0_2057_4326)">
      <path
        d="M16.5409 12.0917L21.5498 16.9667M21.5498 16.9667L16.5409 21.8417M21.5498 16.9667L11.7998 16.9667"
        stroke="#969696"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2057_4326">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="translate(10 10)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default NextMonthIcon;

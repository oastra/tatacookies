const CalendarIcon = ({ className = "", ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M16.5 5V3"
      stroke="#46494C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 5V3"
      stroke="#46494C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.25 8H20.75"
      stroke="#46494C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10.0444C3 7.92869 3 6.87081 3.43597 6.0627C3.81947 5.35187 4.43139 4.77394 5.18404 4.41175C6.03968 4 7.15979 4 9.4 4H14.6C16.8402 4 17.9603 4 18.816 4.41175C19.5686 4.77394 20.1805 5.35187 20.564 6.0627C21 6.87081 21 7.92869 21 10.0444V14.9556C21 17.0713 21 18.1292 20.564 18.9373C20.1805 19.6481 19.5686 20.2261 18.816 20.5882C17.9603 21 16.8402 21 14.6 21H9.4C7.15979 21 6.03968 21 5.18404 20.5882C4.43139 20.2261 3.81947 19.6481 3.43597 18.9373C3 18.1292 3 17.0713 3 14.9556V10.0444Z"
      stroke="#46494C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CalendarIcon;

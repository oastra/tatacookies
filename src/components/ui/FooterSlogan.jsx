const FooterSlogan = () => {
  return (
    <svg
      viewBox="0 0 468 143"
      width="468"
      height="143"
      xmlns="http://www.w3.org/2000/svg"
      className="block overflow-visible"
    >
      <defs>
        <path
          id="tata-curve"
          d="M0,40 C100,130 368,130 468,40"
          fill="transparent"
        />
        <linearGradient id="tataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF66C4" />
          <stop offset="100%" stopColor="#FFDC5B" />
        </linearGradient>
      </defs>

      <text
        fontSize="20"
        fontWeight="bold"
        fontFamily="Satoshi, sans-serif"
        fill="url(#tataGradient)"
      >
        <textPath href="#tata-curve" startOffset="0%" textAnchor="start">
          "TATACOOKIES — cookies that make you smile!"
        </textPath>
      </text>
    </svg>
  );
};

export default FooterSlogan;

import { useEffect, useState } from "react";

const FooterSlogan = () => {
  const [fontSize, setFontSize] = useState(20);
  const [svgWidth, setSvgWidth] = useState(468);
  const [curvePath, setCurvePath] = useState("M0,40 C100,130 368,130 468,40");

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setFontSize(16);
        setSvgWidth(324);
        setCurvePath("M0,40 C70,120 250,120 324,40"); // Mobile - softer curve
      } else if (width < 1024) {
        setFontSize(24);
        setSvgWidth(557);
        setCurvePath("M0,40 C100,140 457,140 557,40"); // Tablet - steeper curve
      } else {
        setFontSize(20);
        setSvgWidth(468);
        setCurvePath("M0,40 C100,130 368,130 468,40"); // Desktop - original
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${svgWidth} 143`}
      width={svgWidth}
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="block overflow-visible"
    >
      <defs>
        <path id="tata-curve" d={curvePath} fill="transparent" />
        <linearGradient id="tataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF66C4" />
          <stop offset="100%" stopColor="#FFDC5B" />
        </linearGradient>
      </defs>

      <text
        fontSize={fontSize}
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

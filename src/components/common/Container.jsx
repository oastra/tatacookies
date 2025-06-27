const Container = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full max-w-[1440px] px-[12px] md:px-[18px] md:px-[32px] lg:px-[100px] mx-auto  ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;

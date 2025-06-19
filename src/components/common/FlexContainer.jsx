const FlexContainer = ({ children, className = "" }) => {
  return <div className={`flex ${className}`}>{children}</div>;
};
export default FlexContainer;

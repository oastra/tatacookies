const SectionTitle = ({ children, className = "" }) => {
  return (
    <h2
      className={`text-mobTitle sm:text-h2 md:text-titleDesktop font-bold mb-8 ${className}`}
    >
      {children}
    </h2>
  );
};
export default SectionTitle;

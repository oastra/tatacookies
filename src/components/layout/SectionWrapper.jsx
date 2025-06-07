import Container from "./Container";
import { forwardRef } from "react";

const SectionWrapper = ({ children, className = "", bg = "" }) => {
  return (
    <section
      className={`${bg} w-full pt-[70px] pb-[90px] md:pt-[80px] md:pb-[100px] lg:pt-[110px] lg:pb-[120px]`}
    >
      <Container className={className}>{children}</Container>
    </section>
  );
};

export default SectionWrapper;

import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTitle from "@/components/layout/SectionTitle";
import ContactInfo from "../ui/ContactInfo";
import ContactForm from "../ui/ContactForm";
import ContactImage from "../ui/ContactImage";

const ContactSection = () => {
  return (
    <SectionWrapper id="contact" bg="bg-white">
      <SectionTitle className="text-title3 text-center mb-10">
        Let’s stay in touch!
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="text-base text-text text-center bg-bgBlue rounded-[20px] p-6 lg:text-left md:col-span-7">
          <ContactInfo />
          <ContactImage />
        </div>
        <div className="bg-bgBlue rounded-[20px] p-6 md:col-span-5">
          <ContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;

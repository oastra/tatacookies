import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTitle from "@/components/layout/SectionTitle";
import ContactInfo from "../ui/ContactInfo";
import ContactForm from "../ui/ContactForm";
import ContactImage from "../ui/ContactImage";

const ContactSection = () => {
  return (
    <SectionWrapper id="contact">
      <SectionTitle className="text-title2 text-center mb-10">
        Let’s stay in touch!
      </SectionTitle>

      <div className="grid grid-cols-1 justify-center items-center lg:grid-cols-12 gap-6 items-start">
        <div className="flex flex-col gap-6 lg:gap-0 text-base text-text text-center lg:bg-bgBlue rounded-[20px] lg:p-6 lg:text-left lg:col-span-7">
          <ContactInfo />
          <ContactImage />
        </div>
        <div className="bg-bgBlue rounded-[20px] p-6 lg:col-span-5">
          <ContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;

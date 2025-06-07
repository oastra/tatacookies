import { useState } from "react";
import ButtonOrLink from "../layout/ButtonOrLink";
import VectorIcon from "../icons/VectorIcon";
import ContactModal from "./ContactModal";

const ContactBox = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white text-center rounded-[20px] p-6 shadow-cookie max-w-[288px] mx-auto">
        <h3 className="text-h4 text-title mb-2">More questions?</h3>
        <p className="text-base text-text mb-4">
          Still need help? Contact us via Direct or fill out the contact form -
          we're always happy to help!
        </p>
        <ButtonOrLink
          onClick={() => setOpen(true)}
          className="bg-primary text-text min-w-[220px]"
        >
          Contact Us <VectorIcon className="ml-4" />
        </ButtonOrLink>
      </div>

      {open && <ContactModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default ContactBox;

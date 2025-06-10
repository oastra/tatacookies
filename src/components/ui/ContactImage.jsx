import Image from "next/image";

const ContactImage = () => (
  <div className="relative mx-auto lg:mx-0 ">
    <Image
      src="/images/contact-us.webp"
      alt="Gingerbread Characters"
      width={300}
      height={250}
      className="w-full h-auto"
    />
  </div>
);

export default ContactImage;

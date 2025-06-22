import Image from "next/image";

const ContactImage = () => (
  <div className="relative w-full mx-auto lg:mx-0">
    <Image
      src="/images/contact-us.webp"
      alt="Gingerbread Characters"
      width={400}
      height={300}
      className="w-full h-auto rounded-[20px]"
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ width: "100%", height: "auto" }}
      loading="eager"
    />
  </div>
);

export default ContactImage;

import Image from "next/image";
const ContactInfo = () => (
  <div className="grid grid-cols-4 justify-center items-center h-full  items-stretch lg:grid-cols-7 grid-rows-2 gap-4">
    <div className="hidden lg:block row-span-2 col-span-2 w-[161px] h-[172px] justify-self-center">
      <Image
        src="/images/contact-cookie.webp"
        alt="Cute clay cat holding flowers representing FAQ support"
        width={161}
        height={172}
        className="w-full h-full object-contain "
        priority
      />
    </div>
    <div className="col-span-2 flex flex-col gap-2 px-0 sm:px-4 py-2 lg:p-0 bg-bgBlue rounded-[20px]">
      <p className="text-button text-text60">Phone</p>
      <p className="text-text text-h4">+61475060850</p>
    </div>
    <div className="col-span-4 sm:col-span-2 row-start-1 md:row-start-auto lg:col-span-3 flex flex-col gap-2 px-4 py-2 lg:p-0 bg-bgBlue rounded-[20px]">
      <p className="text-button text-text60">Address</p>
      <p className="text-text text-h4">
        8470 Ridgeview Lane Brooklyn, NY 11213
      </p>
    </div>
    <div className="col-span-2 flex flex-col gap-2 px-4 py-2 lg:p-0 bg-bgBlue rounded-[20px]">
      <p className="text-button text-text60">Social Media</p>
      <p className="text-text text-h4">Instagram</p>
    </div>
    <div className="col-span-4 sm:col-span-2 flex flex-col gap-2 px-4 py-2 lg:p-0 bg-bgBlue rounded-[20px]">
      <p className="text-button text-text60">Email</p>
      <p className="text-text text-h4">tatacookies.au@gmail.com</p>
    </div>
  </div>
);

export default ContactInfo;

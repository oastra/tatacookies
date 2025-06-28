import CustomCookieForm from "@/components/forms/CustomCookieForm";

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-8">
      <div className="w-[375px] pt-6 px-6 pb-[40px] md:w-[576px] lg:w-[1160px] mx-auto bg-bgBlue md:px-[32px] md:py-[28px] lg:px-[100px] lg:py-[64px] sm:p-10 rounded-[20px] ">
        <CustomCookieForm />
      </div>
    </div>
  );
}

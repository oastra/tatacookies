import Logo from "../layout/Logo";
import NavLinks from "../layout/NavLinks";
import Link from "next/link";
import Container from "../layout/Container";
import FooterSlogan from "../ui/FooterSlogan";
import InstagramIcon from "../icons/InstagramIcon";
const Footer = () => {
  return (
    <footer>
      <div className="bg-bgFooter text-white pt-10 pb-6 overflow-visible">
        <Container>
          <div className="grid grid-cols-4 lg:grid-cols-12 grid-rows-[auto_auto] lg:gap-y-[36px] lg:gap-x-4 items-start">
            {/* 1️⃣ Row 1 */}
            {/* Logo: starts at col 1, spans 2 columns and 2 rows */}
            <div className="flex justify-start col-span-2  sm:col-span-0 lg:col-span-2  lg:row-span-1 flex flex-col lg:items-start gap-4">
              <Logo className=" w-[80px] h-[80px]" />
            </div>

            {/* NavLinks: col 3–9 (col-span-7) */}
            <div className="sm:col-span-2 lg:col-span-7 flex flex-col lg:flex-row ">
              <NavLinks />
            </div>

            {/* Instagram icon + phone: col 10–12 (col-span-3) */}
            <div className="col-span-0 lg:flex-col sm:flex-col-reverse lg:col-span-3 flex flex-col sm:items-end gap-4 text-right">
              <InstagramIcon />
              <p className="text-white">Phone: +61 412 345 678</p>
            </div>

            {/* 2️⃣ Row 2 */}
            {/* Footer slogan: starts at col 2, spans 5 columns */}
            <div className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-6 mx-auto translate-y-[-30px]">
              <FooterSlogan />
            </div>

            {/* Acknowledgment: col 7–12 (col-span-6) */}
            <div className="text-center leading-[130%] sm:col-span-4 lg:col-span-5 items-end lg:text-right leading-snug">
              <p className="text-small text-text30">
                We acknowledge the Traditional Owners of Country throughout
                Australia and acknowledge their continuing connection to land,
                waters and community. We pay our respects to the people, the
                cultures and Elders past and present.
              </p>
            </div>
          </div>
        </Container>
      </div>
      {/* Bottom bar */}
      <div className="bg-bgFooter2">
        <Container>
          <div className="py-4 flex flex-col lg:flex-row justify-between items-center text-base text-white gap-2">
            <span>Created by Olha Chernysh, 2025</span>
            <span>All rights reserved.</span>
            <Link
              href="/privacy-policy"
              className="text-base hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

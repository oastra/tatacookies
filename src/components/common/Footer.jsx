import Logo from "../navigation/Logo";
import NavLinksFooter from "../navigation/NavLinksFooter";
import Link from "next/link";
import Container from "./Container";
import FooterSlogan from "../ui/FooterSlogan";
import InstagramIcon from "../icons/InstagramIcon";
import ArrowUpIcon from "../icons/ArrowUpIcon";
const Footer = () => {
  return (
    <footer>
      <div className="bg-bgFooter text-white pt-10 pb-6 overflow-visible">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 grid-rows-[auto_auto] lg:gap-y-[36px] lg:gap-x-4 items-start">
            {/* 1️⃣ Row 1 */}
            {/* Logo: starts at col 1, spans 2 columns and 2 rows */}
            <div className="flex lg:col-span-2  lg:row-span-1 flex-col lg:items-start gap-4">
              <Logo className=" w-[80px] h-[80px]" />
            </div>

            {/* NavLinks: col 3–9 (col-span-7) */}
            <div className="row-span-2 md:col-span-2 flex md:justify-center items-center justify-end lg:col-start-3  lg:col-span-7  lg:flex-row ">
              <NavLinksFooter />
            </div>

            {/* Instagram icon + phone: col 10–12 (col-span-3) */}
            <div className="flex flex-col-reverse justify-start items-start row-start-2 md:row-start-1  md:col-start-4 md:col-span-0 lg:col-start-10 lg:flex-col  lg:col-span-3 md:items-end gap-4 text-right">
              <Link
                href="https://www.instagram.com/tatacookies.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="tel:+61412345678"
                className="text-white hover:text-primary transition"
              >
                Phone: 0412 345 678
              </Link>
            </div>

            {/* 2️⃣ Row 2 */}
            {/* Footer slogan: starts at col 2, spans 5 columns */}
            <div className="col-start-1 col-span-2 md:col-span-4 lg:col-start-2 lg:col-span-6 mx-auto translate-y-[-30px]">
              <FooterSlogan />
            </div>

            {/* Acknowledgment: col 7–12 (col-span-6) */}
            <div className="text-center leading-[130%] col-span-4 lg:col-span-5 items-end lg:text-right leading-snug">
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
          <div className="py-4 flex flex-col sm:flex-row justify-between items-center text-base text-white gap-2">
            <Link
              href="https://olhachernysh.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base hover:text-primary"
            >
              Created by Olha Chernysh
            </Link>

            <Link
              href="/privacy-policy"
              className=" text-base hover:text-primary"
            >
              Privacy Policy | Terms of Service
            </Link>
            <span>All rights reserved, {new Date().getFullYear()}</span>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

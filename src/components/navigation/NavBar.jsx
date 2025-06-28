"use client";
import { useState } from "react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import RightIcons from "./NavRightIcons";
import MenuIcon from "../icons/MenuIcon";
import CloseIcon from "../icons/CloseIcon";
import BasketFillIcon from "../icons/BasketFillIcon";
import ButtonOrLink from "../ui/ButtonOrLink";
import VectorIcon from "../icons/VectorIcon";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false); 
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav
        className="hidden lg:flex justify-between font-base text-text w-full"
        aria-label="Main Navigation"
      >
        <NavLinks />
        <RightIcons />
      </nav>

      {/* Mobile Icons */}
      <div className="lg:hidden flex-1 flex justify-end items-center gap-4">
        <a href="#cart" target="_blank" rel="noopener noreferrer">
          <BasketFillIcon className="text-title" />
        </a>
        <button
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-white flex flex-col px-4 pt-4 pb-8"
          aria-label="Mobile Navigation"
        >
          {/* Top row*/}
          <div className="flex justify-between items-center mb-8 pb-4 ">
            <Logo />
            <button
              onClick={toggleMenu}
              aria-label="Close mobile menu"
              className="text-2xl"
            >
              <CloseIcon />
            </button>
          </div>

          {/* 🔸 Menu content */}
          <div className="flex flex-col items-center gap-6">
            <NavLinks isMobile onLinkClick={closeMenu} />
            <RightIcons onlyId="phone" />
            <RightIcons onlyId="instagram" />
            <ButtonOrLink
              isLink
              href="#contact"
              onClick={closeMenu}
              className="bg-primary text-text hover:bg-primary w-full max-w-[320px] justify-center"
            >
              Contact Us <VectorIcon className="ml-2" />
            </ButtonOrLink>
          </div>
        </nav>
      )}
    </>
  );
};

export default NavBar;

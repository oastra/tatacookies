import Logo from "./Logo";
import NavBar from "./NavBar";
import Container from "./Container";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 py-[8px]">
      <Container className="flex justify-between items-center">
        <Logo />
        <NavBar />
      </Container>
    </header>
  );
};

export default Header;

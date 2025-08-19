import Logo from "../navigation/Logo";
import NavBar from "../navigation/NavBar";
import Container from "@/components/common/Container";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 py-[8px]">
      <Container className="flex justify-between items-center">
        <Logo className="w-[50px] h-[50px]" />
        <NavBar />
      </Container>
    </header>
  );
};

export default Header;

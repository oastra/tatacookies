import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "@/components/shop/CartDrawer";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
};

export default Layout;

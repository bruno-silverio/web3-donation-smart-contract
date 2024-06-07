import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="m-4 d-flex align-items-center justify-content-center">
          <p className="lead">
            Ajude as pessoas a realizar seus sonhos!
          </p>
        </div>
        <div className="p-4 mx-5"></div>
        <Footer />
      </div>
    </>
  );
}

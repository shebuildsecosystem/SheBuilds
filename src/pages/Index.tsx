
import Hero from "@/components/Hero";
import About from "@/components/About";
import Impact from "@/components/Impact";
import Values from "@/components/Values";
import Events from "@/components/Events";
import Sponsors from "@/components/Sponsors";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Partners from "@/components/Partners";
import Ecosystem from "@/components/Ecosystem";

const Index = () => {
  return (
    <main>
      <Hero />
     
      <Values />
      <Events />
      {/* <About /> */}
      {/* <Ecosystem /> */}
      <Impact />
      {/* <Partners /> */}
      {/* <Sponsors />
      <CallToAction /> */}
      <Footer />
    </main>
  );
};

export default Index;

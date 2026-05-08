import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Integracoes from "@/components/Integracoes";
import Problemas from "@/components/Problemas";
import ComoFunciona from "@/components/ComoFunciona";
import Servicos from "@/components/Servicos";
import Beneficios from "@/components/Beneficios";
import Depoimentos from "@/components/Depoimentos";
import Nichos from "@/components/Nichos";
import Sobre from "@/components/Sobre";
import FAQ from "@/components/FAQ";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Integracoes />
        <Problemas />
        <ComoFunciona />
        <Servicos />
        <Beneficios />
        <Depoimentos />
        <Nichos />
        <Sobre />
        <FAQ />
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

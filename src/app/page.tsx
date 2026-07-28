import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problemas from "@/components/Problemas";
import ComoFunciona from "@/components/ComoFunciona";
import Servicos from "@/components/Servicos";
import CrmKanban from "@/components/CrmKanban";
import Beneficios from "@/components/Beneficios";
import Solucao from "@/components/Solucao";
import Nichos from "@/components/Nichos";
import Sobre from "@/components/Sobre";
import PlanosHome from "@/components/PlanosHome";
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
        <Problemas />
        <ComoFunciona />
        <Servicos />
        <CrmKanban />
        <Beneficios />
        <Solucao />
        <Nichos />
        <Sobre />
        <PlanosHome />
        <FAQ />
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Check,
  CalendarCheck,
  CreditCard,
  LayoutGrid,
  UserCheck,
  BellRing,
  BookOpen,
  Clock,
} from "lucide-react";
import ChatMock, { type Bolha } from "./ChatMock";

type Cena = {
  numero: string;
  titulo: string;
  texto: string;
  itens: string[];
  contato: string;
  canal: string;
  mensagens: Bolha[];
};

const cenas: Cena[] = [
  {
    numero: "01",
    titulo: "Responde no ritmo de gente",
    texto:
      "Seu cliente manda três mensagens seguidas e ainda um áudio. O assistente espera ele terminar, entende tudo junto e responde como uma pessoa responderia.",
    itens: [
      "Espera o cliente terminar de escrever antes de responder",
      "Transcreve áudios e lê fotos, prints e documentos",
      "Responde por texto ou por áudio, com a voz da sua marca",
      "Usa emoji na medida certa e sabe a hora de ficar quieto",
    ],
    contato: "Rafael Souza",
    canal: "WhatsApp · Loja Centro",
    mensagens: [
      { t: "cliente", texto: "boa tarde" },
      { t: "cliente", texto: "vi um sofá no site de vocês" },
      { t: "audio", de: "cliente", duracao: "0:11", transcricao: "queria saber se entrega em Aparecida e quanto sai o frete" },
      { t: "ia", texto: "Boa tarde, Rafael! Entregamos em Aparecida sim 👍" },
      { t: "audio", de: "ia", duracao: "0:14" },
    ],
  },
  {
    numero: "02",
    titulo: "Resolve, não fica só informando",
    texto:
      "Agendar, cobrar, mover o lead: o assistente usa as ferramentas do seu negócio de verdade. Ele gera o link de pagamento e, quando o cliente paga, retoma a conversa sozinho.",
    itens: [
      "Agenda, remarca e cancela direto na sua agenda",
      "Monta orçamento e envia link de pagamento na conversa",
      "Move o card de etapa no CRM Kanban automaticamente",
      "Consulta e registra dados no seu sistema por integração",
    ],
    contato: "Júlia Antunes",
    canal: "WhatsApp · Estúdio Pilates",
    mensagens: [
      { t: "cliente", texto: "quero fechar o plano trimestral" },
      {
        t: "card",
        titulo: "Plano trimestral",
        icon: CreditCard,
        linhas: ["3x de R$ 289 no cartão", "Link de pagamento seguro", "Primeira aula na terça, 7h"],
      },
      { t: "sistema", texto: "Pagamento confirmado", icon: Check },
      { t: "ia", texto: "Recebido, Júlia! Já garanti sua vaga na terça às 7h 🎉" },
      { t: "sistema", texto: "Card movido para Cliente ativo no CRM", icon: LayoutGrid },
    ],
  },
  {
    numero: "03",
    titulo: "Fala do seu negócio, sem inventar",
    texto:
      "As respostas saem do material que você entregou: catálogo, tabela de preços, políticas e o jeito da casa. Quando o assistente não tem certeza, ele confirma com o time em vez de chutar.",
    itens: [
      "Treinado com seu catálogo, seus preços e suas regras",
      "Aceita PDF, Word, planilha e o conteúdo do seu site",
      "Sem certeza, ele confirma com uma pessoa antes de responder",
      "Você aprova tudo que entra na base de conhecimento",
    ],
    contato: "Camila Reis",
    canal: "WhatsApp · Imobiliária",
    mensagens: [
      { t: "cliente", texto: "o apartamento do Setor Bueno aceita financiamento?" },
      { t: "ia", texto: "Aceita sim, Camila. Entrada mínima de 20% e financiamento pela Caixa ou Itaú." },
      { t: "sistema", texto: "Fonte: Tabela de condições 2026", icon: BookOpen },
      { t: "cliente", texto: "e o condomínio, quanto é?" },
      { t: "ia", texto: "Esse valor eu prefiro confirmar com o corretor para não te passar número errado. Já pedi para ele e te respondo ainda hoje 😉" },
    ],
  },
  {
    numero: "04",
    titulo: "Sabe a hora de chamar uma pessoa",
    texto:
      "Caso delicado, negociação ou cliente irritado? O assistente encerra com educação, deixa um resumo do que aconteceu e entrega para a pessoa certa do seu time.",
    itens: [
      "Transfere para a pessoa ou o time certo, com resumo do caso",
      "Enquanto um humano atende, o assistente fica em silêncio",
      "Devolve para a IA com um clique, sem perder o histórico",
      "Regras claras do que ele nunca decide sozinho",
    ],
    contato: "Marcos Vieira",
    canal: "WhatsApp · Financeiro",
    mensagens: [
      { t: "cliente", texto: "paguei ontem e o sistema continua bloqueado, já é a segunda vez" },
      { t: "ia", texto: "Sinto muito pelo transtorno, Marcos. Vou chamar agora a Ana do financeiro para resolver isso com você." },
      {
        t: "card",
        titulo: "Resumo para o time",
        icon: UserCheck,
        linhas: ["Pagamento em 27/07, acesso bloqueado", "Segunda ocorrência do cliente", "Prioridade alta"],
      },
      { t: "sistema", texto: "Conversa transferida para Ana · Financeiro", icon: UserCheck },
      { t: "sistema", texto: "Assistente em silêncio enquanto o time atende", icon: Clock },
    ],
  },
  {
    numero: "05",
    titulo: "Não deixa o cliente esfriar",
    texto:
      "Sumiu no meio da conversa? O assistente retoma em etapas, só dentro do seu horário de atendimento, e sabe a hora de parar de insistir. Lembretes de agendamento saem sozinhos.",
    itens: [
      "Retoma quem sumiu, em etapas e sem soar insistente",
      "Lembretes de agendamento com confirmação de presença",
      "Respeita o seu horário de atendimento e a janela de 24h",
      "Você define quantas tentativas e quando ele deve parar",
    ],
    contato: "Patrícia Nunes",
    canal: "WhatsApp · Consultório",
    mensagens: [
      { t: "sistema", texto: "Sem resposta há 2 dias", icon: Clock },
      { t: "ia", texto: "Oi, Patrícia! Passando para saber se você ainda quer a consulta de quinta 😊" },
      { t: "cliente", texto: "quero sim! esqueci de responder" },
      {
        t: "card",
        titulo: "Consulta confirmada",
        icon: CalendarCheck,
        linhas: ["Quinta, 14h", "Dra. Helena", "Lembrete 1 dia antes"],
      },
      { t: "sistema", texto: "Lembrete programado para quarta, 14h", icon: BellRing },
    ],
  },
];

export default function Cenas() {
  return (
    <section id="cenas" className="relative overflow-hidden bg-dark-base py-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #00ab7a 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Na prática</p>
          <h2 className="mt-4 text-3xl font-bold text-dark-text md:text-4xl">
            Veja o assistente <span className="text-gradient-primary">trabalhando</span>
          </h2>
          <p className="mt-4 text-dark-muted">
            Cinco situações do dia a dia de quem atende no WhatsApp. As conversas abaixo
            são exemplos do que o seu assistente faz depois de treinado.
          </p>
        </motion.div>

        <div className="mt-20 space-y-24">
          {cenas.map((cena, i) => {
            const invertido = i % 2 === 1;
            return (
              <div
                key={cena.numero}
                className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className={invertido ? "lg:order-2" : ""}
                >
                  <p className="font-mono text-sm text-primary">{cena.numero}</p>
                  <h3 className="mt-3 text-2xl font-bold text-dark-text md:text-3xl">{cena.titulo}</h3>
                  <p className="mt-4 leading-relaxed text-dark-muted">{cena.texto}</p>

                  <ul className="mt-7 space-y-3">
                    {cena.itens.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-dark-muted">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <div className={invertido ? "lg:order-1" : ""}>
                  <ChatMock contato={cena.contato} canal={cena.canal} mensagens={cena.mensagens} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

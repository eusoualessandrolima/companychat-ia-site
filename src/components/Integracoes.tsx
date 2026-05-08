"use client";

const row1 = [
  { nome: "WhatsApp Business", cor: "#25D366" },
  { nome: "OpenAI GPT-4o",     cor: "#10a37f" },
  { nome: "Instagram",         cor: "#E1306C" },
  { nome: "n8n Automação",     cor: "#ea4b71" },
  { nome: "Chatwoot",          cor: "#1f93ff" },
  { nome: "HubSpot CRM",       cor: "#ff7a59" },
  { nome: "Google Agenda",     cor: "#4285F4" },
  { nome: "Webhooks API",      cor: "#6366f1" },
];

const row2 = [
  { nome: "Make (Integromat)", cor: "#6d28d9" },
  { nome: "Zapier",            cor: "#ff4a00" },
  { nome: "Typebot",           cor: "#0ea5e9" },
  { nome: "Twilio",            cor: "#f22f46" },
  { nome: "Notion",            cor: "#ffffff" },
  { nome: "Slack",             cor: "#4a154b" },
  { nome: "Stripe",            cor: "#635bff" },
  { nome: "Meta Ads",          cor: "#1877f2" },
];

function LogoPill({ nome, cor }: { nome: string; cor: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-dark-border bg-dark-elevated px-5 py-2.5 transition-colors hover:border-primary/30">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: cor }}
      />
      <span className="whitespace-nowrap text-sm font-medium text-dark-muted">
        {nome}
      </span>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: typeof row1;
  direction: "left" | "right";
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex w-max gap-3 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {doubled.map((item, i) => (
          <LogoPill key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function Integracoes() {
  return (
    <section className="relative overflow-hidden bg-dark-surface py-16">
      {/* subtle top/bottom gradient borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-dark-muted">
          Integra com as ferramentas que você já usa
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow items={row1} direction="left"  />
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  );
}

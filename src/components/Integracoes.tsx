"use client";

import { motion } from "framer-motion";

/* ─── Integration data ──────────────────────────────── */
const INNER_LOGOS = [
  { label: "WhatsApp", abbr: "WA", color: "#25D366", angle: 90  },
  { label: "GPT-4o",   abbr: "AI", color: "#10a37f", angle: 210 },
  { label: "Chatwoot", abbr: "CW", color: "#1f93ff", angle: 330 },
];

const OUTER_LOGOS = [
  { label: "n8n",       abbr: "N8", color: "#ea4b71", angle: 30  },
  { label: "HubSpot",   abbr: "HS", color: "#ff7a59", angle: 100 },
  { label: "Instagram", abbr: "IG", color: "#E1306C", angle: 165 },
  { label: "Stripe",    abbr: "ST", color: "#635bff", angle: 235 },
  { label: "Meta Ads",  abbr: "FB", color: "#1877f2", angle: 300 },
  { label: "Google",    abbr: "GG", color: "#4285F4", angle: 15  },
];

const FLOAT_ANIMS = [
  "animate-badge-float-1",
  "animate-badge-float-2",
  "animate-badge-float-3",
  "animate-badge-float-4",
  "animate-badge-float-5",
];

/* ─── Orbital Diagram ───────────────────────────────── */
const SIZE   = 420;   // container px
const CX     = SIZE / 2;
const R_IN   = 118;   // inner orbit radius
const R_OUT  = 185;   // outer orbit radius

function toXY(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + r * Math.cos(rad),
    y: CX + r * Math.sin(rad),
  };
}

function LogoBubble({
  abbr,
  color,
  size = 40,
  floatClass = "",
}: {
  abbr: string;
  color: string;
  size?: number;
  floatClass?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white shadow-lg shadow-black/40 ${floatClass}`}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.28 }}
    >
      {abbr}
    </div>
  );
}

function OrbitalDiagram() {
  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Outer ring (decorative) */}
      <div
        className="absolute rounded-full border border-dark-border/50"
        style={{
          width:  R_OUT * 2,
          height: R_OUT * 2,
          left:   CX - R_OUT,
          top:    CX - R_OUT,
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute rounded-full border border-dark-border/70"
        style={{
          width:  R_IN * 2,
          height: R_IN * 2,
          left:   CX - R_IN,
          top:    CX - R_IN,
        }}
      />

      {/* Orbit dots on rings */}
      {[R_IN, R_OUT].map((r, ri) => (
        <div
          key={ri}
          className={ri === 0 ? "animate-orbit-cw-fast" : "animate-orbit-ccw"}
          style={{
            position:  "absolute",
            width:     r * 2,
            height:    r * 2,
            left:      CX - r,
            top:       CX - r,
            borderRadius: "50%",
          }}
        >
          <div
            className="absolute h-2.5 w-2.5 rounded-full bg-primary/50"
            style={{ top: 0, left: "50%", transform: "translate(-50%,-50%)" }}
          />
        </div>
      ))}

      {/* Inner logos */}
      {INNER_LOGOS.map((logo, i) => {
        const { x, y } = toXY(R_IN, logo.angle);
        return (
          <div
            key={logo.label}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${FLOAT_ANIMS[i % FLOAT_ANIMS.length]}`}
            style={{ left: x, top: y }}
            title={logo.label}
          >
            <LogoBubble abbr={logo.abbr} color={logo.color} size={40} />
          </div>
        );
      })}

      {/* Outer logos */}
      {OUTER_LOGOS.map((logo, i) => {
        const { x, y } = toXY(R_OUT, logo.angle);
        return (
          <div
            key={logo.label}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${FLOAT_ANIMS[(i + 2) % FLOAT_ANIMS.length]}`}
            style={{ left: x, top: y }}
            title={logo.label}
          >
            <LogoBubble abbr={logo.abbr} color={logo.color} size={36} />
          </div>
        );
      })}

      {/* Center hub */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: CX, top: CX }}
      >
        {/* Pulse ring */}
        <div className="animate-pulse-ring absolute inset-0 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40" />
        {/* Hub circle */}
        <div className="flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-dark-elevated text-center">
          <div>
            <span className="block text-[10px] font-bold leading-tight text-primary">Company</span>
            <span className="block text-[10px] font-bold leading-tight text-primary">Chat IA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile fallback: simple pill grid ─────────────── */
const ALL_LOGOS = [...INNER_LOGOS, ...OUTER_LOGOS];

/* ─── Integracoes section ───────────────────────────── */
export default function Integracoes() {
  return (
    <section className="relative overflow-hidden bg-dark-surface py-20">
      {/* Border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-dark-text md:text-4xl">
              Integrações com as{" "}
              <span className="text-primary">principais plataformas</span>.
            </h2>
            <p className="mt-4 leading-relaxed text-dark-muted">
              Conecte o assistente IA com as ferramentas que você já usa.
              Troque informações em tempo real e consiga mais conversões
              pelo WhatsApp.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { num: "9+",  label: "Integrações nativas" },
                { num: "API", label: "Abertas para qualquer sistema" },
                { num: "24h", label: "Sincronização em tempo real" },
              ].map((s) => (
                <div key={s.num}>
                  <div className="text-2xl font-bold text-dark-text">{s.num}</div>
                  <div className="mt-0.5 text-xs text-dark-muted">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mobile logo grid */}
            <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
              {ALL_LOGOS.map((logo) => (
                <div
                  key={logo.label}
                  className="flex items-center gap-2 rounded-full border border-dark-border bg-dark-elevated px-3 py-1.5"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: logo.color }}
                  />
                  <span className="text-xs font-medium text-dark-muted">{logo.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: orbital diagram (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex lg:justify-center"
          >
            <OrbitalDiagram />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useRef, useState, useCallback } from "react";

/* ─── Data ─────────────────────────────────────────────── */
const INNER_LOGOS = [
  { label: "WhatsApp",  abbr: "WA", color: "#25D366", angle: 90  },
  { label: "GPT-4o",    abbr: "AI", color: "#10a37f", angle: 210 },
  { label: "Chatwoot",  abbr: "CW", color: "#1f93ff", angle: 330 },
];

const OUTER_LOGOS = [
  { label: "n8n",       abbr: "N8", color: "#ea4b71", angle: 30  },
  { label: "HubSpot",   abbr: "HS", color: "#ff7a59", angle: 100 },
  { label: "Instagram", abbr: "IG", color: "#E1306C", angle: 165 },
  { label: "Stripe",    abbr: "ST", color: "#635bff", angle: 235 },
  { label: "Meta Ads",  abbr: "FB", color: "#1877f2", angle: 300 },
  { label: "Google",    abbr: "GG", color: "#4285F4", angle: 15  },
];

const ALL_LOGOS = [...INNER_LOGOS, ...OUTER_LOGOS];

/* ─── Diagram constants ─────────────────────────────────── */
const SIZE  = 480;
const CX    = SIZE / 2;
const R_IN  = 118;
const R_OUT = 192;

const PARTICLES = [
  { r: R_IN,  dur: 7,  start: 0,   sz: 4, clr: "rgba(0,171,122,0.85)",  dir: "cw"  },
  { r: R_IN,  dur: 11, start: 180, sz: 3, clr: "rgba(0,171,122,0.45)",  dir: "cw"  },
  { r: R_OUT, dur: 13, start: 60,  sz: 4, clr: "rgba(59,130,246,0.75)", dir: "ccw" },
  { r: R_OUT, dur: 19, start: 240, sz: 3, clr: "rgba(59,130,246,0.4)",  dir: "ccw" },
] as const;

/* ─── Helpers ───────────────────────────────────────────── */
function toXY(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CX + r * Math.sin(rad) };
}

/* ─── GlassNode ─────────────────────────────────────────── */
function GlassNode({
  abbr, color, label, size, x, y, delay,
}: {
  abbr: string; color: string; label: string;
  size: number; x: number; y: number; delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const scale = useSpring(1, { stiffness: 420, damping: 22 });
  const half = size / 2;

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, width: 0, height: 0 }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Node circle */}
      <motion.div
        style={{
          position: "absolute",
          width: size,
          height: size,
          left: -half,
          top: -half,
          scale,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, ${color}48, ${color}18)`,
          border: `1px solid ${color}65`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "default",
          willChange: "transform",
        }}
        animate={{
          boxShadow: hovered
            ? `0 0 22px 5px ${color}55, inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.5)`
            : `0 0 0 0 ${color}00, inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px rgba(0,0,0,0.4)`,
        }}
        transition={{ boxShadow: { duration: 0.25 } }}
        onHoverStart={() => { scale.set(1.18); setHovered(true);  }}
        onHoverEnd={()   => { scale.set(1.0);  setHovered(false); }}
      >
        <span
          style={{
            fontWeight: 700,
            color: "#ffffff",
            fontSize: size * 0.28,
            letterSpacing: "0.02em",
            userSelect: "none",
          }}
        >
          {abbr}
        </span>
      </motion.div>

      {/* Tooltip — above node */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: half + 10,
              left: 0,
              transform: "translateX(-50%)",
              background: "rgba(8, 12, 18, 0.96)",
              border: `1px solid ${color}50`,
              borderRadius: 7,
              padding: "5px 10px",
              whiteSpace: "nowrap",
              fontSize: 11,
              fontWeight: 600,
              color: "#e4e4e7",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              pointerEvents: "none",
              zIndex: 60,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── OrbitParticle ─────────────────────────────────────── */
function OrbitParticle({
  r, dur, start, sz, clr, dir,
}: { r: number; dur: number; start: number; sz: number; clr: string; dir: "cw" | "ccw" }) {
  const animDelay = `-${((start / 360) * dur).toFixed(3)}s`;
  const animName  = dir === "cw" ? "orbit-cw" : "orbit-ccw";

  return (
    <div
      style={{
        position: "absolute",
        left: CX,
        top: CX,
        width: 0,
        height: 0,
        transformOrigin: "0 0",
        animation: `${animName} ${dur}s linear ${animDelay} infinite`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: r,
          top: 0,
          width: sz,
          height: sz,
          borderRadius: "50%",
          background: clr,
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 ${sz * 2.5}px 1px ${clr}`,
        }}
      />
    </div>
  );
}

/* ─── OrbitalDiagram ────────────────────────────────────── */
function OrbitalDiagram() {
  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: SIZE, height: SIZE, overflow: "visible" }}
    >
      {/* SVG layer: dashed rings + connector lines */}
      <svg
        width={SIZE}
        height={SIZE}
        style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      >
        {/* Inner dashed ring — slow CW rotation animates the dash pattern */}
        <circle
          cx={CX} cy={CX} r={R_IN}
          fill="none"
          stroke="rgba(0,171,122,0.22)"
          strokeWidth={1}
          strokeDasharray="4 6"
          style={{
            transformOrigin: `${CX}px ${CX}px`,
            animation: "orbit-cw 38s linear infinite",
          }}
        />
        {/* Outer dashed ring */}
        <circle
          cx={CX} cy={CX} r={R_OUT}
          fill="none"
          stroke="rgba(59,130,246,0.16)"
          strokeWidth={1}
          strokeDasharray="4 8"
          style={{
            transformOrigin: `${CX}px ${CX}px`,
            animation: "orbit-ccw 55s linear infinite",
          }}
        />
        {/* Hub → inner node connectors */}
        {INNER_LOGOS.map((logo) => {
          const { x, y } = toXY(R_IN, logo.angle);
          return (
            <line
              key={logo.label}
              x1={CX} y1={CX} x2={x} y2={y}
              stroke={logo.color}
              strokeWidth={0.75}
              strokeOpacity={0.22}
              strokeDasharray="3 5"
            />
          );
        })}
        {/* Inner → outer connectors (nearest inner for each outer) */}
        {OUTER_LOGOS.map((outer) => {
          const { x: ox, y: oy } = toXY(R_OUT, outer.angle);
          const inner = INNER_LOGOS.reduce((prev, cur) => {
            const da = (a: number, b: number) =>
              Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
            return da(cur.angle, outer.angle) < da(prev.angle, outer.angle) ? cur : prev;
          });
          const { x: ix, y: iy } = toXY(R_IN, inner.angle);
          return (
            <line
              key={outer.label}
              x1={ix} y1={iy} x2={ox} y2={oy}
              stroke={outer.color}
              strokeWidth={0.6}
              strokeOpacity={0.16}
              strokeDasharray="2 6"
            />
          );
        })}
      </svg>

      {/* Orbit particles (CSS pivot technique) */}
      {PARTICLES.map((p, i) => (
        <OrbitParticle key={i} {...p} />
      ))}

      {/* Inner nodes */}
      {INNER_LOGOS.map((logo, i) => {
        const { x, y } = toXY(R_IN, logo.angle);
        return (
          <GlassNode
            key={logo.label}
            abbr={logo.abbr}
            color={logo.color}
            label={logo.label}
            size={44}
            x={x} y={y}
            delay={0.3 + i * 0.09}
          />
        );
      })}

      {/* Outer nodes */}
      {OUTER_LOGOS.map((logo, i) => {
        const { x, y } = toXY(R_OUT, logo.angle);
        return (
          <GlassNode
            key={logo.label}
            abbr={logo.abbr}
            color={logo.color}
            label={logo.label}
            size={38}
            x={x} y={y}
            delay={0.5 + i * 0.07}
          />
        );
      })}

      {/* Triple-pulse hub (center) */}
      <div style={{ position: "absolute", left: CX, top: CX, width: 0, height: 0 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              left: -40,
              top: -40,
              borderRadius: "50%",
              border: "1px solid rgba(0,171,122,0.35)",
              animation: `pulse-ring 3s cubic-bezier(0,0,0.2,1) ${i * 1}s infinite`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: 72,
            height: 72,
            left: -36,
            top: -36,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 32%, rgba(0,171,122,0.24), rgba(0,171,122,0.07))",
            border: "1px solid rgba(0,171,122,0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 0 40px rgba(0,171,122,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#00ab7a",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            Company<br />Chat IA
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export default function Integracoes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <section
      id="integracoes"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{ backgroundColor: "#07090d", padding: "96px 0", overflow: "visible" }}
    >
      {/* ── Background layers ── */}

      {/* Mouse-reactive ambient light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,171,122,0.055), transparent 55%)`,
          transition: "background 0.4s ease",
        }}
      />

      {/* Static central ambient glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: 700,
          height: 500,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,171,122,0.035) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Fine grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 10%, rgba(0,171,122,0.28) 50%, transparent 90%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 10%, rgba(59,130,246,0.2) 50%, transparent 90%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left panel */}
          <div>
            {/* Eyebrow tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{
                background: "rgba(0,171,122,0.09)",
                border: "1px solid rgba(0,171,122,0.28)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-dot-ping" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#00ab7a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Ecossistema de Integrações
              </span>
            </motion.div>

            {/* Staggered headline */}
            <div className="overflow-hidden">
              {(
                [
                  { text: "Conecte com as",         highlight: false },
                  { text: "principais plataformas", highlight: true  },
                  { text: "do mercado.",             highlight: false },
                ] as { text: string; highlight: boolean }[]
              ).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className={`block font-bold tracking-tight ${
                      line.highlight ? "text-gradient-primary" : "text-dark-text"
                    }`}
                    style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2 }}
                  >
                    {line.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-dark-muted"
              style={{ marginTop: 20, lineHeight: 1.75 }}
            >
              Conecte o assistente IA com as ferramentas que você já usa.
              Troque informações em tempo real e consiga mais conversões pelo WhatsApp.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-8 flex flex-wrap gap-8"
            >
              {[
                { num: "9+",  label: "Integrações nativas"       },
                { num: "API", label: "Para qualquer sistema"     },
                { num: "24h", label: "Sincronização em tempo real" },
              ].map((s) => (
                <div key={s.num}>
                  <div className="text-dark-text" style={{ fontSize: 22, fontWeight: 700 }}>
                    {s.num}
                  </div>
                  <div className="text-dark-muted" style={{ marginTop: 2, fontSize: 12 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mobile logo pills */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-2 lg:hidden"
            >
              {ALL_LOGOS.map((logo) => (
                <div
                  key={logo.label}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: logo.color }}
                  />
                  <span className="text-dark-muted" style={{ fontSize: 12, fontWeight: 500 }}>
                    {logo.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: orbital diagram (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:justify-center"
            style={{ overflow: "visible" }}
          >
            <div
              className="scale-[0.88] xl:scale-100 origin-center"
              style={{ overflow: "visible" }}
            >
              <OrbitalDiagram />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`text-xl font-bold tracking-tight transition-colors ${
        dark ? "text-dark-text" : "text-foreground"
      } ${className}`}
    >
      Company<span className="text-primary">Chat</span>
      <span className="ml-1 rounded-sm bg-primary/10 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
        IA
      </span>
    </span>
  );
}

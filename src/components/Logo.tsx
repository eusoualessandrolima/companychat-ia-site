export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Wordmark */}
      <span
        className={`text-xl font-bold leading-none tracking-tight transition-colors ${
          dark ? "text-dark-text" : "text-foreground"
        }`}
      >
        Company<span className="text-primary">Chat</span>
      </span>

      {/* Badge IA */}
      <span className="inline-flex items-center justify-center rounded-md bg-primary/20 px-2 py-[5px] text-[11px] font-bold uppercase leading-none tracking-widest text-primary ring-1 ring-inset ring-primary/40">
        IA
      </span>
    </span>
  );
}

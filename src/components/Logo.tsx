export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xl font-bold tracking-tight text-foreground ${className}`}>
      Company<span className="text-primary">Chat</span>
      <span className="ml-1 text-xs font-medium text-text-secondary">IA</span>
    </span>
  );
}

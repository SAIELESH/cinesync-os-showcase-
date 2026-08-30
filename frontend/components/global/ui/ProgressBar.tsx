type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold via-accent to-emerald transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

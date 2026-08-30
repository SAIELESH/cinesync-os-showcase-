type SliderProps = {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  markers?: string[];
  onChange: (value: number) => void;
};

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  markers,
  onChange
}: SliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm text-slate-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-sky-300"
      />
      {markers ? (
        <div className="flex justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
          {markers.map((marker) => (
            <span key={marker}>{marker}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

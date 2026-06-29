export default function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 === current
                ? "bg-montaj text-white scale-110"
                : i + 1 < current
                  ? "bg-green-500/20 text-green-400"
                  : "bg-dark-section text-sub-text"
            }`}
          >
            {i + 1 < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-12 h-0.5 rounded ${
                i + 1 < current ? "bg-green-500/50" : "bg-dark-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

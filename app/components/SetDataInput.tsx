'use client';

interface SetData {
  weight: number;
  reps: number;
}

interface SetDataInputProps {
  /** Current weight and reps values */
  data: SetData;
  /** Callback when data changes */
  onChange: (data: SetData) => void;
  /** Visual variant for different contexts */
  variant?: 'single' | 'b2b';
  /** Accent color for focus ring */
  accentColor?: 'orange' | 'purple';
}

/**
 * Reusable weight/reps input component for exercise tracking.
 * Supports two variants:
 * - single: Larger text for main exercise tracking
 * - b2b: Smaller text for superset exercises
 */
export default function SetDataInput({
  data,
  onChange,
  variant = 'single',
  accentColor = 'orange',
}: SetDataInputProps) {
  const isSingle = variant === 'single';
  const ringColor = accentColor === 'orange' ? 'focus:ring-orange-500' : 'focus:ring-purple-500';

  // Variant-specific styles
  const containerGap = isSingle ? 'gap-4' : 'gap-3';
  const padding = isSingle ? 'p-4' : 'p-3';
  const labelSize = isSingle ? 'text-sm' : 'text-xs';
  const labelMargin = isSingle ? 'mb-2' : 'mb-1';
  const inputTextSize = isSingle ? 'text-3xl' : 'text-2xl';

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange({ ...data, weight: 0 });
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange({ ...data, weight: num });
      }
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, reps: parseInt(e.target.value) || 0 });
  };

  return (
    <div className={`grid grid-cols-2 ${containerGap}`}>
      <div className={`bg-zinc-900 rounded-lg ${padding}`}>
        <label className="block">
          <span className={`text-zinc-400 ${labelSize} block ${labelMargin}`}>
            Weight (lbs)
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={data.weight ?? ''}
            onChange={handleWeightChange}
            className={`w-full bg-zinc-800 text-white ${inputTextSize} font-bold text-center rounded p-2 focus:outline-none focus:ring-2 ${ringColor}`}
          />
        </label>
      </div>
      <div className={`bg-zinc-900 rounded-lg ${padding}`}>
        <label className="block">
          <span className={`text-zinc-400 ${labelSize} block ${labelMargin}`}>
            Reps
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={data.reps ?? ''}
            onChange={handleRepsChange}
            className={`w-full bg-zinc-800 text-white ${inputTextSize} font-bold text-center rounded p-2 focus:outline-none focus:ring-2 ${ringColor}`}
          />
        </label>
      </div>
    </div>
  );
}

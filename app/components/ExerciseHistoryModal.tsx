'use client';

import { useEffect, useMemo, useState } from 'react';

type HistoryRange = 'week' | 'month' | 'all';
type WeightMode = 'max' | 'avg';

type HistoryPoint = {
  day: string;
  weight_max: number | null;
  weight_avg: number | null;
  volume: number | null;
  reps_max: number | null;
  reps_avg: number | null;
  reps_total: number | null;
};

type ExerciseHistorySeries = {
  display_mode?: 'weight' | 'reps';
  points: HistoryPoint[];
};

type ExerciseHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  exerciseNames: string[];
  title?: string;
  targets?: Record<string, { weight?: number | null; reps?: number | null }>;
};

const RANGE_LABELS: Record<HistoryRange, string> = {
  week: '1W',
  month: '1M',
  all: 'All',
};

function formatDayLabel(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return day;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Math.round(value).toString();
}

function buildLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function LineChart({
  points,
  weightMode,
  mode,
  targetValue,
}: {
  points: HistoryPoint[];
  weightMode: WeightMode;
  mode: 'weight' | 'reps';
  targetValue?: number | null;
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);
  const width = 720;
  const height = 280;
  const margin = { top: 16, right: 64, bottom: 40, left: 64 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const primaryValues = points
    .map((point) => {
      if (mode === 'reps') {
        return weightMode === 'max' ? point.reps_max : point.reps_avg;
      }
      return weightMode === 'max' ? point.weight_max : point.weight_avg;
    })
    .filter((value): value is number => value !== null);
  const hasTargetValue = Number.isFinite(targetValue as number) && (targetValue as number) > 0;
  if (hasTargetValue) {
    primaryValues.push(targetValue as number);
  }
  const secondaryValues = points
    .map((point) => (mode === 'reps' ? point.reps_total : point.volume))
    .filter((value): value is number => value !== null);

  let primaryMin = primaryValues.length ? Math.min(...primaryValues) : 0;
  let primaryMax = primaryValues.length ? Math.max(...primaryValues) : 1;
  let secondaryMin = secondaryValues.length ? Math.min(...secondaryValues) : 0;
  let secondaryMax = secondaryValues.length ? Math.max(...secondaryValues) : 1;

  if (primaryMax === primaryMin) {
    const pad = Math.max(1, Math.abs(primaryMax) * 0.2);
    primaryMin -= pad;
    primaryMax += pad;
  }
  if (secondaryMax === secondaryMin) {
    const pad = Math.max(1, Math.abs(secondaryMax) * 0.2);
    secondaryMin -= pad;
    secondaryMax += pad;
  }

  const primaryRange = primaryMax - primaryMin || 1;
  const secondaryRange = secondaryMax - secondaryMin || 1;

  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const basePoints = points.map((point, index) => {
    const primaryValue = mode === 'reps'
      ? (weightMode === 'max' ? point.reps_max : point.reps_avg)
      : (weightMode === 'max' ? point.weight_max : point.weight_avg);
    const secondaryValue = mode === 'reps' ? point.reps_total : point.volume;
    const baseX = margin.left + index * stepX;
    const hasPrimary = primaryValue !== null;
    const hasSecondary = secondaryValue !== null;
    const offset = hasPrimary && hasSecondary ? 6 : 0;
    return {
      baseX,
      primaryValue,
      secondaryValue,
      primaryX: baseX - offset,
      secondaryX: baseX + offset
    };
  });

  const primaryPoints = basePoints
    .map((point) => {
      if (point.primaryValue === null) return null;
      const y = margin.top + plotHeight - ((point.primaryValue - primaryMin) / primaryRange) * plotHeight;
      return { x: point.primaryX, y, value: point.primaryValue };
    })
    .filter((point): point is { x: number; y: number; value: number } => point !== null);

  const secondaryPoints = basePoints
    .map((point) => {
      if (point.secondaryValue === null) return null;
      const y = margin.top + plotHeight - ((point.secondaryValue - secondaryMin) / secondaryRange) * plotHeight;
      return { x: point.secondaryX, y, value: point.secondaryValue };
    })
    .filter((point): point is { x: number; y: number; value: number } => point !== null);

  const primaryPath = buildLinePath(primaryPoints.map(({ x, y }) => ({ x, y })));
  const secondaryPath = buildLinePath(secondaryPoints.map(({ x, y }) => ({ x, y })));
  const primaryLabel = mode === 'reps' ? 'Reps' : 'Weight';
  const secondaryLabel = mode === 'reps' ? 'Total Reps' : 'Volume';

  const labelIndexes = points.length <= 1 ? [0] : [0, Math.floor((points.length - 1) / 2), points.length - 1];
  const labelIndexesUnique = Array.from(new Set(labelIndexes)).filter((idx) => points[idx]);

  const tooltipLabel = tooltip?.label || '';
  const tooltipWidth = Math.min(width - 16, Math.max(56, tooltipLabel.length * 7 + 18));
  const tooltipHeight = 24;
  const tooltipX = tooltip
    ? Math.min(Math.max(tooltip.x + 10, 8), width - tooltipWidth - 8)
    : 0;
  const tooltipY = tooltip
    ? Math.max(8, tooltip.y - tooltipHeight - 10)
    : 0;

  const targetY = hasTargetValue
    ? margin.top + plotHeight - (((targetValue as number) - primaryMin) / primaryRange) * plotHeight
    : null;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px]">
        <rect x={0} y={0} width={width} height={height} rx={16} fill="#0f172a" />

        <g stroke="#1f2937" strokeWidth={1}>
          {[0, 0.5, 1].map((ratio) => {
            const y = margin.top + plotHeight - ratio * plotHeight;
            return <line key={ratio} x1={margin.left} y1={y} x2={width - margin.right} y2={y} />;
          })}
        </g>

        {hasTargetValue && targetY !== null && (
          <>
            <line
              x1={margin.left}
              y1={targetY}
              x2={width - margin.right}
              y2={targetY}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 6"
            />
            <text
              x={width - margin.right - 6}
              y={Math.max(margin.top + 12, targetY - 6)}
              fill="#f59e0b"
              fontSize="12"
              textAnchor="end"
            >
              Target {formatNumber(targetValue as number)}
            </text>
          </>
        )}

        <g fill="#94a3b8" fontSize="12">
          <text x={margin.left - 12} y={margin.top + 10} textAnchor="end">
            {formatNumber(primaryMax)}
          </text>
          <text x={margin.left - 12} y={margin.top + plotHeight} textAnchor="end">
            {formatNumber(primaryMin)}
          </text>
          <text x={width - margin.right + 12} y={margin.top + 10} textAnchor="start">
            {formatNumber(secondaryMax)}
          </text>
          <text x={width - margin.right + 12} y={margin.top + plotHeight} textAnchor="start">
            {formatNumber(secondaryMin)}
          </text>
        </g>

        {primaryPath && (
          <path d={primaryPath} fill="none" stroke="#38bdf8" strokeWidth={3} />
        )}
        {secondaryPath && (
          <path d={secondaryPath} fill="none" stroke="#22c55e" strokeWidth={3} />
        )}

        {tooltip && (
          <g>
            <rect
              x={tooltipX}
              y={tooltipY}
              width={tooltipWidth}
              height={tooltipHeight}
              rx={6}
              fill="#111827"
              stroke="#374151"
              strokeWidth={1}
            />
            <text
              x={tooltipX + 9}
              y={tooltipY + 16}
              fill="#e2e8f0"
              fontSize="12"
            >
              {tooltipLabel}
            </text>
          </g>
        )}

        <g fill="#e2e8f0">
          {primaryPoints.map((point, index) => (
            <circle
              key={`w-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#38bdf8"
              onMouseEnter={() => setTooltip({ x: point.x, y: point.y, label: `${primaryLabel}: ${formatNumber(point.value)}` })}
              onMouseMove={() => setTooltip({ x: point.x, y: point.y, label: `${primaryLabel}: ${formatNumber(point.value)}` })}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
          {secondaryPoints.map((point, index) => (
            <circle
              key={`v-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#22c55e"
              onMouseEnter={() => setTooltip({ x: point.x, y: point.y, label: `${secondaryLabel}: ${formatNumber(point.value)}` })}
              onMouseMove={() => setTooltip({ x: point.x, y: point.y, label: `${secondaryLabel}: ${formatNumber(point.value)}` })}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </g>

        <g fill="#94a3b8" fontSize="12">
          {labelIndexesUnique.map((index) => {
            const x = margin.left + index * stepX;
            const label = formatDayLabel(points[index].day);
            return (
              <text key={index} x={x} y={height - 12} textAnchor="middle">
                {label}
              </text>
            );
          })}
        </g>

        <g fill="#94a3b8" fontSize="12">
          <text x={margin.left} y={height - 4} textAnchor="start">
            {primaryLabel}
          </text>
          <text x={width - margin.right} y={height - 4} textAnchor="end">
            {secondaryLabel}
          </text>
        </g>
      </svg>
    </div>
  );
}

function LoadingCard({ name }: { name: string }) {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 animate-pulse">
      <div className="h-5 w-40 bg-zinc-700 rounded mb-4" />
      <div className="h-40 bg-zinc-900 rounded-lg border border-zinc-700" />
      <div className="mt-4 flex justify-between">
        <div className="h-3 w-16 bg-zinc-700 rounded" />
        <div className="h-3 w-16 bg-zinc-700 rounded" />
      </div>
      <div className="mt-2 text-xs text-zinc-500">Loading {name}...</div>
    </div>
  );
}

export default function ExerciseHistoryModal({
  open,
  onClose,
  exerciseNames,
  title = 'Exercise History',
  targets,
}: ExerciseHistoryModalProps) {
  const [range, setRange] = useState<HistoryRange>('month');
  const [weightMode, setWeightMode] = useState<WeightMode>('max');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, ExerciseHistorySeries>>({});

  const namesKey = useMemo(() => exerciseNames.join('|'), [exerciseNames]);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ range });
        exerciseNames.forEach((name) => params.append('name', name));
        const response = await fetch(`/api/exercise-history?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Failed to load exercise history');
        }
        const data = await response.json();
        setHistory(data.history || {});
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setError(err?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    return () => controller.abort();
  }, [open, range, namesKey, exerciseNames]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="text-zinc-400 text-sm">Weight or reps trends</div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as HistoryRange[]).map((value) => (
                <button
                  key={value}
                  onClick={() => setRange(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                    range === value
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                >
                  {RANGE_LABELS[value]}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['max', 'avg'] as WeightMode[]).map((value) => (
                <button
                  key={value}
                  onClick={() => setWeightMode(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                    weightMode === value
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                >
                  {value === 'max' ? 'Max' : 'Avg'}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-zinc-400 text-sm">Loading history...</div>
          )}
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          {!loading && !error && exerciseNames.length === 0 && (
            <div className="text-zinc-500 text-sm">No exercise selected.</div>
          )}

          {loading && exerciseNames.map((name) => (
            <LoadingCard key={`loading-${name}`} name={name} />
          ))}

          {!loading && !error && exerciseNames.map((name) => {
            const series = history[name];
            const points = series?.points || [];
            const explicitMode = series?.display_mode;
            const hasWeight = points.some((point) =>
              (point.weight_max ?? 0) > 0 || (point.weight_avg ?? 0) > 0 || (point.volume ?? 0) > 0
            );
            const hasReps = points.some((point) =>
              (point.reps_max ?? 0) > 0 || (point.reps_avg ?? 0) > 0 || (point.reps_total ?? 0) > 0
            );
            const inferredMode = !explicitMode && !hasWeight && hasReps ? 'reps' : 'weight';
            const mode = explicitMode || inferredMode;
            const targetEntry = targets?.[name];
            const rawTargetValue = mode === 'reps' ? targetEntry?.reps : targetEntry?.weight;
            const targetValue = Number.isFinite(rawTargetValue as number) && (rawTargetValue as number) > 0
              ? (rawTargetValue as number)
              : null;
            return (
              <div key={name} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                  <div className="text-white text-lg font-semibold">{name}</div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      {mode === 'reps' ? 'Reps' : 'Weight'}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      {mode === 'reps' ? 'Total Reps' : 'Volume'}
                    </span>
                    {targetValue !== null && (
                      <span className="flex items-center gap-2">
                        <span className="h-[2px] w-4 border-t border-dashed border-amber-400" />
                        Target
                      </span>
                    )}
                  </div>
                </div>
                {points.length === 0 ? (
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-400">
                    No history yet. Finish a workout with this exercise to populate the graph.
                  </div>
                ) : (
                  <LineChart
                    points={points}
                    weightMode={weightMode}
                    mode={mode}
                    targetValue={targetValue}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

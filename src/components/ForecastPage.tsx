import React, { useState, useId } from 'react';
import { WEATHER_SCENARIOS, generateForecastData, PILOT_METRICS } from '../data/mockGridData';
import { DispatchRecommendation } from '../types/grid';
import {
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  Info,
  Clock,
  Zap,
  TrendingDown,
  Sun,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface ForecastPageProps {
  dispatchActions: DispatchRecommendation[];
  onApproveAction: (id: string) => void;
  onRejectAction: (id: string) => void;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({
  dispatchActions,
  onApproveAction,
  onRejectAction,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('afternoon_storm');
  const [temperature, setTemperature] = useState<number>(18);
  const [scale, setScale] = useState<'feeder_kw' | 'national_mw'>('feeder_kw');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const scenario = WEATHER_SCENARIOS.find(s => s.id === selectedScenarioId) || WEATHER_SCENARIOS[0];
  const hourlyData = generateForecastData(selectedScenarioId, scale);

  // Compute summary stats dynamically
  const isKw = scale === 'feeder_kw';
  const unit = isKw ? 'kWh' : 'MWh';
  const powerUnit = isKw ? 'kW' : 'MW';

  // Calculate historical total, predicted total, and gap in window
  const totalHistorical = Math.round(
    hourlyData.reduce((acc, p) => acc + (isKw ? p.historicalSolarKW : p.historicalSolarMW), 0)
  );

  // Adjust for temperature effect (e.g. PV panel efficiency drops ~0.4% per °C above 25°C, or increases in cold)
  const tempEfficiencyFactor = 1 - (temperature - 18) * 0.005;
  const totalPredicted = Math.round(
    hourlyData.reduce((acc, p) => acc + (isKw ? p.predictedSolarKW : p.predictedSolarMW), 0) * tempEfficiencyFactor
  );

  const weatherEffectPct = Math.round(((totalPredicted - totalHistorical) / totalHistorical) * 100);

  // Energy gap in window
  const windowPoints = hourlyData.filter(p => p.inWindow);
  const gapInWindow = Math.round(
    windowPoints.reduce(
      (acc, p) => acc + (isKw ? p.gapKW : p.gapMW),
      0
    ) * tempEfficiencyFactor
  );

  // Max solar deficit in window for callout badge
  const maxDeficitInWindow = Math.abs(
    Math.min(...windowPoints.map(p => (isKw ? p.gapKW : p.gapMW)))
  );

  // SVG Chart geometry dimensions
  const chartWidth = 980;
  const chartHeight = 360;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Max Y value: 240 for kW, or 1200 for MW
  const maxY = isKw ? 240 : 1200;

  const getX = (hour: number) => paddingLeft + (hour / 23) * innerWidth;
  const getY = (val: number) => paddingTop + innerHeight - (Math.max(0, Math.min(val, maxY)) / maxY) * innerHeight;

  // Build SVG path strings using smooth cubic beziers
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const loadPoints = hourlyData.map(p => ({
    x: getX(p.hour),
    y: getY(isKw ? p.loadKW : p.loadMW),
  }));

  const histPoints = hourlyData.map(p => ({
    x: getX(p.hour),
    y: getY(isKw ? p.historicalSolarKW : p.historicalSolarMW),
  }));

  const predPoints = hourlyData.map(p => ({
    x: getX(p.hour),
    y: getY((isKw ? p.predictedSolarKW : p.predictedSolarMW) * tempEfficiencyFactor),
  }));

  const loadPath = buildSmoothPath(loadPoints);
  const histPath = buildSmoothPath(histPoints);
  const predPath = buildSmoothPath(predPoints);

  // Build the gap shaded polygon between historical and predicted solar curves
  const gapPolygonPoints: string[] = [];
  // Forward along historical solar from hour 5 to 19
  for (let h = 5; h <= 19; h++) {
    const pt = histPoints[h];
    gapPolygonPoints.push(`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`);
  }
  // Backward along predicted solar from hour 19 down to 5
  for (let h = 19; h >= 5; h--) {
    const pt = predPoints[h];
    gapPolygonPoints.push(`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`);
  }
  const gapAreaPath = `M ${gapPolygonPoints.join(' L ')} Z`;

  // Window X coordinates
  const windowStartX = getX(scenario.windowStart);
  const windowEndX = getX(scenario.windowEnd);

  // Reference y-axis ticks
  const yTicks = isKw ? [0, 40, 80, 120, 160, 200, 240] : [0, 200, 400, 600, 800, 1000, 1200];
  const xTickHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const target = WEATHER_SCENARIOS.find(s => s.id === id);
    if (target) {
      setTemperature(target.temperature);
    }
  };

  const scrollToDecision = () => {
    const el = document.getElementById('operator-decision-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const patternId = useId();

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-100 pb-16">
      {/* Top Banner & Scale Switcher */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
                AI Forecast Engine & Scenario Simulator
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Armenia Power System Operator & ENA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Photovoltaic Generation & Grid Load Trajectory
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Resolution:</span>
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
              <button
                onClick={() => setScale('feeder_kw')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  scale === 'feeder_kw'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Substation Feeder (kW)
              </button>
              <button
                onClick={() => setScale('national_mw')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  scale === 'national_mw'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                National Grid (MW)
              </button>
            </div>
          </div>
        </div>

        {/* WEATHER CONTROLS ROW - Exactly matching the reference image layout */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Weather Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-slate-300 mr-1 shrink-0">
              Weather forecast
            </span>
            {WEATHER_SCENARIOS.map(sc => {
              const isActive = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioChange(sc.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1a365d] border-blue-500/80 text-white shadow-md'
                      : 'bg-[#141b27] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#1a2332]'
                  }`}
                >
                  {sc.name}
                </button>
              );
            })}
          </div>

          {/* Temperature Slider */}
          <div className="flex items-center gap-4 bg-[#141b27] border border-slate-800/80 rounded-lg px-4 py-2 w-full lg:w-80">
            <span className="text-sm font-medium text-slate-300 shrink-0">Temperature</span>
            <input
              type="range"
              min="5"
              max="40"
              value={temperature}
              onChange={e => setTemperature(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-sm font-bold font-mono text-white tabular-nums shrink-0">
              {temperature}°C
            </span>
          </div>
        </div>

        {/* METRICS ROW - 4 big stat boxes matching reference image */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#141b27]/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              Historical for this day
            </div>
            <div className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums">
              {totalHistorical.toLocaleString()} {unit}
            </div>
          </div>

          <div className="bg-[#141b27]/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              Predicted from weather
            </div>
            <div className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums">
              {totalPredicted.toLocaleString()} {unit}
            </div>
          </div>

          <div className="bg-[#141b27]/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              Weather effect
            </div>
            <div className={`mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-mono tabular-nums ${
              weatherEffectPct < 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {weatherEffectPct > 0 ? `+${weatherEffectPct}%` : `${weatherEffectPct}%`}
            </div>
          </div>

          <div className="bg-[#141b27]/70 border border-slate-800/80 rounded-xl p-4 sm:p-5">
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              Energy gap in window
            </div>
            <div className={`mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-mono tabular-nums ${
              gapInWindow < 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {gapInWindow > 0 ? `+${gapInWindow.toLocaleString()} ${unit}` : `${gapInWindow.toLocaleString()} ${unit}`}
            </div>
          </div>
        </div>

        {/* CLOUD COVER BAR CHART - Matching reference image */}
        <div className="mt-10 bg-[#121824] border border-slate-800/90 rounded-t-2xl p-5 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs sm:text-sm font-medium text-slate-300">
              Forecast cloud cover by hour
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Adjustment window: {scenario.windowStart}:00 – {scenario.windowEnd}:00
            </div>
          </div>

          {/* Cloud Cover Bar Chart SVG */}
          <div className="relative w-full h-24 overflow-x-auto">
            <svg
              className="w-full h-full min-w-[700px]"
              viewBox="0 0 980 90"
              preserveAspectRatio="none"
            >
              {/* Y Axis Reference Guides */}
              <text x="35" y="16" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">100%</text>
              <line x1="45" y1="12" x2="960" y2="12" stroke="#1e293b" strokeDasharray="3 3" />

              <text x="35" y="48" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">50%</text>
              <line x1="45" y1="45" x2="960" y2="45" stroke="#1e293b" strokeDasharray="3 3" />

              <text x="35" y="80" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">0%</text>
              <line x1="45" y1="78" x2="960" y2="78" stroke="#334155" />

              {/* Hourly Cloud Cover Bars */}
              {hourlyData.map((d) => {
                const x = getX(d.hour);
                const barWidth = 18;
                const barHeight = (d.cloudCoverPct / 100) * 64;
                const barY = 78 - barHeight;
                const isHovered = hoveredHour === d.hour;

                return (
                  <g key={`cloud-${d.hour}`}>
                    <rect
                      x={x - barWidth / 2}
                      y={barY}
                      width={barWidth}
                      height={Math.max(3, barHeight)}
                      rx="2"
                      fill={d.inWindow ? '#505a69' : '#333d4e'}
                      className={`transition-colors cursor-pointer ${
                        isHovered ? 'fill-blue-400' : ''
                      }`}
                      onMouseEnter={() => setHoveredHour(d.hour)}
                      onMouseLeave={() => setHoveredHour(null)}
                    />
                  </g>
                );
              })}

              {/* Adjustment window vertical markers on cloud chart */}
              <line
                x1={windowStartX}
                y1="5"
                x2={windowStartX}
                y2="85"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <line
                x1={windowEndX}
                y1="5"
                x2={windowEndX}
                y2="85"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </svg>
          </div>
        </div>

        {/* CHART LEGEND ROW - Matching reference image */}
        <div className="bg-[#121824] border-x border-slate-800/90 px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-300 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-blue-500 inline-block rounded-full" />
            <span>Load</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 border-t border-dashed border-slate-300 inline-block" />
            <span>Solar, historical for this day</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-amber-500 inline-block rounded-full" />
            <span>Solar, predicted from weather</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-amber-800/60 border border-amber-600/40 rounded-sm inline-block" />
            <span>Gap = weather effect</span>
          </div>

          <div className="flex items-center gap-2 text-rose-400">
            <span className="w-3 border-t border-dashed border-rose-500 inline-block" />
            <span>Adjustment window</span>
          </div>
        </div>

        {/* MAIN CURVES INTERACTIVE GRAPH - Matching reference image */}
        <div className="relative bg-[#121824] border-x border-b border-slate-800/90 rounded-b-2xl p-4 sm:p-6 overflow-hidden">
          {/* FLOATING ATTENTION CALLOUT BADGE - Matching reference image exactly! */}
          <div
            className="absolute z-20 pointer-events-auto transition-all duration-300 shadow-xl"
            style={{
              left: 'clamp(60px, 26%, 300px)',
              top: '42px',
            }}
          >
            <div className="bg-[#241c0d]/95 backdrop-blur border border-amber-600/60 rounded-xl p-3.5 sm:p-4 text-amber-200 max-w-xs shadow-2xl">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-amber-300">
                    Attention: adjustment needed
                  </div>
                  <div className="text-xs text-amber-400/90 mt-1 font-mono">
                    {scenario.windowStart}:00–{scenario.windowEnd}:00 · solar up to{' '}
                    <span className="font-bold underline decoration-amber-500/50">
                      {maxDeficitInWindow} {powerUnit}
                    </span>{' '}
                    below normal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative w-full overflow-x-auto">
            <svg
              className="w-full min-w-[760px] h-[360px]"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            >
              <defs>
                {/* Pattern for shaded deficit area */}
                <pattern
                  id={`gapPattern-${patternId}`}
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(217, 119, 6, 0.25)" strokeWidth="2" />
                </pattern>

                <linearGradient id={`gapGradient-${patternId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {yTicks.map(val => {
                const y = getY(val);
                return (
                  <g key={`y-${val}`}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={y + 4}
                      fill="#64748b"
                      fontSize="11"
                      textAnchor="end"
                      fontFamily="monospace"
                      fontWeight="500"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Y Axis Unit Label */}
              <text
                x={paddingLeft - 10}
                y={paddingTop - 10}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="end"
                fontFamily="monospace"
                fontWeight="600"
              >
                {powerUnit}
              </text>

              {/* Adjustment Window Vertical Red Dashed Lines spanning entire chart */}
              <line
                x1={windowStartX}
                y1={paddingTop - 5}
                x2={windowStartX}
                y2={chartHeight - paddingBottom}
                stroke="#f43f5e"
                strokeWidth="1.7"
                strokeDasharray="4 4"
              />
              <line
                x1={windowEndX}
                y1={paddingTop - 5}
                x2={windowEndX}
                y2={chartHeight - paddingBottom}
                stroke="#f43f5e"
                strokeWidth="1.7"
                strokeDasharray="4 4"
              />

              {/* Shaded Deficit Gap Area between historical and predicted solar curves */}
              <path
                d={gapAreaPath}
                fill={`url(#gapGradient-${patternId})`}
                className="transition-all duration-300"
              />

              {/* Load Curve (Solid Blue) */}
              <path
                d={loadPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Historical Solar Curve (Dashed White/Light Slate) */}
              <path
                d={histPath}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.2"
                strokeDasharray="5 4"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Predicted Solar Curve (Solid Warm Orange) */}
              <path
                d={predPath}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.8"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* X-Axis Tick Labels */}
              {xTickHours.map(hour => {
                const x = getX(hour);
                const label = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <g key={`x-${hour}`}>
                    <line
                      x1={x}
                      y1={chartHeight - paddingBottom}
                      x2={x}
                      y2={chartHeight - paddingBottom + 5}
                      stroke="#475569"
                    />
                    <text
                      x={x}
                      y={chartHeight - paddingBottom + 20}
                      fill="#64748b"
                      fontSize="11"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Hover vertical crosshair & interactive tooltip points */}
              {hoveredHour !== null && (
                <g>
                  <line
                    x1={getX(hoveredHour)}
                    y1={paddingTop}
                    x2={getX(hoveredHour)}
                    y2={chartHeight - paddingBottom}
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                  {/* Point markers on curves */}
                  <circle
                    cx={getX(hoveredHour)}
                    cy={loadPoints[hoveredHour]?.y || 0}
                    r="4"
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <circle
                    cx={getX(hoveredHour)}
                    cy={histPoints[hoveredHour]?.y || 0}
                    r="4"
                    fill="#cbd5e1"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <circle
                    cx={getX(hoveredHour)}
                    cy={predPoints[hoveredHour]?.y || 0}
                    r="4"
                    fill="#f97316"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Transparent hover capture rects for each hour */}
              {hourlyData.map(d => {
                const x = getX(d.hour);
                const colWidth = innerWidth / 23;
                return (
                  <rect
                    key={`hover-col-${d.hour}`}
                    x={x - colWidth / 2}
                    y={paddingTop}
                    width={colWidth}
                    height={innerHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredHour(d.hour)}
                    onMouseLeave={() => setHoveredHour(null)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Interactive Scrubbing Tooltip Box */}
          {hoveredHour !== null && hourlyData[hoveredHour] && (
            <div className="mt-3 p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs flex flex-wrap items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-white">Hour {hourlyData[hoveredHour].timeLabel}</span>
                {hourlyData[hoveredHour].inWindow && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                    Adjustment Window
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-slate-400">Load: </span>
                  <span className="text-sky-300 font-bold tabular-nums">
                    {isKw ? hourlyData[hoveredHour].loadKW : hourlyData[hoveredHour].loadMW} {powerUnit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Hist. Solar: </span>
                  <span className="text-slate-200 font-bold tabular-nums">
                    {isKw ? hourlyData[hoveredHour].historicalSolarKW : hourlyData[hoveredHour].historicalSolarMW} {powerUnit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Pred. Solar: </span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {Math.round((isKw ? hourlyData[hoveredHour].predictedSolarKW : hourlyData[hoveredHour].predictedSolarMW) * tempEfficiencyFactor)} {powerUnit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Gap: </span>
                  <span className={`font-bold tabular-nums ${
                    hourlyData[hoveredHour].gapKW < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {Math.round((isKw ? hourlyData[hoveredHour].gapKW : hourlyData[hoveredHour].gapMW) * tempEfficiencyFactor)} {powerUnit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Cloud: </span>
                  <span className="text-slate-300 font-bold tabular-nums">
                    {hourlyData[hoveredHour].cloudCoverPct}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Down Arrow Circle Button at Bottom Center (Matching Reference Image) */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={scrollToDecision}
              title="Jump to AI Dispatch Recommendations"
              className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 flex items-center justify-center transition-all shadow-md cursor-pointer group"
            >
              <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* AI FORECAST ENGINE & OPERATOR DECISION WORKFLOW (From Block Scheme) */}
        <div id="operator-decision-section" className="mt-12 pt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                  AI Dispatch & Load Balancing Engine
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">Operator Decision Workflow</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                Suggested Grid Adjustments for {scenario.name} Window ({scenario.windowStart}:00 – {scenario.windowEnd}:00)
              </h2>
            </div>

            {/* Pilot Metric Summary Card */}
            <div className="flex items-center gap-4 bg-[#141b27] border border-slate-800 rounded-xl px-4 py-2.5">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Manual Actions/Day</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  <span className="line-through text-slate-500 mr-1.5">{PILOT_METRICS.manualAdjustmentsBefore}</span>
                  <span className="text-emerald-400">{PILOT_METRICS.manualAdjustmentsAfter}</span>
                  <span className="text-[10px] text-emerald-400/80 ml-1">(-78%)</span>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Acceptance Rate</div>
                <div className="text-sm font-bold text-emerald-400 tabular-nums">
                  {PILOT_METRICS.acceptanceRatePct}%
                </div>
              </div>
            </div>
          </div>

          {/* Action List Grid */}
          <div className="space-y-4">
            {dispatchActions.map(action => (
              <div
                key={action.id}
                className={`bg-[#141b27] border rounded-xl p-5 transition-all ${
                  action.status === 'approved'
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : action.status === 'rejected'
                    ? 'border-rose-500/30 opacity-70 bg-rose-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-blue-400">
                        {action.id}
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        {action.title}
                      </h3>
                      <span className="text-xs text-slate-400">
                        Target: <strong className="text-slate-200">{action.plantOrSubstation}</strong>
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {action.timeframe}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {action.rationale}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
                      <span>
                        Delta: <strong className={action.adjustmentMW > 0 ? 'text-amber-400' : 'text-blue-400'}>
                          {action.adjustmentMW > 0 ? `+${action.adjustmentMW} MW` : action.adjustmentMW === 0 ? 'Voltage OLTC' : `${action.adjustmentMW} MW`}
                        </strong>
                      </span>
                      <span>·</span>
                      <span>
                        Est. Cost: <strong className="text-slate-200">${action.estimatedCostImpactUSD.toLocaleString()}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Grid Reliability: <strong className="text-emerald-400">{action.reliabilityDeltaPct}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Decision Buttons (Confirm or Reject Workflow) */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    {action.status === 'approved' ? (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Dispatch Order Approved</span>
                      </div>
                    ) : action.status === 'rejected' ? (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                        <X className="w-4 h-4" />
                        <span>Order Overridden / Rejected</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onApproveAction(action.id)}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Order</span>
                        </button>
                        <button
                          onClick={() => onRejectAction(action.id)}
                          className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Study & Context callout */}
          <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-slate-300">
                Armenia System Dispatch & Forecast Impact Study
              </div>
              <p className="leading-relaxed">
                Solar capacity reached 1.1 GW in Armenia (producing ~15% of national generation), rivaling total midday demand (~800 MW).
                When a storm halts 385 MW of solar, fast-ramping hydro (Vorotan cascade) and standby thermal units prevent grid frequency collapse.
                Improved day-ahead solar forecasts cut reserves needed for forecast error by 30% and production costs by 0.9%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

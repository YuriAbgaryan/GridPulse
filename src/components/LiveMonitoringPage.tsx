import React, { useState } from 'react';
import { ViewMode, Substation, GenerationSource, GridAlert } from '../types/grid';
import {
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Layers,
  Thermometer,
  Gauge,
  Sun,
  Sliders,
  ChevronRight,
  RefreshCw,
  Building,
  CheckCircle2,
  FileText,
  Check,
  X,
  XCircle,
  RotateCcw
} from 'lucide-react';

interface LiveMonitoringPageProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  frequency: number;
  substations: Substation[];
  generationSources: GenerationSource[];
  activeAlerts: GridAlert[];
  onSelectAlert: (alertId: string) => void;
  onOpenForecast: () => void;
  onOpenWorkOrderModal: (alert: GridAlert) => void;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  viewMode,
  onViewModeChange,
  frequency,
  substations,
  generationSources,
  activeAlerts,
  onSelectAlert,
  onOpenForecast,
  onOpenWorkOrderModal,
}) => {
  const [selectedSubstation, setSelectedSubstation] = useState<Substation | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [simulatedRampActive, setSimulatedRampActive] = useState<boolean>(false);
  const [topAlertStatus, setTopAlertStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  // Totals calculation
  const totalGenMW = generationSources.reduce((acc, s) => acc + s.currentOutputMW, 0);
  const totalLoadMW = substations.reduce((acc, s) => acc + s.activePowerMW, 0);
  const netSurplusMW = totalGenMW - totalLoadMW;
  const solarShareMW = generationSources
    .filter(s => s.type === 'pv_utility' || s.type === 'rooftop_pv')
    .reduce((acc, s) => acc + s.currentOutputMW, 0);
  const solarSharePct = Math.round((solarShareMW / totalGenMW) * 100);

  const freqDelta = frequency - 50.0;
  const isFreqStable = Math.abs(freqDelta) < 0.1;

  const filteredSubstations = substations.filter(s => {
    if (filterRegion === 'all') return true;
    return s.region.toLowerCase().includes(filterRegion.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-100 pb-16">
      {/* Top Banner & Control View Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
                SCADA Integration & Real-Time Monitoring
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                {viewMode === 'operator' ? 'Electric Power System Operator Console' : 'Electric Networks of Armenia (ENA) Console'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {viewMode === 'operator'
                ? 'Armenian Bulk Transmission & Balancing Center'
                : 'ENA Distribution Grid & Loss Telemetry'}
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium">Perspective:</span>
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
              <button
                onClick={() => onViewModeChange('operator')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'operator'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Operator (SCADA/TSO)
              </button>
              <button
                onClick={() => onViewModeChange('ena')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'ena'
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ENA (Distribution/DSO)
              </button>
            </div>
          </div>
        </div>

        {/* TOP LIVE ALERT ABOUT GRID CHANGE WITH INFO, ADJUSTMENT SUGGESTION, AND ACCEPT/REJECT BUTTONS */}
        <div className={`mt-6 rounded-2xl border transition-all duration-300 p-5 shadow-2xl ${
          topAlertStatus === 'accepted'
            ? 'bg-[#0e231c] border-emerald-500/50 text-emerald-100'
            : topAlertStatus === 'rejected'
            ? 'bg-[#241317] border-rose-500/40 text-rose-100'
            : 'bg-gradient-to-r from-[#28180c] via-[#201815] to-[#161a25] border-amber-500/60 text-amber-100'
        }`}>
          {topAlertStatus === 'pending' ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 flex-1">
                {/* Header Tag with Pulsing Beacon */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                    Real-Time Imbalance Alert
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SCADA Event: FLUX-782 · 12:35 PM (Live)
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-amber-400 font-mono">
                    Aragatsotn & Armavir Valley Corridor
                  </span>
                </div>

                {/* Info about Change */}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Sudden Solar Generation Drop: -185 MW within 12 Minutes</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Rapid convective cloud ingress over utility solar clusters and ~18,000 behind-the-meter rooftop producers.
                    Total PV injection dropped from 320 MW to 135 MW, causing grid frequency to perturb to{' '}
                    <strong className="text-amber-300 font-mono">49.91 Hz</strong> and reducing spinning reserve to{' '}
                    <strong className="text-amber-300 font-mono">5.4%</strong>.
                  </p>
                </div>

                {/* Suggestion for Adjustment */}
                <div className="p-3 bg-black/40 border border-amber-500/30 rounded-xl flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                    <strong className="text-amber-300 font-semibold">Suggested Adjustment: </strong>
                    Ramp Vorotan Hydro Cascade (Tatev HPP Units 1 & 2) by <strong className="text-white">+140 MW</strong> immediately,
                    commit Hrazdan TPP Unit 5 spinning reserve (<strong className="text-white">+45 MW</strong>),
                    and engage Gyumri Substation 15 MVAR capacitor bank to restore 50.00 Hz nominal balance.
                  </div>
                </div>
              </div>

              {/* Action Buttons: Accept & Reject */}
              <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 self-end lg:self-center border-t lg:border-t-0 lg:border-l border-amber-500/20 pt-3 lg:pt-0 lg:pl-5">
                <button
                  onClick={() => setTopAlertStatus('accepted')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Adjustment</span>
                </button>
                <button
                  onClick={() => setTopAlertStatus('rejected')}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-600/80 text-slate-300 hover:text-rose-200 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ) : topAlertStatus === 'accepted' ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Dispatched Order Active
                    </span>
                    <span className="text-xs text-slate-400 font-mono">SCADA Protocol IEC-60870-5-104</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Grid Adjustment Accepted & Dispatched to SCADA AGC
                  </h3>
                  <p className="text-xs text-emerald-300/90 mt-1">
                    Fast spinning reserve orders transmitted: Vorotan Hydro Cascade ramping +140 MW, Hrazdan TPP Block 5 +45 MW. Frequency stabilizing back to 50.00 Hz.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTopAlertStatus('pending')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-center shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                      Adjustment Rejected
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Manual Override Engaged</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Automated Adjustment Rejected by System Operator
                  </h3>
                  <p className="text-xs text-rose-300/90 mt-1">
                    Automatic AGC dispatch was cancelled. Dispatchers maintaining manual line-frequency control.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTopAlertStatus('pending')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-rose-900/50 hover:bg-rose-800/60 border border-rose-500/40 text-rose-200 transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-center shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>
          )}
        </div>

        {/* TOP LEVEL REAL-TIME TELEMETRY HUD */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Grid Frequency */}
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Grid Frequency</span>
              <Activity className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-1">
              <span>{frequency.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-normal">Hz</span>
            </div>
            <div className="mt-1 text-[11px] font-mono flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isFreqStable ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={isFreqStable ? 'text-emerald-400' : 'text-amber-400'}>
                {freqDelta >= 0 ? `+${freqDelta.toFixed(3)} Hz` : `${freqDelta.toFixed(3)} Hz`}
              </span>
            </div>
          </div>

          {/* National Demand / Load */}
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>National Load</span>
              <Zap className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-sky-400 tabular-nums flex items-baseline gap-1">
              <span>{totalLoadMW}</span>
              <span className="text-xs text-slate-400 font-normal">MW</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Avg baseline: 800 MW
            </div>
          </div>

          {/* Total Generation */}
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Generation</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums flex items-baseline gap-1">
              <span>{totalGenMW}</span>
              <span className="text-xs text-slate-400 font-normal">MW</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              Surplus: +{netSurplusMW} MW
            </div>
          </div>

          {/* Total Solar Output */}
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Solar Share</span>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums flex items-baseline gap-1">
              <span>{solarShareMW}</span>
              <span className="text-xs text-slate-400 font-normal">MW</span>
            </div>
            <div className="mt-1 text-[11px] text-amber-400/90 font-mono">
              {solarSharePct}% of total generation
            </div>
          </div>

          {/* Rooftop Solar (Unseen) */}
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Rooftop (Unseen)</span>
              <Layers className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-purple-300 tabular-nums flex items-baseline gap-1">
              <span>135</span>
              <span className="text-xs text-slate-400 font-normal">MW</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              &gt;50k rooftops (650 MW cap)
            </div>
          </div>

          {/* Curtailment / Loss Indicator */}
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{viewMode === 'operator' ? 'Curtailment Risk' : 'Loss Rate (ENA)'}</span>
              <Shield className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-rose-300 tabular-nums flex items-baseline gap-1">
              <span>{viewMode === 'operator' ? 'MODERATE' : '8.4%'}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              {viewMode === 'operator' ? 'Midday surplus alert' : '621.9M kWh ($31M/yr)'}
            </div>
          </div>
        </div>

        {/* REAL-TIME WEATHER FLUCTUATION & PRE-EMPTIVE DISPATCH ADVISORY CARD */}
        <div className="mt-6 bg-gradient-to-r from-blue-950/40 via-[#162133] to-[#141b27] border border-blue-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-mono font-semibold border border-blue-500/30">
                  Real-Time Weather Warning
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Radar Doppler Update: 12:15 PM
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Upcoming Storm Band Approaching Aragatsotn & Ararat PV Clusters in ~45 Minutes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Solar production is predicted to drop by up to <strong>385 MW</strong> between 13:00 and 18:00.
                Immediate action recommended: Pre-ramp Vorotan Hydro Cascade (+140 MW) and signal Hrazdan TPP spinning reserve.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenForecast}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Detailed Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN GRID: 2 COLUMNS (SCADA SUBSTATIONS + GENERATION FLEET) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Substation Telemetry & Health (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-400" />
                  <span>Substation SCADA Busbars & Feeder Health</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {viewMode === 'operator'
                    ? 'Armenian 220 kV & 110 kV bulk transmission substations'
                    : 'Regional 110 kV & 35/10 kV distribution hubs (ENA 9,400 transformers)'}
                </p>
              </div>

              {/* Region filter */}
              <div className="flex items-center gap-1">
                {['all', 'yerevan', 'shirak', 'lori', 'gegharkunik', 'syunik'].map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRegion(r)}
                    className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors cursor-pointer ${
                      filterRegion === r
                        ? 'bg-slate-700 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Substation Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredSubstations.map(sub => {
                const isSelected = selectedSubstation?.id === sub.id;
                const vDeviation = ((sub.currentVoltageKV - sub.nominalVoltageKV) / sub.nominalVoltageKV) * 100;
                const isWarning = sub.status === 'warning';

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubstation(sub)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : isWarning
                        ? 'bg-[#181d28] border-amber-600/40 hover:border-amber-500'
                        : 'bg-[#141b27] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {sub.voltageClass}
                          </span>
                          <span className="text-xs text-slate-400">{sub.region}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">
                          {sub.name}
                        </h4>
                      </div>

                      <div className="text-right font-mono">
                        <div className={`text-sm font-bold tabular-nums ${
                          isWarning ? 'text-amber-400' : 'text-slate-200'
                        }`}>
                          {sub.currentVoltageKV.toFixed(1)} kV
                        </div>
                        <div className={`text-[10px] ${
                          Math.abs(vDeviation) > 4 ? 'text-amber-400 font-semibold' : 'text-slate-500'
                        }`}>
                          {vDeviation > 0 ? `+${vDeviation.toFixed(1)}%` : `${vDeviation.toFixed(1)}%`}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {sub.details}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Load: <strong className="text-slate-200">{sub.activePowerMW} MW</strong></span>
                      <span>Trafo: <strong className={sub.transformerLoadPct > 90 ? 'text-rose-400' : 'text-slate-200'}>{sub.transformerLoadPct}%</strong></span>
                      <span className={`text-[11px] font-semibold ${
                        sub.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Substation Quick Telemetry Drawer if open */}
            {selectedSubstation && (
              <div className="bg-[#162030] border border-blue-500/40 rounded-xl p-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white">
                      SCADA Diagnostic: {selectedSubstation.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedSubstation(null)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2 bg-slate-900/60 rounded">
                    <span className="text-slate-400">Nominal Voltage</span>
                    <div className="text-white font-bold">{selectedSubstation.nominalVoltageKV} kV</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded">
                    <span className="text-slate-400">Active Power (P)</span>
                    <div className="text-sky-300 font-bold">{selectedSubstation.activePowerMW} MW</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded">
                    <span className="text-slate-400">Reactive Power (Q)</span>
                    <div className="text-purple-300 font-bold">{selectedSubstation.reactivePowerMVAR} MVAR</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded">
                    <span className="text-slate-400">Trafo Thermal Stress</span>
                    <div className={selectedSubstation.transformerLoadPct > 90 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {selectedSubstation.transformerLoadPct}% rated
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Generation Fleet Mix & Active Dispatch Alerts */}
          <div className="space-y-6">
            {/* Armenia Generation Fleet Mix */}
            <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>National Generation Fleet</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">1.1 GW Solar Base</span>
              </div>

              <div className="space-y-3.5">
                {generationSources.map(gen => (
                  <div key={gen.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[180px]">
                        {gen.name}
                      </span>
                      <span className="font-mono text-slate-200 font-bold">
                        {gen.currentOutputMW} MW
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all ${
                          gen.type === 'nuclear'
                            ? 'bg-purple-500'
                            : gen.type === 'hydro'
                            ? 'bg-blue-500'
                            : gen.type === 'thermal'
                            ? 'bg-amber-500'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${(gen.currentOutputMW / gen.capacityMW) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Cap: {gen.capacityMW} MW</span>
                      <span className="capitalize">{gen.flexibility.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Urgent Alerts Widget */}
            <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Immediate Active Alerts</span>
                </h3>
                <span className="text-xs text-amber-400 font-mono">
                  {activeAlerts.filter(a => a.status === 'active').length} active
                </span>
              </div>

              <div className="space-y-3">
                {activeAlerts.slice(0, 3).map(alt => (
                  <div
                    key={alt.id}
                    className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {alt.id}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {alt.timestamp}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {alt.title}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {alt.description}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onSelectAlert(alt.id)}
                        className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                      >
                        Inspect Alert →
                      </button>
                      <button
                        onClick={() => onOpenWorkOrderModal(alt)}
                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Work Order</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

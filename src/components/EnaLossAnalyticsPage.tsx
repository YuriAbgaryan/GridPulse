import React, { useState } from 'react';
import { ENA_LOSS_FEEDERS } from '../data/mockGridData';
import { LossAnomalyFeeder } from '../types/grid';
import {
  DollarSign,
  TrendingDown,
  Scale,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Calculator,
  Zap,
  Building,
  Target,
  FileSpreadsheet
} from 'lucide-react';

export const EnaLossAnalyticsPage: React.FC = () => {
  const [lossReductionGoalPct, setLossReductionGoalPct] = useState<number>(1.0);
  const [meterUnitCostUSD, setMeterUnitCostUSD] = useState<number>(220);
  const [targetMetersCount, setTargetMetersCount] = useState<number>(350);

  // Financial calculations from user brief:
  // Total baseline losses: 621.9 million kWh / year (~$31M USD)
  // 1 percentage point of loss = ~73 million kWh = ~$3.7M USD / year
  const kwhPerPoint = 73000000;
  const usdPerPoint = 3700000;

  const annualKwhSaved = Math.round(lossReductionGoalPct * kwhPerPoint);
  const annualUsdSaved = Math.round(lossReductionGoalPct * usdPerPoint);

  const totalDeploymentCostUSD = targetMetersCount * meterUnitCostUSD;
  const paybackPeriodMonths = ((totalDeploymentCostUSD / annualUsdSaved) * 12).toFixed(1);
  const paybackPeriodDays = Math.round((totalDeploymentCostUSD / annualUsdSaved) * 365);

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              ENA Revenue Protection & Grid Efficiency
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Electric Networks of Armenia (ENA)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Loss, Theft & Meter Discrepancy Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-4xl leading-relaxed">
            Armenia's annual grid distribution loss totals <strong>621.9 million kWh (~$31M USD)</strong> at an 8–9% loss rate.
            By cross-referencing SCADA feeder meters with ENA's 650,000 smart meters, GridPulse pinpoints technical vs commercial theft anomalies
            across 9,400 transformers without requiring universal secondary metering.
          </p>
        </div>

        {/* TOP LEVEL PROBLEM & VALUE CARDS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Annual Armenia Loss</span>
              <Zap className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-rose-400 tabular-nums">
              621.9M kWh
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              ~$31,000,000 USD / year
            </div>
          </div>

          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Value per 1% Reduction</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              +$3.7M USD
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              73.0M kWh annual savings
            </div>
          </div>

          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>ENA Smart Meter Fleet</span>
              <Target className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-sky-400 tabular-nums">
              650,000 Units
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              99.2% automated daily polling
            </div>
          </div>

          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Transformers</span>
              <Building className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-purple-300 tabular-nums">
              ~9,400 Units
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              Targeted metering only ($150-$300)
            </div>
          </div>
        </div>

        {/* INTERACTIVE 1% POINT LOSS VALUE CALCULATOR */}
        <div className="mt-8 bg-gradient-to-br from-[#141c2a] via-[#121824] to-[#0f1520] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Loss Reduction Business Case & Payback Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            World Bank case studies show utilities cutting total losses from 15% to 7% in five years, with smart metering deployments paying for themselves in 7 months.
            Because Armenia is already at 8–9%, aiming for a <strong>1.0% reduction</strong> is realistic and generates tremendous ROI.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Slider 1: Loss Reduction Target */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Target Loss Reduction</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {lossReductionGoalPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={lossReductionGoalPct}
                onChange={e => setLossReductionGoalPct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.2% (Conservative)</span>
                <span>1.0% (Base Plan)</span>
                <span>3.0% (Aggressive)</span>
              </div>
            </div>

            {/* Input Slider 2: Targeted Smart Meters Installed */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Targeted Meter Deployments</span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {targetMetersCount} units
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="25"
                value={targetMetersCount}
                onChange={e => setTargetMetersCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>100 units</span>
                <span>350 units</span>
                <span>1,000 units</span>
              </div>
            </div>

            {/* Input Slider 3: Unit Cost */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Secondary Meter Hardware Cost</span>
                <span className="font-mono font-bold text-slate-200 text-sm">
                  ${meterUnitCostUSD}
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="350"
                step="10"
                value={meterUnitCostUSD}
                onChange={e => setMeterUnitCostUSD(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$150 (Low cost)</span>
                <span>$220 (Standard)</span>
                <span>$350 (Full SCADA CT)</span>
              </div>
            </div>
          </div>

          {/* ROI & Payback Result Banner */}
          <div className="mt-6 bg-[#162524] border border-emerald-500/40 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <div className="text-[11px] text-emerald-300/80 font-mono uppercase">Annual Energy Saved</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
                {(annualKwhSaved / 1000000).toFixed(1)}M kWh
              </div>
            </div>

            <div>
              <div className="text-[11px] text-emerald-300/80 font-mono uppercase">Annual Revenue Recovered</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
                ${(annualUsdSaved / 1000000).toFixed(2)}M USD
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-mono uppercase">Targeted Capex Required</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white">
                ${totalDeploymentCostUSD.toLocaleString()} USD
              </div>
            </div>

            <div>
              <div className="text-[11px] text-amber-300/80 font-mono uppercase">Investment Payback</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-300">
                {paybackPeriodDays} Days (~{paybackPeriodMonths} mo)
              </div>
            </div>
          </div>
        </div>

        {/* SCADA VS SMART METER DISCREPANCY TABLE */}
        <div className="mt-8 bg-[#141b27] border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Suspect Feeders & Transformers (SCADA vs Smart Meter Sum)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Identifies transformers with unaccounted discrepancies &gt;10%, distinguishing technical line impedance from unauthorized commercial bypasses.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              6 high-loss anomalies detected today
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="pb-3 pr-4">Transformer ID</th>
                  <th className="pb-3 pr-4">Feeder Location</th>
                  <th className="pb-3 pr-4">Smart Meters</th>
                  <th className="pb-3 pr-4">SCADA Inflow</th>
                  <th className="pb-3 pr-4">Metered Outflow</th>
                  <th className="pb-3 pr-4">Loss Gap (%)</th>
                  <th className="pb-3 pr-4">Est. Annual Value</th>
                  <th className="pb-3 pr-4">Root Cause</th>
                  <th className="pb-3 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {ENA_LOSS_FEEDERS.map(feeder => {
                  const isUrgent = feeder.investigationPriority === 'urgent';
                  return (
                    <tr key={feeder.transformerId} className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-bold text-white">{feeder.transformerId}</td>
                      <td className="py-3 pr-4 text-slate-300 font-sans">{feeder.location}</td>
                      <td className="py-3 pr-4 text-slate-400">{feeder.customerSmartMeters} meters</td>
                      <td className="py-3 pr-4 text-slate-200">{feeder.scadaFeederReadingKWh.toLocaleString()} kWh</td>
                      <td className="py-3 pr-4 text-slate-200">{feeder.smartMetersSumKWh.toLocaleString()} kWh</td>
                      <td className="py-3 pr-4">
                        <span className={`font-bold ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`}>
                          {feeder.unaccountedLossPct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-200 font-bold">
                        ${feeder.estimatedAnnualLossUSD.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 capitalize text-slate-300 font-sans">
                        {feeder.status.replace('_', ' ')}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          isUrgent
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {feeder.investigationPriority} Crew
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

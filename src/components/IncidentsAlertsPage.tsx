import React, { useState } from 'react';
import { GridAlert } from '../types/grid';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Wrench,
  Zap,
  TrendingDown,
  ShieldAlert,
  FileCheck,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  BatteryCharging
} from 'lucide-react';

interface IncidentsAlertsPageProps {
  alerts: GridAlert[];
  onUpdateAlertStatus: (alertId: string, newStatus: 'active' | 'in_progress' | 'resolved') => void;
  onOpenWorkOrderModal: (alert: GridAlert) => void;
  selectedAlertId?: string | null;
}

export const IncidentsAlertsPage: React.FC<IncidentsAlertsPageProps> = ({
  alerts,
  onUpdateAlertStatus,
  onOpenWorkOrderModal,
  selectedAlertId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'alerts' | 'maintenance_schedule'>('alerts');

  // Filtered alerts
  const filteredAlerts = alerts.filter(alert => {
    if (selectedCategory !== 'all' && alert.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && alert.status !== selectedStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        alert.title.toLowerCase().includes(q) ||
        alert.substation.toLowerCase().includes(q) ||
        alert.region.toLowerCase().includes(q) ||
        alert.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const maintenanceCount = alerts.filter(a => a.category === 'maintenance').length;
  const peakDemandCount = alerts.filter(a => a.category === 'peak_demand').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
                Grid Resilience & Incident Management
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Armenia National Dispatch & ENA Operations</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Incidents, Peak Demand Alerts & Maintenance Notifications
            </h1>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Alerts & Incidents ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('maintenance_schedule')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'maintenance_schedule'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transformer Maintenance Plan (9,400 Units)
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Critical Unresolved</div>
            <div className="mt-2 text-2xl font-extrabold font-mono text-rose-400 tabular-nums">
              {criticalCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Requires immediate dispatch</div>
          </div>

          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Infrastructure Maintenance</div>
            <div className="mt-2 text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
              {maintenanceCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Automated diagnostic triggers</div>
          </div>

          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Peak Demand Warnings</div>
            <div className="mt-2 text-2xl font-extrabold font-mono text-sky-400 tabular-nums">
              {peakDemandCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Congestion & reserve margins</div>
          </div>

          <div className="bg-[#141b27] border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium">Resolved This Week</div>
            <div className="mt-2 text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {resolvedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">14 outages averted</div>
          </div>
        </div>

        {activeTab === 'alerts' ? (
          <>
            {/* FILTER & SEARCH BAR */}
            <div className="mt-6 bg-[#141b27] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search alert by substation, region, trigger or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category dropdown */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="peak_demand">Peak Demand</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="loss_anomaly">Loss / Theft</option>
                  <option value="voltage_sag">Voltage Sag</option>
                  <option value="solar_curtailment">Solar Curtailment</option>
                </select>

                <span className="text-slate-400 font-medium ml-2">Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={e => setSelectedSeverity(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>

                <span className="text-slate-400 font-medium ml-2">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="in_progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* ALERT LIST */}
            <div className="mt-6 space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center bg-[#141b27] border border-slate-800 rounded-xl text-slate-400">
                  No alerts match your filter criteria. Try changing filters or clearing search.
                </div>
              ) : (
                filteredAlerts.map(alert => {
                  const isCritical = alert.severity === 'critical';
                  const isWarning = alert.severity === 'warning';
                  const isSelected = selectedAlertId === alert.id;

                  return (
                    <div
                      key={alert.id}
                      className={`bg-[#141b27] border rounded-xl p-5 transition-all ${
                        isSelected
                          ? 'ring-2 ring-blue-500 border-blue-400'
                          : isCritical
                          ? 'border-rose-500/40 hover:border-rose-500/70'
                          : isWarning
                          ? 'border-amber-600/40 hover:border-amber-500/70'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {alert.id}
                            </span>
                            <span className={`text-[11px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                              isCritical
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : isWarning
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {alert.severity}
                            </span>
                            <span className="text-xs font-mono text-slate-400 capitalize px-2 py-0.5 rounded bg-slate-800/80">
                              {alert.category.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-500">·</span>
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {alert.timestamp}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white">
                            {alert.title}
                          </h3>

                          <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                            <span>Substation: <strong className="text-slate-200">{alert.substation}</strong></span>
                            <span>·</span>
                            <span>Region: <strong className="text-slate-200">{alert.region}</strong></span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                            {alert.description}
                          </p>

                          {/* Telemetry Trigger Box */}
                          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono text-amber-300/90">
                            <span className="text-slate-500">SCADA Telemetry Condition: </span>
                            {alert.telemetryTrigger}
                          </div>

                          {/* Recommended Action */}
                          <div className="text-xs text-emerald-300/90 pt-1 flex items-start gap-1.5">
                            <span className="text-slate-400 font-semibold shrink-0">Automated Recommendation:</span>
                            <span>{alert.recommendedAction}</span>
                          </div>
                        </div>

                        {/* Actions Panel */}
                        <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-end lg:self-center border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-3 lg:pt-0 lg:pl-4">
                          <button
                            onClick={() => onOpenWorkOrderModal(alert)}
                            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{alert.workOrderGenerated ? 'View Work Order' : 'Dispatch Work Order'}</span>
                          </button>

                          {alert.status !== 'resolved' ? (
                            <button
                              onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600/60 text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </button>
                          ) : (
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center">
                              Resolved
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* AUTOMATED MAINTENANCE SCHEDULER VIEW FOR ENA 9,400 TRANSFORMERS */
          <div className="mt-6 space-y-6">
            <div className="bg-[#141b27] border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">
                    ENA Automated Transformer Diagnostic & Metering Prioritization
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    Armenia has roughly 9,400 distribution transformers. Covering all with high-end telemetry is cost-prohibitive.
                    GridPulse computes a predictive maintenance & loss risk score using smart meter balances and load cycles,
                    targeting the top 5% highest-risk transformers ($150–$300 meter cost) to capture 80% of preventable failures.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400 font-mono">Total Monitored Fleet</div>
                  <div className="text-xl font-bold font-mono text-white">9,420 Transformers</div>
                </div>
              </div>

              {/* Transformer Risk Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="pb-3 pr-4">Transformer Unit</th>
                      <th className="pb-3 pr-4">Location & Region</th>
                      <th className="pb-3 pr-4">Load Peak</th>
                      <th className="pb-3 pr-4">Oil Temp</th>
                      <th className="pb-3 pr-4">Failure Risk</th>
                      <th className="pb-3 pr-4">Loss Discrepancy</th>
                      <th className="pb-3 pr-4">Recommended Maintenance Action</th>
                      <th className="pb-3 text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-bold text-white">TR-Vanadzor-T142</td>
                      <td className="py-3 pr-4 text-slate-300">Vanadzor Industrial / Lori</td>
                      <td className="py-3 pr-4 text-rose-400 font-bold">94%</td>
                      <td className="py-3 pr-4 text-rose-400 font-bold">88.5°C</td>
                      <td className="py-3 pr-4">
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                          CRITICAL (91%)
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">14.5%</td>
                      <td className="py-3 pr-4 text-slate-300 font-sans">Oil dielectric test & cooling fan bank #2 replacement</td>
                      <td className="py-3 text-right">
                        <span className="text-rose-400 font-bold">Urgent (48h)</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-bold text-white">TR-Shirak-048</td>
                      <td className="py-3 pr-4 text-slate-300">Gyumri North / Shirak</td>
                      <td className="py-3 pr-4 text-slate-300">76%</td>
                      <td className="py-3 pr-4 text-slate-300">64.0°C</td>
                      <td className="py-3 pr-4">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                          ELEVATED (72%)
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-amber-400 font-bold">26.6% (Theft)</td>
                      <td className="py-3 pr-4 text-slate-300 font-sans">Install secondary master meter ($220) to pinpoint feeder bypass</td>
                      <td className="py-3 text-right">
                        <span className="text-amber-400 font-bold">High</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-bold text-white">TR-Yerevan-782</td>
                      <td className="py-3 pr-4 text-slate-300">Shengavit District / Yerevan</td>
                      <td className="py-3 pr-4 text-amber-400 font-bold">88%</td>
                      <td className="py-3 pr-4 text-amber-400 font-bold">78.2°C</td>
                      <td className="py-3 pr-4">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                          ELEVATED (68%)
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-amber-400 font-bold">18.3%</td>
                      <td className="py-3 pr-4 text-slate-300 font-sans">Phase load balancing: shift 8 commercial accounts to Feeder 3A</td>
                      <td className="py-3 text-right">
                        <span className="text-amber-400 font-bold">High</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-bold text-white">TR-Ararat-115</td>
                      <td className="py-3 pr-4 text-slate-300">Masis Agro Zone / Ararat</td>
                      <td className="py-3 pr-4 text-slate-300">62%</td>
                      <td className="py-3 pr-4 text-slate-300">58.0°C</td>
                      <td className="py-3 pr-4">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                          MODERATE (45%)
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-amber-400 font-bold">17.9%</td>
                      <td className="py-3 pr-4 text-slate-300 font-sans">Seasonal irrigation pump harmonic inspection</td>
                      <td className="py-3 text-right">
                        <span className="text-blue-400 font-bold">Medium</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 pr-4 font-bold text-white">TR-Syunik-512</td>
                      <td className="py-3 pr-4 text-slate-300">Kapan Mountain Feeder / Syunik</td>
                      <td className="py-3 pr-4 text-slate-300">52%</td>
                      <td className="py-3 pr-4 text-slate-300">51.0°C</td>
                      <td className="py-3 pr-4">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                          LOW (18%)
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-emerald-400">6.2%</td>
                      <td className="py-3 pr-4 text-slate-300 font-sans">Routine annual bush clearing and surge arrester check</td>
                      <td className="py-3 text-right">
                        <span className="text-emerald-400 font-bold">Low (Scheduled)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

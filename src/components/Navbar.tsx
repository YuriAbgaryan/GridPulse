import React from 'react';
import { PageTab, ViewMode } from '../types/grid';
import { Activity, Zap, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onTabChange: (tab: PageTab) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  frequency: number;
  unreadAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  isSimulating,
  onToggleSimulate,
  frequency,
  unreadAlertCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0e1420]/95 backdrop-blur border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
          <button
            onClick={() => onTabChange('monitor')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              GridPulse
            </span>
            <span className="text-xs text-slate-400 ml-1.5 hidden sm:inline-block font-mono">
              SaaS
            </span>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => onTabChange('monitor')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              currentTab === 'monitor'
                ? 'text-white bg-slate-800/70 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            Live Monitor
          </button>
          <button
            onClick={() => onTabChange('forecast')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'forecast'
                ? 'text-white bg-slate-800/70 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            Detailed Forecast
          </button>
          <button
            onClick={() => onTabChange('alerts')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer relative ${
              currentTab === 'alerts'
                ? 'text-white bg-slate-800/70 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            Incidents & Alerts
            {unreadAlertCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[10px] font-mono rounded">
                {unreadAlertCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('loss_analytics')}
            className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer hidden md:inline-flex ${
              currentTab === 'loss_analytics'
                ? 'text-white bg-slate-800/70 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            ENA Loss & Theft
          </button>
        </nav>

        {/* Zone 3: Actions & System Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dual View Selector: Operator vs ENA */}
          <div className="hidden lg:flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => onViewModeChange('operator')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'operator'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Operator View
            </button>
            <button
              onClick={() => onViewModeChange('ena')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'ena'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ENA View
            </button>
          </div>

          {/* Live Frequency Telemetry pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-md text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Freq</span>
            <span className="text-emerald-400 font-semibold tabular-nums">
              {frequency.toFixed(2)} Hz
            </span>
          </div>

          {/* Simulation Toggle Action */}
          <button
            onClick={onToggleSimulate}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isSimulating
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">
              {isSimulating ? 'Live SCADA Stream' : 'Pause Stream'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

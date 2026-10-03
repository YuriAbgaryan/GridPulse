import React, { useState, useEffect } from 'react';
import { PageTab, ViewMode, GridAlert, DispatchRecommendation, Substation, GenerationSource } from './types/grid';
import {
  SUBSTATIONS,
  GENERATION_SOURCES,
  INITIAL_ALERTS,
  INITIAL_DISPATCH_RECOMMENDATIONS,
} from './data/mockGridData';
import { Navbar } from './components/Navbar';
import { LiveMonitoringPage } from './components/LiveMonitoringPage';
import { ForecastPage } from './components/ForecastPage';
import { IncidentsAlertsPage } from './components/IncidentsAlertsPage';
import { EnaLossAnalyticsPage } from './components/EnaLossAnalyticsPage';
import { LiveGridMapPage } from './components/LiveGridMapPage';
import { MaintenanceWorkOrderModal } from './components/MaintenanceWorkOrderModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('monitor');
  const [viewMode, setViewMode] = useState<ViewMode>('operator');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<number>(50.02);

  const [substations, setSubstations] = useState<Substation[]>(SUBSTATIONS);
  const [generationSources, setGenerationSources] = useState<GenerationSource[]>(GENERATION_SOURCES);
  const [alerts, setAlerts] = useState<GridAlert[]>(INITIAL_ALERTS);
  const [dispatchActions, setDispatchActions] = useState<DispatchRecommendation[]>(INITIAL_DISPATCH_RECOMMENDATIONS);

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [workOrderAlert, setWorkOrderAlert] = useState<GridAlert | null>(null);

  // Real-time micro-fluctuation simulation for SCADA grid frequency and voltage
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Gentle frequency oscillation between 49.97 and 50.04 Hz
      setFrequency(prev => {
        const delta = (Math.random() - 0.5) * 0.015;
        const next = Math.max(49.95, Math.min(50.05, prev + delta));
        return parseFloat(next.toFixed(3));
      });

      // Subtle voltage perturbation on substations
      setSubstations(prevSubs =>
        prevSubs.map(s => {
          const vDelta = (Math.random() - 0.5) * 0.3;
          const nextV = parseFloat((s.currentVoltageKV + vDelta).toFixed(1));
          return {
            ...s,
            currentVoltageKV: nextV,
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handlers
  const handleApproveAction = (id: string) => {
    setDispatchActions(prev =>
      prev.map(action => (action.id === id ? { ...action, status: 'approved' } : action))
    );
  };

  const handleRejectAction = (id: string) => {
    setDispatchActions(prev =>
      prev.map(action => (action.id === id ? { ...action, status: 'rejected' } : action))
    );
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: 'active' | 'in_progress' | 'resolved') => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, status: newStatus } : alert))
    );
  };

  const handleOpenWorkOrderModal = (alert: GridAlert) => {
    setWorkOrderAlert(alert);
  };

  const handleConfirmWorkOrder = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, workOrderGenerated: true, status: 'in_progress' }
          : alert
      )
    );
  };

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    setCurrentTab('alerts');
  };

  const unreadAlertCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/40">
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating(!isSimulating)}
        frequency={frequency}
        unreadAlertCount={unreadAlertCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'monitor' && (
          <LiveMonitoringPage
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            frequency={frequency}
            substations={substations}
            generationSources={generationSources}
            activeAlerts={alerts}
            onSelectAlert={handleSelectAlert}
            onOpenForecast={() => setCurrentTab('forecast')}
            onOpenWorkOrderModal={handleOpenWorkOrderModal}
          />
        )}

        {currentTab === 'forecast' && (
          <ForecastPage
            dispatchActions={dispatchActions}
            onApproveAction={handleApproveAction}
            onRejectAction={handleRejectAction}
          />
        )}

        {currentTab === 'alerts' && (
          <IncidentsAlertsPage
            alerts={alerts}
            onUpdateAlertStatus={handleUpdateAlertStatus}
            onOpenWorkOrderModal={handleOpenWorkOrderModal}
            selectedAlertId={selectedAlertId}
            onNavigateToMap={() => setCurrentTab('map')}
          />
        )}

        {currentTab === 'map' && (
          <LiveGridMapPage
            substations={substations}
            alerts={alerts}
            onOpenWorkOrderModal={handleOpenWorkOrderModal}
            onNavigateToForecast={() => setCurrentTab('forecast')}
          />
        )}

        {currentTab === 'loss_analytics' && (
          <EnaLossAnalyticsPage />
        )}
      </main>

      {/* Work Order Dispatch Modal */}
      {workOrderAlert && (
        <MaintenanceWorkOrderModal
          alert={workOrderAlert}
          onClose={() => setWorkOrderAlert(null)}
          onConfirmWorkOrder={handleConfirmWorkOrder}
        />
      )}

      {/* Discreet Footer */}
      <footer className="border-t border-slate-900 bg-[#080c13] py-5 px-4 text-xs text-slate-500 text-center font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            GridPulse · Predictive Grid Monitoring & Dispatch Engine for Armenia TSO & ENA
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>SCADA Protocol IEC 60870-5-104</span>
            <span>·</span>
            <span>650k Smart Meters Polled</span>
            <span>·</span>
            <span>1.1 GW PV Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

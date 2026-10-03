export type ViewMode = 'operator' | 'ena';
export type PageTab = 'monitor' | 'forecast' | 'alerts' | 'loss_analytics';

export interface Substation {
  id: string;
  name: string;
  region: string;
  voltageClass: '220 kV' | '110 kV' | '35 kV' | '10 kV';
  nominalVoltageKV: number;
  currentVoltageKV: number;
  activePowerMW: number;
  reactivePowerMVAR: number;
  transformerLoadPct: number;
  status: 'nominal' | 'warning' | 'critical';
  type: 'generation' | 'transmission' | 'distribution' | 'pv_cluster';
  details: string;
}

export interface GenerationSource {
  id: string;
  name: string;
  type: 'nuclear' | 'hydro' | 'thermal' | 'pv_utility' | 'rooftop_pv';
  capacityMW: number;
  currentOutputMW: number;
  flexibility: 'inflexible' | 'flexible_peak' | 'moderate' | 'intermittent';
  sharePct: number;
  location: string;
}

export interface WeatherScenario {
  id: string;
  name: string;
  temperature: number;
  cloudProfile: number[]; // 24 hours (0-100%)
  windowStart: number;
  windowEnd: number;
  weatherEffectPct: number;
  description: string;
}

export interface HourlyForecastPoint {
  hour: number;
  timeLabel: string;
  loadKW: number;
  loadMW: number;
  historicalSolarKW: number;
  historicalSolarMW: number;
  predictedSolarKW: number;
  predictedSolarMW: number;
  cloudCoverPct: number;
  gapKW: number;
  gapMW: number;
  inWindow: boolean;
}

export interface GridAlert {
  id: string;
  title: string;
  category: 'peak_demand' | 'maintenance' | 'loss_anomaly' | 'voltage_sag' | 'solar_curtailment';
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  substation: string;
  region: string;
  description: string;
  telemetryTrigger: string;
  recommendedAction: string;
  status: 'active' | 'in_progress' | 'resolved';
  workOrderGenerated?: boolean;
}

export interface DispatchRecommendation {
  id: string;
  title: string;
  plantOrSubstation: string;
  adjustmentMW: number;
  actionType: 'ramp_up' | 'ramp_down' | 'curtail' | 'demand_response' | 'oltc_adjust';
  timeframe: string;
  rationale: string;
  status: 'pending' | 'approved' | 'rejected';
  estimatedCostImpactUSD: number;
  reliabilityDeltaPct: number;
}

export interface LossAnomalyFeeder {
  transformerId: string;
  location: string;
  region: string;
  customerSmartMeters: number;
  scadaFeederReadingKWh: number;
  smartMetersSumKWh: number;
  unaccountedLossPct: number;
  estimatedAnnualLossUSD: number;
  status: 'suspected_theft' | 'technical_overload' | 'unmetered_tap' | 'nominal';
  investigationPriority: 'urgent' | 'medium' | 'low';
}

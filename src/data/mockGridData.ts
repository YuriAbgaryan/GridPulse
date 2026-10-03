import { Substation, GenerationSource, WeatherScenario, GridAlert, DispatchRecommendation, LossAnomalyFeeder, HourlyForecastPoint } from '../types/grid';

export const GENERATION_SOURCES: GenerationSource[] = [
  {
    id: 'gen-metsamor',
    name: 'Metsamor ANPP (Nuclear)',
    type: 'nuclear',
    capacityMW: 400,
    currentOutputMW: 375,
    flexibility: 'inflexible',
    sharePct: 26.2,
    location: 'Armavir Region',
  },
  {
    id: 'gen-vorotan',
    name: 'Vorotan Hydro Cascade (Tatev/Shamb)',
    type: 'hydro',
    capacityMW: 404,
    currentOutputMW: 195,
    flexibility: 'flexible_peak',
    sharePct: 15.5,
    location: 'Syunik Region',
  },
  {
    id: 'gen-sevan-hrazdan',
    name: 'Sevan-Hrazdan Hydro Cascade',
    type: 'hydro',
    capacityMW: 560,
    currentOutputMW: 140,
    flexibility: 'flexible_peak',
    sharePct: 11.2,
    location: 'Kotayk / Gegharkunik',
  },
  {
    id: 'gen-yerevan-ccgt',
    name: 'Yerevan CCGT (Thermal Gas)',
    type: 'thermal',
    capacityMW: 242,
    currentOutputMW: 160,
    flexibility: 'moderate',
    sharePct: 14.8,
    location: 'Yerevan South',
  },
  {
    id: 'gen-hrazdan-tpp',
    name: 'Hrazdan TPP (Thermal Unit 5)',
    type: 'thermal',
    capacityMW: 480,
    currentOutputMW: 90,
    flexibility: 'moderate',
    sharePct: 8.5,
    location: 'Hrazdan, Kotayk',
  },
  {
    id: 'gen-utility-solar',
    name: 'Utility Solar Parks (Masrik-1, Aragats)',
    type: 'pv_utility',
    capacityMW: 450,
    currentOutputMW: 185,
    flexibility: 'intermittent',
    sharePct: 14.2,
    location: 'Gegharkunik & Aragatsotn',
  },
  {
    id: 'gen-rooftop-solar',
    name: 'Rooftop Distributed PV (>50k installations)',
    type: 'rooftop_pv',
    capacityMW: 650,
    currentOutputMW: 135,
    flexibility: 'intermittent',
    sharePct: 9.6,
    location: 'Behind-the-Meter (Nationwide)',
  },
];

export const SUBSTATIONS: Substation[] = [
  {
    id: 'sub-yerevan-cen',
    name: 'Shahumyan 220 kV Node',
    region: 'Yerevan Capital Ring',
    voltageClass: '220 kV',
    nominalVoltageKV: 220,
    currentVoltageKV: 218.4,
    activePowerMW: 312,
    reactivePowerMVAR: 48,
    transformerLoadPct: 76,
    status: 'nominal',
    type: 'transmission',
    details: 'Primary bulk transmission hub linking Metsamor ANPP to Central Yerevan',
  },
  {
    id: 'sub-marash',
    name: 'Marash Substation',
    region: 'Central Yerevan',
    voltageClass: '110 kV',
    nominalVoltageKV: 110,
    currentVoltageKV: 109.1,
    activePowerMW: 145,
    reactivePowerMVAR: 22,
    transformerLoadPct: 82,
    status: 'nominal',
    type: 'distribution',
    details: 'Feeds residential downtown & commercial center',
  },
  {
    id: 'sub-metsamor-bus',
    name: 'ANPP 220 kV Generator Bus',
    region: 'Armavir Region',
    voltageClass: '220 kV',
    nominalVoltageKV: 220,
    currentVoltageKV: 221.2,
    activePowerMW: 375,
    reactivePowerMVAR: -12,
    transformerLoadPct: 68,
    status: 'nominal',
    type: 'generation',
    details: 'Armenian Nuclear Power Plant evacuation busbar',
  },
  {
    id: 'sub-gyumri',
    name: 'Gyumri-2 Regional Hub',
    region: 'Shirak Region',
    voltageClass: '110 kV',
    nominalVoltageKV: 110,
    currentVoltageKV: 104.2,
    activePowerMW: 92,
    reactivePowerMVAR: 26,
    transformerLoadPct: 91,
    status: 'warning',
    type: 'distribution',
    details: 'Voltage drop detected on northern feeder under heavy industrial draw',
  },
  {
    id: 'sub-vanadzor',
    name: 'Vanadzor Industrial T-142',
    region: 'Lori Region',
    voltageClass: '110 kV',
    nominalVoltageKV: 110,
    currentVoltageKV: 107.5,
    activePowerMW: 68,
    reactivePowerMVAR: 19,
    transformerLoadPct: 94,
    status: 'warning',
    type: 'distribution',
    details: 'Transformer T-142 top-oil thermal threshold alert at 88°C',
  },
  {
    id: 'sub-masrik',
    name: 'Masrik-1 Solar Interconnection',
    region: 'Gegharkunik Region',
    voltageClass: '110 kV',
    nominalVoltageKV: 110,
    currentVoltageKV: 113.8,
    activePowerMW: 55,
    reactivePowerMVAR: -18,
    transformerLoadPct: 84,
    status: 'warning',
    type: 'pv_cluster',
    details: 'Elevated bus voltage (+3.5%) caused by sudden reverse power flow during peak sun',
  },
  {
    id: 'sub-shinuhayr',
    name: 'Shinuhayr 220 kV Intertie',
    region: 'Syunik Region',
    voltageClass: '220 kV',
    nominalVoltageKV: 220,
    currentVoltageKV: 219.7,
    activePowerMW: 195,
    reactivePowerMVAR: 14,
    transformerLoadPct: 54,
    status: 'nominal',
    type: 'transmission',
    details: 'Vorotan Hydro Cascade trunk dispatch intertie to National Control Center',
  },
  {
    id: 'sub-ararat',
    name: 'Ararat Distribution Feeder-08',
    region: 'Ararat Valley',
    voltageClass: '35 kV',
    nominalVoltageKV: 35,
    currentVoltageKV: 34.1,
    activePowerMW: 42,
    reactivePowerMVAR: 9,
    transformerLoadPct: 62,
    status: 'nominal',
    type: 'distribution',
    details: 'Agricultural pump load & rural rooftop PV aggregation line',
  },
];

export const WEATHER_SCENARIOS: WeatherScenario[] = [
  {
    id: 'afternoon_storm',
    name: 'Afternoon storm',
    temperature: 18,
    cloudProfile: [
      10, 10, 10, 10, 10, 10, 10, 10, 10, 12, 18, 28, 50, 85, 95, 90, 75, 58, 50, 50, 40, 40, 32, 25,
    ],
    windowStart: 13,
    windowEnd: 18,
    weatherEffectPct: -9,
    description: 'Sudden convective storm cells roll across Ararat Valley & Aragatsotn from 13:00 to 18:00, causing a steep solar generation drop of up to 54 kW / 385 MW.',
  },
  {
    id: 'clear',
    name: 'Clear',
    temperature: 24,
    cloudProfile: [
      5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 10, 12, 10, 8, 8, 8, 8, 10, 12, 15, 15, 10, 8, 5,
    ],
    windowStart: 11,
    windowEnd: 15,
    weatherEffectPct: +8,
    description: 'High solar irradiance nationwide. Midday generation reaches 1,080 MW rivaling national load, causing curtailment risk if export interconnects are constrained.',
  },
  {
    id: 'morning_cloud',
    name: 'Morning cloud',
    temperature: 16,
    cloudProfile: [
      40, 45, 50, 55, 60, 75, 85, 90, 80, 70, 45, 25, 15, 12, 10, 10, 10, 12, 15, 20, 25, 25, 20, 15,
    ],
    windowStart: 7,
    windowEnd: 11,
    weatherEffectPct: -18,
    description: 'Low-altitude inversion fog in Armavir and Ararat plains delaying solar ramp during morning industrial wake-up peak.',
  },
  {
    id: 'passing_clouds',
    name: 'Passing clouds',
    temperature: 21,
    cloudProfile: [
      12, 15, 12, 10, 15, 20, 30, 45, 25, 55, 30, 65, 35, 60, 40, 50, 35, 25, 20, 18, 15, 15, 12, 10,
    ],
    windowStart: 10,
    windowEnd: 16,
    weatherEffectPct: -14,
    description: 'Intermittent cumulus cloud shadows causing high ramp-rate frequency fluctuations (±25 MW/10min), stressing grid spinning reserve.',
  },
  {
    id: 'overcast',
    name: 'Overcast',
    temperature: 13,
    cloudProfile: [
      80, 85, 85, 88, 90, 92, 95, 95, 95, 92, 90, 90, 88, 85, 85, 82, 80, 80, 78, 75, 75, 72, 70, 70,
    ],
    windowStart: 8,
    windowEnd: 17,
    weatherEffectPct: -64,
    description: 'Dense national stratus cloud deck suppressing solar generation by 64%. Full hydro & thermal ramp required to prevent load shedding.',
  },
];

export function generateForecastData(scenarioId: string, scale: 'feeder_kw' | 'national_mw' = 'feeder_kw'): HourlyForecastPoint[] {
  const scenario = WEATHER_SCENARIOS.find(s => s.id === scenarioId) || WEATHER_SCENARIOS[0];
  const points: HourlyForecastPoint[] = [];

  // Base multiplier: reference image has max around 240 kW; national grid has ~1200 MW
  const scaleMultiplier = scale === 'national_mw' ? 4.5 : 1;

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

    // Load curve: night low (50-60), morning ramp (90), midday plateau (75), evening peak (140)
    let baseLoadKW = 60;
    if (hour <= 4) baseLoadKW = 60 - hour * 3;
    else if (hour <= 8) baseLoadKW = 48 + (hour - 4) * 10;
    else if (hour <= 11) baseLoadKW = 88 - (hour - 8) * 4;
    else if (hour <= 15) baseLoadKW = 76 - (hour - 11) * 1.5;
    else if (hour <= 20) baseLoadKW = 72 + Math.sin(((hour - 15) / 5) * Math.PI) * 70;
    else baseLoadKW = 135 - (hour - 20) * 20;

    // Historical solar curve (bell curve 06:00 to 18:00, peak at 12:30 around 120 kW)
    let historicalSolarKW = 0;
    if (hour >= 6 && hour <= 18) {
      const x = (hour - 6) / 12; // 0 to 1
      historicalSolarKW = Math.sin(x * Math.PI) * 120;
    }

    // Cloud cover for this hour
    const cloudCoverPct = scenario.cloudProfile[hour] || 10;

    // Predicted solar: historical modified by cloud factor
    let predictedSolarKW = 0;
    if (historicalSolarKW > 0) {
      if (scenario.id === 'afternoon_storm') {
        // Matches exact visual curve of reference image:
        // Surpasses historical at 11:00-12:00 (up to ~135 kW), then collapses at 13:00 to ~50 kW and down to ~20 kW at 15:00
        if (hour === 6) predictedSolarKW = 2;
        else if (hour === 7) predictedSolarKW = 15;
        else if (hour === 8) predictedSolarKW = 42;
        else if (hour === 9) predictedSolarKW = 75;
        else if (hour === 10) predictedSolarKW = 110;
        else if (hour === 11) predictedSolarKW = 132;
        else if (hour === 12) predictedSolarKW = 136;
        else if (hour === 13) predictedSolarKW = 82;
        else if (hour === 14) predictedSolarKW = 48;
        else if (hour === 15) predictedSolarKW = 25;
        else if (hour === 16) predictedSolarKW = 22;
        else if (hour === 17) predictedSolarKW = 18;
        else if (hour === 18) predictedSolarKW = 1;
      } else {
        const cloudSuppression = 1 - (cloudCoverPct / 100) * 0.78;
        predictedSolarKW = Math.max(0, historicalSolarKW * cloudSuppression);
      }
    }

    const gapKW = predictedSolarKW - historicalSolarKW;
    const inWindow = hour >= scenario.windowStart && hour <= scenario.windowEnd;

    points.push({
      hour,
      timeLabel,
      loadKW: Math.round(baseLoadKW * scaleMultiplier),
      loadMW: Math.round(baseLoadKW * 6.8),
      historicalSolarKW: Math.round(historicalSolarKW * scaleMultiplier),
      historicalSolarMW: Math.round(historicalSolarKW * 8.2),
      predictedSolarKW: Math.round(predictedSolarKW * scaleMultiplier),
      predictedSolarMW: Math.round(predictedSolarKW * 8.2),
      cloudCoverPct,
      gapKW: Math.round(gapKW * scaleMultiplier),
      gapMW: Math.round(gapKW * 8.2),
      inWindow,
    });
  }

  return points;
}

export const INITIAL_ALERTS: GridAlert[] = [
  {
    id: 'ALT-1082',
    title: 'Transformer T-142 Winding Overheating Risk',
    category: 'maintenance',
    severity: 'critical',
    timestamp: '12:04 PM (14m ago)',
    substation: 'Vanadzor Industrial (110/35/10 kV)',
    region: 'Lori Region',
    description: 'Top-oil temperature exceeded 88.5°C threshold under 94% continuous loading. Cooling fan bank #2 vibration anomaly recorded via SCADA acoustic sensor.',
    telemetryTrigger: 'Temp = 88.5°C (>85°C Warning) · Vibration Index = 4.2 mm/s',
    recommendedAction: 'Automate cooling fan bank switchover, issue dispatch order to shift 14 MW load to Vanadzor-2 feeder, schedule oil dielectric sampling.',
    status: 'active',
    workOrderGenerated: false,
  },
  {
    id: 'ALT-1083',
    title: 'Commercial Loss & Meter Discrepancy on Feeder-04',
    category: 'loss_anomaly',
    severity: 'warning',
    timestamp: '11:42 AM (36m ago)',
    substation: 'Gyumri Urban Distribution #18',
    region: 'Shirak Region',
    description: 'SCADA secondary meter reports 420 kWh consumed over last 2 hours vs 302 kWh reported by 184 consumer smart meters. 28.1% unaccounted energy drop indicates potential unmetered bypass tap.',
    telemetryTrigger: 'Unaccounted Gap = 118 kWh / 2h (28.1% vs typical 7.2%)',
    recommendedAction: 'Dispatch ENA inspection crew with handheld RF harmonic detector to Feeder-04 terminal box #12-19.',
    status: 'active',
    workOrderGenerated: false,
  },
  {
    id: 'ALT-1084',
    title: 'Rapid Solar Ramp-Down Curtailment / Reserve Alert',
    category: 'solar_curtailment',
    severity: 'warning',
    timestamp: '11:15 AM (1h 3m ago)',
    substation: 'Masrik-1 & Aragats Utility PV Hub',
    region: 'Gegharkunik / Aragatsotn',
    description: 'Upcoming convective cloud band approaching. Predicted generation deficit of 385 MW between 13:00 and 18:00 requires hydro fast-start reserve commit.',
    telemetryTrigger: 'Forecast Deficit = -156 kWh window / -385 MW national aggregate',
    recommendedAction: 'Execute Pre-emptive Dispatch: Ramp Vorotan Cascade Tatev units +140 MW, alert Hrazdan TPP Block 5 hot standby.',
    status: 'active',
    workOrderGenerated: true,
  },
  {
    id: 'ALT-1080',
    title: 'Voltage Sag Detected on 110 kV Busbar #2',
    category: 'voltage_sag',
    severity: 'critical',
    timestamp: '09:28 AM (2h 50m ago)',
    substation: 'Gyumri-2 Regional Hub',
    region: 'Shirak Region',
    description: 'Bus voltage dipped to 103.8 kV (-5.6% nominal) following tripping of parallel line 114 during maintenance switching.',
    telemetryTrigger: 'Voltage = 103.8 kV (Nominal 110 kV, L2 warning limit 104.5 kV)',
    recommendedAction: 'Adjust On-Load Tap Changer (OLTC) position +2 steps and engage 15 MVAR capacitor bank at Gyumri East.',
    status: 'in_progress',
    workOrderGenerated: true,
  },
  {
    id: 'ALT-1077',
    title: 'Forecasted Evening Peak Demand Congestion',
    category: 'peak_demand',
    severity: 'warning',
    timestamp: '08:10 AM (4h 8m ago)',
    substation: 'Shahumyan & Marash Yerevan Ring',
    region: 'Yerevan Capital',
    description: 'Predicted evening peak at 19:45 reaches 1,045 MW due to concurrent domestic heating and transit charging.',
    telemetryTrigger: 'Projected Load = 1,045 MW (Reserve Margin narrows to 8.4%)',
    recommendedAction: 'Engage Yerevan CCGT secondary turbine and request 20 MW industrial load shifting from Ararat Cement.',
    status: 'active',
    workOrderGenerated: false,
  },
  {
    id: 'ALT-1075',
    title: 'Substation Oil Circuit Breaker SF6 Gas Pressure Low',
    category: 'maintenance',
    severity: 'info',
    timestamp: 'Yesterday 17:30',
    substation: 'Shinuhayr 220 kV Switchyard',
    region: 'Syunik Region',
    description: 'SF6 gas density sensor on Breaker B-220-4 reads 0.58 MPa (nominal 0.62 MPa). Preventative top-up required before winter freeze.',
    telemetryTrigger: 'SF6 Pressure = 0.58 MPa (Warning threshold 0.59 MPa)',
    recommendedAction: 'Schedule routine technician maintenance visit within 7 days.',
    status: 'resolved',
    workOrderGenerated: true,
  },
];

export const INITIAL_DISPATCH_RECOMMENDATIONS: DispatchRecommendation[] = [
  {
    id: 'DISP-401',
    title: 'Ramp Vorotan Hydro Cascade (Tatev HPP)',
    plantOrSubstation: 'Vorotan Hydro Cascade (Tatev Units 1 & 2)',
    adjustmentMW: 140,
    actionType: 'ramp_up',
    timeframe: '12:45 – 17:30',
    rationale: 'Compensate for -385 MW solar drop during afternoon convective storm. Tatev HPP has 45-second fast spinning ramp response.',
    status: 'pending',
    estimatedCostImpactUSD: 2400,
    reliabilityDeltaPct: 99.4,
  },
  {
    id: 'DISP-402',
    title: 'Warm Standby Commit on Hrazdan TPP Unit 5',
    plantOrSubstation: 'Hrazdan Thermal Power Plant Unit 5',
    adjustmentMW: 110,
    actionType: 'ramp_up',
    timeframe: '13:00 – 19:00',
    rationale: 'Provide sustained medium-duration thermal generation baseline to bridge the gap into evening peak demand without depleting Sevan water quotas.',
    status: 'pending',
    estimatedCostImpactUSD: 6800,
    reliabilityDeltaPct: 98.9,
  },
  {
    id: 'DISP-403',
    title: 'Automated OLTC Step Compensation (+2 Steps)',
    plantOrSubstation: 'Gyumri-2 & Vanadzor 110 kV Busbars',
    adjustmentMW: 0,
    actionType: 'oltc_adjust',
    timeframe: 'Immediate (12:30)',
    rationale: 'Correct bus voltage sags (currently 104.2 kV) prior to solar generation drop, stabilizing industrial feeder profiles.',
    status: 'approved',
    estimatedCostImpactUSD: 0,
    reliabilityDeltaPct: 99.8,
  },
  {
    id: 'DISP-404',
    title: 'Voluntary Industrial Demand-Response Signal',
    plantOrSubstation: 'Ararat Cement & Kotayk Steel Furnaces',
    adjustmentMW: -35,
    actionType: 'demand_response',
    timeframe: '14:00 – 16:30',
    rationale: 'Shed non-critical melting arc furnace loads during steep solar delta window in exchange for off-peak tariff credit.',
    status: 'pending',
    estimatedCostImpactUSD: 1200,
    reliabilityDeltaPct: 99.1,
  },
];

export const ENA_LOSS_FEEDERS: LossAnomalyFeeder[] = [
  {
    transformerId: 'TR-Shirak-048',
    location: 'Gyumri North Commercial Quarter',
    region: 'Shirak',
    customerSmartMeters: 214,
    scadaFeederReadingKWh: 84200,
    smartMetersSumKWh: 61800,
    unaccountedLossPct: 26.6,
    estimatedAnnualLossUSD: 54200,
    status: 'suspected_theft',
    investigationPriority: 'urgent',
  },
  {
    transformerId: 'TR-Yerevan-782',
    location: 'Shengavit Industrial Feeder 3B',
    region: 'Yerevan',
    customerSmartMeters: 92,
    scadaFeederReadingKWh: 145000,
    smartMetersSumKWh: 118400,
    unaccountedLossPct: 18.3,
    estimatedAnnualLossUSD: 64800,
    status: 'suspected_theft',
    investigationPriority: 'urgent',
  },
  {
    transformerId: 'TR-Ararat-115',
    location: 'Masis Agricultural Pumping Zone',
    region: 'Ararat',
    customerSmartMeters: 146,
    scadaFeederReadingKWh: 62400,
    smartMetersSumKWh: 51200,
    unaccountedLossPct: 17.9,
    estimatedAnnualLossUSD: 27300,
    status: 'unmetered_tap',
    investigationPriority: 'urgent',
  },
  {
    transformerId: 'TR-Lori-302',
    location: 'Vanadzor Hillside Residential Feeder',
    region: 'Lori',
    customerSmartMeters: 310,
    scadaFeederReadingKWh: 98100,
    smartMetersSumKWh: 83900,
    unaccountedLossPct: 14.5,
    estimatedAnnualLossUSD: 34600,
    status: 'technical_overload',
    investigationPriority: 'medium',
  },
  {
    transformerId: 'TR-Kotayk-094',
    location: 'Abovyan Suburb Line 2',
    region: 'Kotayk',
    customerSmartMeters: 175,
    scadaFeederReadingKWh: 54000,
    smartMetersSumKWh: 48900,
    unaccountedLossPct: 9.4,
    estimatedAnnualLossUSD: 12400,
    status: 'nominal',
    investigationPriority: 'low',
  },
  {
    transformerId: 'TR-Armavir-221',
    location: 'Echmiadzin Suburban Feeder',
    region: 'Armavir',
    customerSmartMeters: 280,
    scadaFeederReadingKWh: 112000,
    smartMetersSumKWh: 94100,
    unaccountedLossPct: 16.0,
    estimatedAnnualLossUSD: 43700,
    status: 'suspected_theft',
    investigationPriority: 'urgent',
  },
];

export const PILOT_METRICS = {
  manualAdjustmentsBefore: 28,
  manualAdjustmentsAfter: 6,
  acceptanceRatePct: 89.2,
  decisionLeadTimeMin: 2.1,
  baselineLeadTimeMin: 18.5,
  outagesAvertedQuarter: 14,
  estimatedAvoidedCurtailmentMWh: 1420,
  lossesDetectedUSD: 237000,
};

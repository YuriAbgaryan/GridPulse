import React, { useState } from 'react';
import { Substation, GridAlert } from '../types/grid';
import { ARMENIA_MAP_VECTOR } from '../data/armeniaMapVector';
import {
  MapPin,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Wrench,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Info,
  Navigation,
  Building,
  Home,
  Radio,
  Truck,
  RotateCcw,
  Check
} from 'lucide-react';

interface ResidentialTransformerPlant {
  id: string;
  name: string;
  regionKey: string;
  feederLine: string;
  ratingKVA: number;
  currentLoadPct: number;
  connectedConsumers: number;
  voltageV: number;
  status: 'critical' | 'warning' | 'nominal';
  anomalyType?: 'theft_bypass' | 'thermal_overload' | 'voltage_sag' | 'phase_imbalance' | 'nominal';
  anomalyDetails?: string;
  pinpointLocation: string;
  coords: { x: number; y: number };
}

const RESIDENTIAL_TRANSFORMERS: ResidentialTransformerPlant[] = [
  // Shirak / Gyumri District
  {
    id: 'TR-SHI-048',
    name: 'TR-048 Shirakatsi Commercial Plant',
    regionKey: 'shirak',
    feederLine: 'Feeder-04 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 84,
    connectedConsumers: 214,
    voltageV: 378,
    status: 'critical',
    anomalyType: 'theft_bypass',
    anomalyDetails: '26.6% unaccounted energy drop (-22,400 kWh/mo) detected via smart meter delta. Underground bypass cable located ahead of meter cabinet #4.',
    pinpointLocation: 'Feeder Pole #14-19, Shirakatsi Str. Commercial Junction, Gyumri',
    coords: { x: 380, y: 220 },
  },
  {
    id: 'TR-SHI-102',
    name: 'TR-102 Ani District Multi-Apartment Plant',
    regionKey: 'shirak',
    feederLine: 'Feeder-02 (10 kV)',
    ratingKVA: 630,
    currentLoadPct: 62,
    connectedConsumers: 340,
    voltageV: 396,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Nominal distribution state. Secondary smart meters balance with 3.2% natural technical loss.',
    pinpointLocation: 'Ani District Block 5, Gyumri',
    coords: { x: 260, y: 160 },
  },
  {
    id: 'TR-SHI-118',
    name: 'TR-118 Sayat-Nova Ave Commercial Feeder',
    regionKey: 'shirak',
    feederLine: 'Feeder-07 (10 kV)',
    ratingKVA: 250,
    currentLoadPct: 91,
    connectedConsumers: 118,
    voltageV: 368,
    status: 'warning',
    anomalyType: 'voltage_sag',
    anomalyDetails: 'Low secondary voltage (368 V vs 400 V nominal) under heavy evening commercial lighting draw.',
    pinpointLocation: 'Sayat-Nova Blvd / Gorki Str. Corner, Gyumri',
    coords: { x: 520, y: 310 },
  },
  {
    id: 'TR-SHI-204',
    name: 'TR-204 Mush-2 Residential Substation',
    regionKey: 'shirak',
    feederLine: 'Feeder-03 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 54,
    connectedConsumers: 280,
    voltageV: 398,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Normal loading profile with balanced phases across residential blocks.',
    pinpointLocation: 'Mush-2 Microdistrict, Gyumri',
    coords: { x: 230, y: 380 },
  },
  {
    id: 'TR-SHI-312',
    name: 'TR-312 Marmashen Road Industrial Pump Post',
    regionKey: 'shirak',
    feederLine: 'Feeder-09 (10 kV)',
    ratingKVA: 250,
    currentLoadPct: 48,
    connectedConsumers: 42,
    voltageV: 402,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Seasonal agricultural pumping station in normal standby cycle.',
    pinpointLocation: 'Marmashen Highway Km 3, Shirak',
    coords: { x: 620, y: 180 },
  },

  // Yerevan Capital Ring
  {
    id: 'TR-YEV-782',
    name: 'TR-782 Shengavit Industrial Distribution Post',
    regionKey: 'yerevan',
    feederLine: 'Feeder-11B (10 kV)',
    ratingKVA: 1000,
    currentLoadPct: 93,
    connectedConsumers: 92,
    voltageV: 382,
    status: 'critical',
    anomalyType: 'theft_bypass',
    anomalyDetails: '18.3% discrepancy (-26,600 kWh). Secondary CT ratio tampering identified across industrial welding workshop line.',
    pinpointLocation: 'Bagratunyats Ave Industrial Zone, Shengavit, Yerevan',
    coords: { x: 340, y: 380 },
  },
  {
    id: 'TR-YEV-101',
    name: 'TR-101 Kentron Abovyan Str Residential Post',
    regionKey: 'yerevan',
    feederLine: 'Feeder-01 (10 kV)',
    ratingKVA: 630,
    currentLoadPct: 88,
    connectedConsumers: 410,
    voltageV: 386,
    status: 'warning',
    anomalyType: 'thermal_overload',
    anomalyDetails: 'Elevated oil temperature (79°C) due to concentrated high-rise AC & heat pump loads.',
    pinpointLocation: 'Abovyan / Tumanyan Str Intersection, Kentron, Yerevan',
    coords: { x: 480, y: 220 },
  },
  {
    id: 'TR-YEV-204',
    name: 'TR-204 Arabkir Komitas Ave Substation',
    regionKey: 'yerevan',
    feederLine: 'Feeder-05 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 65,
    connectedConsumers: 290,
    voltageV: 398,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Standard residential consumption; smart meter automated billing nominal.',
    pinpointLocation: 'Komitas Ave / Vagarshyan Str, Arabkir, Yerevan',
    coords: { x: 450, y: 140 },
  },
  {
    id: 'TR-YEV-308',
    name: 'TR-308 Malatia-Sebastia Block 4 Substation',
    regionKey: 'yerevan',
    feederLine: 'Feeder-08 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 58,
    connectedConsumers: 320,
    voltageV: 400,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Residential feeder operating within optimal impedance tolerances.',
    pinpointLocation: 'Raffi Str Block 4, Malatia-Sebastia, Yerevan',
    coords: { x: 220, y: 310 },
  },
  {
    id: 'TR-YEV-412',
    name: 'TR-412 Nor Nork 3rd Microdistrict Plant',
    regionKey: 'yerevan',
    feederLine: 'Feeder-14 (10 kV)',
    ratingKVA: 630,
    currentLoadPct: 71,
    connectedConsumers: 360,
    voltageV: 394,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Residential load curve tracking day-ahead forecast with 98% accuracy.',
    pinpointLocation: 'Gaye Ave 3rd Block, Nor Nork, Yerevan',
    coords: { x: 670, y: 200 },
  },

  // Lori / Vanadzor District
  {
    id: 'TR-LOR-142',
    name: 'TR-142 Vanadzor Industrial Heavy Plant',
    regionKey: 'lori',
    feederLine: 'Feeder-12 (10 kV)',
    ratingKVA: 1000,
    currentLoadPct: 94,
    connectedConsumers: 68,
    voltageV: 374,
    status: 'critical',
    anomalyType: 'thermal_overload',
    anomalyDetails: 'Critical top-oil temperature at 88.5°C (>85°C trip threshold). Fan bank vibration fault recorded.',
    pinpointLocation: 'Vanadzor Industrial Park Terminal 4, Lori',
    coords: { x: 420, y: 240 },
  },
  {
    id: 'TR-LOR-302',
    name: 'TR-302 Taron-4 District Residential Post',
    regionKey: 'lori',
    feederLine: 'Feeder-06 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 79,
    connectedConsumers: 310,
    voltageV: 382,
    status: 'warning',
    anomalyType: 'phase_imbalance',
    anomalyDetails: 'Phase A current 140A vs Phase C 42A. Severe neutral conductor heating and 14.5% line loss.',
    pinpointLocation: 'Taron-4 Microdistrict Block 12, Vanadzor',
    coords: { x: 270, y: 330 },
  },
  {
    id: 'TR-LOR-201',
    name: 'TR-201 Dimats Residential Substation',
    regionKey: 'lori',
    feederLine: 'Feeder-03 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 56,
    connectedConsumers: 240,
    voltageV: 398,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Nominal operation on 10 kV primary feeder.',
    pinpointLocation: 'Dimats District Main Ring, Vanadzor',
    coords: { x: 550, y: 180 },
  },

  // Ararat & Armavir District
  {
    id: 'TR-ARM-221',
    name: 'TR-221 Echmiadzin East Feeder Terminal #11',
    regionKey: 'ararat_armavir',
    feederLine: 'Feeder-11 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 82,
    connectedConsumers: 280,
    voltageV: 380,
    status: 'critical',
    anomalyType: 'theft_bypass',
    anomalyDetails: '16.0% commercial theft gap (-17,900 kWh). Unregistered commercial tap splice detected into 0.4 kV bundle.',
    pinpointLocation: 'Araratian Highway Terminal #11, Echmiadzin',
    coords: { x: 280, y: 260 },
  },
  {
    id: 'TR-ARA-115',
    name: 'TR-115 Masis Agricultural Pumping Post',
    regionKey: 'ararat_armavir',
    feederLine: 'Feeder-04 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 76,
    connectedConsumers: 146,
    voltageV: 382,
    status: 'critical',
    anomalyType: 'theft_bypass',
    anomalyDetails: '17.9% loss gap. Unauthorized direct overhead hook tap powering high-current 45 kW pump.',
    pinpointLocation: 'Canal Pump Terminal 02, Masis Rural Sector',
    coords: { x: 520, y: 340 },
  },
  {
    id: 'TR-ARM-105',
    name: 'TR-105 Metsamor Residential Settlement',
    regionKey: 'ararat_armavir',
    feederLine: 'Feeder-01 (10 kV)',
    ratingKVA: 630,
    currentLoadPct: 52,
    connectedConsumers: 380,
    voltageV: 401,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Stable supply fed from ANPP auxiliary distribution grid.',
    pinpointLocation: 'Metsamor Town 2nd Quarter, Armavir',
    coords: { x: 190, y: 360 },
  },

  // Gegharkunik & Sevan District
  {
    id: 'TR-GEG-110',
    name: 'TR-110 Masik Solar Feeder Grid Post',
    regionKey: 'gegharkunik',
    feederLine: 'PV Intertie Line (10 kV)',
    ratingKVA: 1600,
    currentLoadPct: 87,
    connectedConsumers: 45,
    voltageV: 418,
    status: 'warning',
    anomalyType: 'voltage_sag',
    anomalyDetails: 'Midday solar generation surplus driving secondary voltage up to 418 V (+4.5% above nominal). Reverse power flow active.',
    pinpointLocation: 'Masrik-1 Solar Array Substation Junction, Gegharkunik',
    coords: { x: 620, y: 320 },
  },
  {
    id: 'TR-GEG-205',
    name: 'TR-205 Sevan City Center Residential Plant',
    regionKey: 'gegharkunik',
    feederLine: 'Feeder-02 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 61,
    connectedConsumers: 290,
    voltageV: 396,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Normal domestic consumption curve.',
    pinpointLocation: 'Nairi Str Central Block, Sevan',
    coords: { x: 310, y: 190 },
  },

  // Syunik District
  {
    id: 'TR-SYU-315',
    name: 'TR-315 Kapan Mining Area Substation',
    regionKey: 'syunik',
    feederLine: 'Feeder-08 (10 kV)',
    ratingKVA: 1000,
    currentLoadPct: 89,
    connectedConsumers: 110,
    voltageV: 384,
    status: 'warning',
    anomalyType: 'thermal_overload',
    anomalyDetails: 'Heavy conveyor motor inductive draw causing reactive power surge and high transformer thermal index.',
    pinpointLocation: 'Shahumyan Industrial Ore Terminal, Kapan',
    coords: { x: 520, y: 390 },
  },
  {
    id: 'TR-SYU-104',
    name: 'TR-104 Shinuhayr Village Substation',
    regionKey: 'syunik',
    feederLine: 'Feeder-01 (10 kV)',
    ratingKVA: 400,
    currentLoadPct: 49,
    connectedConsumers: 210,
    voltageV: 402,
    status: 'nominal',
    anomalyType: 'nominal',
    anomalyDetails: 'Vorotan cascade local service feed operating at optimal efficiency.',
    pinpointLocation: 'Shinuhayr Main Square, Syunik',
    coords: { x: 360, y: 220 },
  },
];

interface LiveGridMapPageProps {
  substations: Substation[];
  alerts: GridAlert[];
  onOpenWorkOrderModal: (alert: GridAlert) => void;
  onNavigateToForecast: () => void;
}

export const LiveGridMapPage: React.FC<LiveGridMapPageProps> = ({
  substations,
  alerts,
  onOpenWorkOrderModal,
  onNavigateToForecast,
}) => {
  const [mapScope, setMapScope] = useState<'national' | 'regional_transformers'>('national');
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('shirak');
  const [selectedSubstationId, setSelectedSubstationId] = useState<string>('sub-vanadzor');
  const [selectedTransformerId, setSelectedTransformerId] = useState<string>('TR-SHI-048');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'nominal'>('all');
  const [showBlobs, setShowBlobs] = useState<boolean>(true);
  const [showPowerLines, setShowPowerLines] = useState<boolean>(true);
  const [dispatchedCrews, setDispatchedCrews] = useState<Record<string, boolean>>({});

  // National Transmission Lines (220 kV & 110 kV)
  const lines220kV = [
    { from: 'sub-metsamor-bus', to: 'sub-yerevan-cen' },
    { from: 'sub-yerevan-cen', to: 'sub-hrazdan-node' },
    { from: 'sub-hrazdan-node', to: 'sub-masrik' },
    { from: 'sub-yerevan-cen', to: 'sub-ararat' },
    { from: 'sub-ararat', to: 'sub-shinuhayr' },
  ];

  const lines110kV = [
    { from: 'sub-gyumri', to: 'sub-vanadzor' },
    { from: 'sub-vanadzor', to: 'sub-hrazdan-node' },
    { from: 'sub-gyumri', to: 'sub-aragats-pv' },
    { from: 'sub-aragats-pv', to: 'sub-yerevan-cen' },
    { from: 'sub-yerevan-cen', to: 'sub-marash' },
  ];

  const getSubCoords = (id: string) => {
    const s = substations.find(sub => sub.id === id);
    if (s?.mapCoords) return s.mapCoords;
    const fallback = ARMENIA_MAP_VECTOR.substationCoords[id as keyof typeof ARMENIA_MAP_VECTOR.substationCoords];
    return fallback || { x: 400, y: 350 };
  };

  const selectedSub = substations.find(s => s.id === selectedSubstationId) || substations[0];
  const relatedAlert = alerts.find(a =>
    a.substation.toLowerCase().includes(selectedSub.name.split(' ')[0].toLowerCase()) ||
    a.region.toLowerCase().includes(selectedSub.region.split(' ')[0].toLowerCase())
  );

  // Regional Transformers list for the selected region
  const regionalTransformers = RESIDENTIAL_TRANSFORMERS.filter(
    t => t.regionKey === selectedRegionKey
  );

  const selectedTrafo = RESIDENTIAL_TRANSFORMERS.find(t => t.id === selectedTransformerId) || regionalTransformers[0] || RESIDENTIAL_TRANSFORMERS[0];

  const handleDispatchCrew = (id: string) => {
    setDispatchedCrews(prev => ({ ...prev, [id]: true }));
  };

  const regionalOptions = [
    { key: 'shirak', label: 'Shirak / Gyumri District' },
    { key: 'yerevan', label: 'Yerevan Capital Ring' },
    { key: 'lori', label: 'Lori / Vanadzor District' },
    { key: 'ararat_armavir', label: 'Ararat & Armavir Plains' },
    { key: 'gegharkunik', label: 'Gegharkunik / Lake Sevan' },
    { key: 'syunik', label: 'Syunik Mountain District' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header & Map Scope Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
                Geospatial SCADA & Anomaly Radar
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Republic of Armenia Grid Infrastructure</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {mapScope === 'national'
                ? 'Armenia National Grid Map & Incident Heat Blobs'
                : `Residential Transformer Plants (10 kV / 0.4 kV) — ${regionalOptions.find(r => r.key === selectedRegionKey)?.label}`}
            </h1>
          </div>

          {/* Scope Switcher: National Grid vs Residential Transformers */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setMapScope('national')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapScope === 'national'
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>National Grid (220/110 kV)</span>
            </button>
            <button
              onClick={() => setMapScope('regional_transformers')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mapScope === 'regional_transformers'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Residential Transformers (10/0.4 kV)</span>
            </button>
          </div>
        </div>

        {/* REGIONAL CONTROLS IF IN RESIDENTIAL SCOPE */}
        {mapScope === 'regional_transformers' && (
          <div className="mt-4 p-3 bg-[#131b29] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium mr-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select Target Region:</span>
              </span>
              {regionalOptions.map(r => (
                <button
                  key={r.key}
                  onClick={() => {
                    setSelectedRegionKey(r.key);
                    const firstInRegion = RESIDENTIAL_TRANSFORMERS.find(t => t.regionKey === r.key);
                    if (firstInRegion) setSelectedTransformerId(firstInRegion.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedRegionKey === r.key
                      ? 'bg-emerald-500 text-white font-bold shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Monitored: <strong className="text-emerald-400 font-bold">{regionalTransformers.length} Transformer Posts</strong>
            </div>
          </div>
        )}

        {/* MAP DISPLAY CONTROLS & LEGEND */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showBlobs}
                onChange={e => setShowBlobs(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0 cursor-pointer"
              />
              <span className="font-medium">Show Alert Heat Blobs (Red & Yellow)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={showPowerLines}
                onChange={e => setShowPowerLines(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
              />
              <span className="font-medium">
                {mapScope === 'national' ? 'Transmission Lines (220/110 kV)' : '10 kV Distribution Feeders'}
              </span>
            </label>
          </div>

          {/* Map Legend */}
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
              <span className="text-slate-300">Critical Incident Pin</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              <span className="text-slate-300">Warning Pin</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              <span className="text-slate-300">Nominal Pin</span>
            </span>
          </div>
        </div>

        {/* MAP & INSPECTOR GRID */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MAP CANVAS (8 COLS) */}
          <div className="lg:col-span-8 bg-[#101623] border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-2xl">
            {mapScope === 'national' ? (
              /* REALISTIC HIGH-PRECISION ARMENIA VECTOR SVG MAP */
              <div className="relative w-full aspect-[4/3] max-h-[640px]">
                <svg
                  viewBox={ARMENIA_MAP_VECTOR.viewBox}
                  className="w-full h-full select-none"
                >
                  <defs>
                    {/* Red Pulsing Alert Heat Blob Gradient */}
                    <radialGradient id="redAlertBlob" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                      <stop offset="45%" stopColor="#ef4444" stopOpacity="0.40" />
                      <stop offset="85%" stopColor="#ef4444" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>

                    {/* Yellow/Amber Pulsing Alert Heat Blob Gradient */}
                    <radialGradient id="yellowAlertBlob" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.80" />
                      <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.35" />
                      <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>

                    {/* Authentic Armenia Land Gradient */}
                    <linearGradient id="armeniaLandRealistic" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#182232" />
                      <stop offset="60%" stopColor="#121a27" />
                      <stop offset="100%" stopColor="#0b1019" />
                    </linearGradient>

                    {/* Lake Sevan Water Body Gradient */}
                    <linearGradient id="lakeSevanWater" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.70" />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity="0.40" />
                    </linearGradient>
                  </defs>

                  {/* OFFICIAL ARMENIA MAINLAND VECTOR PATH */}
                  <path
                    d={ARMENIA_MAP_VECTOR.mainlandPath}
                    fill="url(#armeniaLandRealistic)"
                    stroke="#94a3b8"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                    className="drop-shadow-2xl"
                  />

                  {/* ARMENIA ENCLAVE / EXCLAVE PATHS */}
                  {ARMENIA_MAP_VECTOR.enclavePath && (
                    <path
                      d={ARMENIA_MAP_VECTOR.enclavePath}
                      fill="url(#armeniaLandRealistic)"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* LAKE SEVAN WATER BODY */}
                  <path
                    d={ARMENIA_MAP_VECTOR.lakeSevanPath}
                    fill="url(#lakeSevanWater)"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                  <text
                    x="455"
                    y="295"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="700"
                    opacity="0.9"
                    textAnchor="middle"
                  >
                    Lake Sevan
                  </text>

                  {/* REGION GEOGRAPHIC LABELS */}
                  {ARMENIA_MAP_VECTOR.regionLabels.map(region => (
                    <text
                      key={region.name}
                      x={region.x}
                      y={region.y}
                      fill={region.isCapital ? '#cbd5e1' : '#64748b'}
                      fontSize={region.isCapital ? '12' : '10'}
                      fontFamily="sans-serif"
                      fontWeight={region.isCapital ? '800' : '700'}
                      textAnchor="middle"
                    >
                      {region.name}
                    </text>
                  ))}

                  {/* TRANSMISSION LINES */}
                  {showPowerLines && (
                    <g className="transition-opacity duration-300">
                      {/* 220 kV Lines (Cyan, Solid Glow) */}
                      {lines220kV.map((line, idx) => {
                        const c1 = getSubCoords(line.from);
                        const c2 = getSubCoords(line.to);
                        return (
                          <g key={`220-${idx}`}>
                            <line
                              x1={c1.x}
                              y1={c1.y}
                              x2={c2.x}
                              y2={c2.y}
                              stroke="#0284c7"
                              strokeWidth="4"
                              strokeOpacity="0.3"
                            />
                            <line
                              x1={c1.x}
                              y1={c1.y}
                              x2={c2.x}
                              y2={c2.y}
                              stroke="#38bdf8"
                              strokeWidth="2.2"
                              strokeDasharray="8 4"
                            />
                          </g>
                        );
                      })}

                      {/* 110 kV Lines (Purple, Thinner) */}
                      {lines110kV.map((line, idx) => {
                        const c1 = getSubCoords(line.from);
                        const c2 = getSubCoords(line.to);
                        return (
                          <line
                            key={`110-${idx}`}
                            x1={c1.x}
                            y1={c1.y}
                            x2={c2.x}
                            y2={c2.y}
                            stroke="#c084fc"
                            strokeWidth="1.6"
                            strokeOpacity="0.8"
                            strokeDasharray="4 3"
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* ALERT HEAT BLOBS ON NATIONAL MAP */}
                  {showBlobs && (
                    <g>
                      {/* Red Blob: Vanadzor T-142 Overheating */}
                      <circle cx={283} cy={171} r="54" fill="url(#redAlertBlob)" className="animate-pulse" />

                      {/* Red Blob: Gyumri Feeder Theft & Loss */}
                      <circle cx={139} cy={176} r="50" fill="url(#redAlertBlob)" className="animate-pulse" />

                      {/* Yellow Blob: Aragatsotn PV Rapid Drop */}
                      <circle cx={219} cy={277} r="46" fill="url(#yellowAlertBlob)" />

                      {/* Yellow Blob: Masrik-1 Solar Overvoltage */}
                      <circle cx={562} cy={331} r="46" fill="url(#yellowAlertBlob)" />

                      {/* Yellow Blob: Shahumyan Yerevan Ring Peak */}
                      <circle cx={287} cy={342} r="44" fill="url(#yellowAlertBlob)" />

                      {/* Cyan Glow Blob: Shinuhayr Hydro Fast Ramp */}
                      <circle cx={688} cy={546} r="42" fill="#0284c7" fillOpacity="0.18" />
                    </g>
                  )}

                  {/* BULK SUBSTATION PINS */}
                  {substations.map(sub => {
                    const coords = sub.mapCoords || { x: 450, y: 300 };
                    const isSelected = selectedSubstationId === sub.id;
                    const isCritical = sub.status === 'critical';
                    const isWarning = sub.status === 'warning';

                    const pinColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

                    return (
                      <g
                        key={sub.id}
                        className="cursor-pointer transition-transform duration-150"
                        onClick={() => setSelectedSubstationId(sub.id)}
                      >
                        {isCritical && (
                          <circle cx={coords.x} cy={coords.y} r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
                        )}

                        {isSelected && (
                          <circle cx={coords.x} cy={coords.y} r="16" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />
                        )}

                        <circle cx={coords.x} cy={coords.y} r={isSelected ? 10 : 8} fill={pinColor} stroke="#0f172a" strokeWidth="2.5" />
                        <circle cx={coords.x} cy={coords.y} r="3" fill="#ffffff" />

                        <text x={coords.x} y={coords.y + 19} fill={isSelected ? '#ffffff' : '#cbd5e1'} fontSize="10" fontFamily="monospace" fontWeight={isSelected ? '700' : '500'} textAnchor="middle">
                          {sub.name.split(' ')[0]}
                        </text>
                        <text x={coords.x} y={coords.y + 30} fill={pinColor} fontSize="9" fontFamily="monospace" fontWeight="600" textAnchor="middle">
                          {sub.currentVoltageKV.toFixed(1)}kV
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              /* REGIONAL RESIDENTIAL TRANSFORMER PLANTS MAP (10 kV / 0.4 kV SCALE) */
              <div className="relative w-full aspect-[4/3] max-h-[640px]">
                <svg
                  viewBox="0 0 860 560"
                  className="w-full h-full select-none"
                >
                  <defs>
                    <radialGradient id="regionalRedBlob" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#ef4444" stopOpacity="0.40" />
                      <stop offset="85%" stopColor="#ef4444" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="regionalYellowBlob" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Regional City / District Grid Background */}
                  <rect x="20" y="20" width="820" height="520" rx="16" fill="#111726" stroke="#1e293b" />

                  {/* Stylized Street & Distribution Grid Lines */}
                  <path d="M 80 180 L 780 180 M 80 340 L 780 340 M 300 60 L 300 500 M 560 60 L 560 500" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Primary 110/10 kV Substation at Center-Top */}
                  <g transform="translate(430, 75)">
                    <rect x="-60" y="-22" width="120" height="44" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="0" y="-4" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="700" textAnchor="middle">
                      PRIMARY 110/10kV
                    </text>
                    <text x="0" y="12" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      DISTRIBUTION HUB
                    </text>
                  </g>

                  {/* 10 kV Feeders connecting to Residential Transformer Posts */}
                  {regionalTransformers.map((trafo, idx) => {
                    return (
                      <g key={`feeder-${trafo.id}`}>
                        <line
                          x1={430}
                          y1={97}
                          x2={trafo.coords.x}
                          y2={trafo.coords.y}
                          stroke={trafo.status === 'critical' ? '#f43f5e' : '#38bdf8'}
                          strokeWidth="2"
                          strokeDasharray={trafo.status === 'critical' ? '4 3' : 'none'}
                          strokeOpacity="0.8"
                        />
                      </g>
                    );
                  })}

                  {/* ALERT HEAT BLOBS AT RESIDENTIAL TRANSFORMER SCALE */}
                  {showBlobs && regionalTransformers.map(trafo => {
                    if (trafo.status === 'critical') {
                      return (
                        <circle
                          key={`trafo-blob-${trafo.id}`}
                          cx={trafo.coords.x}
                          cy={trafo.coords.y}
                          r="60"
                          fill="url(#regionalRedBlob)"
                          className="animate-pulse"
                        />
                      );
                    }
                    if (trafo.status === 'warning') {
                      return (
                        <circle
                          key={`trafo-blob-${trafo.id}`}
                          cx={trafo.coords.x}
                          cy={trafo.coords.y}
                          r="50"
                          fill="url(#regionalYellowBlob)"
                        />
                      );
                    }
                    return null;
                  })}

                  {/* RESIDENTIAL TRANSFORMER POST PINS */}
                  {regionalTransformers.map(trafo => {
                    const isSelected = selectedTransformerId === trafo.id;
                    const isCritical = trafo.status === 'critical';
                    const isWarning = trafo.status === 'warning';
                    const pinColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

                    return (
                      <g
                        key={`trafo-pin-${trafo.id}`}
                        className="cursor-pointer transition-transform duration-150"
                        onClick={() => setSelectedTransformerId(trafo.id)}
                      >
                        {isCritical && (
                          <circle cx={trafo.coords.x} cy={trafo.coords.y} r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
                        )}

                        {isSelected && (
                          <circle cx={trafo.coords.x} cy={trafo.coords.y} r="17" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />
                        )}

                        {/* Plant Box Icon Container */}
                        <rect
                          x={trafo.coords.x - 12}
                          y={trafo.coords.y - 12}
                          width="24"
                          height="24"
                          rx="6"
                          fill={pinColor}
                          stroke="#0f172a"
                          strokeWidth="2.5"
                        />
                        <circle cx={trafo.coords.x} cy={trafo.coords.y} r="4" fill="#ffffff" />

                        {/* Label */}
                        <text
                          x={trafo.coords.x}
                          y={trafo.coords.y + 24}
                          fill={isSelected ? '#ffffff' : '#cbd5e1'}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight={isSelected ? '700' : '600'}
                          textAnchor="middle"
                        >
                          {trafo.id}
                        </text>

                        <text
                          x={trafo.coords.x}
                          y={trafo.coords.y + 36}
                          fill={pinColor}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {trafo.ratingKVA} kVA · {trafo.currentLoadPct}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Bottom Map Note */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  {mapScope === 'national'
                    ? 'Armenia Bulk Transmission SCADA · 220/110 kV Busbars'
                    : `ENA Residential Distribution Topology · 10/0.4 kV Transformers (${regionalTransformers.length} Units)`}
                </span>
              </div>
              <button
                onClick={() => setMapScope(mapScope === 'national' ? 'regional_transformers' : 'national')}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Switch to {mapScope === 'national' ? 'Residential Plant Scale →' : 'National Grid Scale →'}
              </button>
            </div>
          </div>

          {/* TELEMETRY & INCIDENT INSPECTOR DRAWER (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            {mapScope === 'national' ? (
              /* NATIONAL SUBSTATION INSPECTOR */
              <div className="bg-[#141b27] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      selectedSub.status === 'critical'
                        ? 'bg-rose-500 animate-pulse'
                        : selectedSub.status === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-mono font-bold uppercase text-slate-300">
                      National Substation Inspector
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedSub.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : selectedSub.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {selectedSub.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{selectedSub.voltageClass}</span>
                    <span>·</span>
                    <span>{selectedSub.region}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedSub.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedSub.details}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Bus Voltage</div>
                    <div className={`text-base font-bold mt-0.5 ${
                      selectedSub.status === 'critical' ? 'text-rose-400' : 'text-slate-200'
                    }`}>
                      {selectedSub.currentVoltageKV.toFixed(1)} kV
                    </div>
                    <div className="text-[10px] text-slate-500">Nominal: {selectedSub.nominalVoltageKV} kV</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Active Load (P)</div>
                    <div className="text-base font-bold text-sky-400 mt-0.5">
                      {selectedSub.activePowerMW} MW
                    </div>
                    <div className="text-[10px] text-slate-500">Q: {selectedSub.reactivePowerMVAR} MVAR</div>
                  </div>

                  <div className="col-span-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Transformer Loading</span>
                      <span className={`font-bold ${
                        selectedSub.transformerLoadPct > 90 ? 'text-rose-400' : 'text-slate-200'
                      }`}>
                        {selectedSub.transformerLoadPct}% rated
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedSub.transformerLoadPct > 90
                            ? 'bg-rose-500'
                            : selectedSub.transformerLoadPct > 75
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${selectedSub.transformerLoadPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {relatedAlert && (
                  <div className="mt-4 p-3 bg-black/40 border border-amber-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        INCIDENT: {relatedAlert.id}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{relatedAlert.timestamp}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{relatedAlert.title}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{relatedAlert.recommendedAction}</p>
                  </div>
                )}

                <div className="mt-5 space-y-2 pt-2 border-t border-slate-800">
                  {relatedAlert && (
                    <button
                      onClick={() => onOpenWorkOrderModal(relatedAlert)}
                      className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Dispatch Maintenance Work Order</span>
                    </button>
                  )}
                  <button
                    onClick={onNavigateToForecast}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Open Forecast Simulator</span>
                  </button>
                </div>
              </div>
            ) : (
              /* RESIDENTIAL TRANSFORMER PLANT INSPECTOR */
              <div className="bg-[#141b27] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      selectedTrafo.status === 'critical'
                        ? 'bg-rose-500 animate-pulse'
                        : selectedTrafo.status === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-mono font-bold uppercase text-slate-300">
                      Residential Plant Diagnostic
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedTrafo.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : selectedTrafo.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {selectedTrafo.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-semibold">
                    <span>{selectedTrafo.id}</span>
                    <span>·</span>
                    <span>{selectedTrafo.feederLine}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedTrafo.name}
                  </h3>
                  <div className="mt-2 text-xs text-slate-300 font-mono flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{selectedTrafo.pinpointLocation}</span>
                  </div>
                </div>

                {/* Technical Readings */}
                <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Rated Capacity</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {selectedTrafo.ratingKVA} kVA
                    </div>
                    <div className="text-[10px] text-slate-500">10 kV to 400/230 V</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Connected Accounts</div>
                    <div className="text-base font-bold text-sky-400 mt-0.5">
                      {selectedTrafo.connectedConsumers}
                    </div>
                    <div className="text-[10px] text-slate-500">Smart Billed Meters</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Secondary Voltage</div>
                    <div className={`text-base font-bold mt-0.5 ${
                      selectedTrafo.voltageV < 380 || selectedTrafo.voltageV > 415 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedTrafo.voltageV} V
                    </div>
                    <div className="text-[10px] text-slate-500">Nominal: 400 V</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Loading Ratio</div>
                    <div className={`text-base font-bold mt-0.5 ${
                      selectedTrafo.currentLoadPct > 90 ? 'text-rose-400' : 'text-slate-200'
                    }`}>
                      {selectedTrafo.currentLoadPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">Peak draw cycle</div>
                  </div>
                </div>

                {/* Anomaly Description */}
                {selectedTrafo.anomalyDetails && (
                  <div className={`mt-4 p-3.5 rounded-xl border text-xs space-y-1 ${
                    selectedTrafo.status === 'critical'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : selectedTrafo.status === 'warning'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <div className="font-bold uppercase text-[10px] flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Diagnostic Finding: {selectedTrafo.anomalyType?.replace('_', ' ')}</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {selectedTrafo.anomalyDetails}
                    </p>
                  </div>
                )}

                {/* Field Dispatch Button */}
                <div className="mt-5 space-y-2 pt-2 border-t border-slate-800">
                  {dispatchedCrews[selectedTrafo.id] ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>ENA Field Crew En Route</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDispatchCrew(selectedTrafo.id)}
                      className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Dispatch ENA Crew to Transformer Plant</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM QUICK-SWITCH TRANSFORMER RADAR */}
        {mapScope === 'regional_transformers' && (
          <div className="mt-8 bg-[#141b27] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Regional Transformer Fleet ({regionalOptions.find(r => r.key === selectedRegionKey)?.label})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Click any unit to focus on map
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {regionalTransformers.map(trafo => (
                <div
                  key={`trafo-card-${trafo.id}`}
                  onClick={() => setSelectedTransformerId(trafo.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedTransformerId === trafo.id
                      ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{trafo.id}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      trafo.status === 'critical'
                        ? 'bg-rose-500 animate-pulse'
                        : trafo.status === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`} />
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1 truncate">
                    {trafo.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    {trafo.ratingKVA} kVA · {trafo.currentLoadPct}% load · {trafo.connectedConsumers} homes
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

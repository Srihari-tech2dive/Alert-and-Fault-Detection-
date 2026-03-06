'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Gauge,
  Thermometer,
  Fuel,
  Activity,
  CheckCircle,
  Zap,
  Settings,
  History,
  TrendingUp,
  Wrench,
  FileText,
  Download,
} from 'lucide-react';

// Types
import type { AlertPayload, HealthScore } from '@/types/alert';

// Store
import { useAppStore } from '@/store/useAppStore';

// Components
import { Navbar } from '@/components/layout/Navbar';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeuButton } from '@/components/ui/NeuButton';
import { AlertCard, CriticalAlertModal } from '@/components/features/alerts/AlertCard';
import { AlertList } from '@/components/features/alerts/AlertList';
import { DegradationChart } from '@/components/features/charts/DegradationChart';
import { DrivingScoreGauge } from '@/components/features/charts/DrivingScore';
import { SensorGrid } from '@/components/features/charts/SensorGraph';
import { TuningSlider, TuningHistory } from '@/components/features/tuning/TuningModule';

// Data
import {
  healthScoreHistory,
  batteryDegradationHistory,
  brakeWearHistory,
  drivingEventsByDay,
  sensorReadingsHistory,
} from '@/data/mockData';

// Hooks
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useHaptic } from '@/hooks/useHaptic';
import { mockAlerts } from '@/data/mockData';

export default function Home() {
  // Hooks
  useOnlineStatus();
  const { triggerAction } = useHaptic();

  // Store
  const {
    viewMode,
    sensorData,
    healthScore,
    drivingScore,
    alerts,
    setViewMode,
    addAlert,
    acknowledgeAlert,
    resolveAlert,
    criticalAlertFullscreen,
    setCriticalAlert,
    parameters,
    tuningHistory,
    updateParameter,
    addHistoryEntry,
    reverseChange,
  } = useAppStore();

  // Initialize mock data once
  const initializedRef = React.useRef(false);
  
  React.useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      mockAlerts.forEach((alert) => {
        if (!alerts.find((a) => a.id === alert.id)) {
          addAlert(alert);
        }
      });
    }
  }, [alerts.length, addAlert]);

  // Check for critical alerts
  React.useEffect(() => {
    const criticalAlert = alerts.find(
      (a) => a.priority === 'CRITICAL' && !a.acknowledged && !a.resolved
    );
    setCriticalAlert(criticalAlert || null);
  }, [alerts, setCriticalAlert]);

  // Handle parameter update
  const handleParameterUpdate = React.useCallback((id: string, value: number) => {
    const param = parameters.find((p) => p.id === id);
    if (param) {
      updateParameter(id, value);
      addHistoryEntry({
        id: `history-${Date.now()}`,
        parameterId: id,
        parameterName: param.name,
        oldValue: param.currentValue,
        newValue: value,
        timestamp: new Date().toISOString(),
        reversed: false,
      });
    }
  }, [parameters, updateParameter, addHistoryEntry]);

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      {/* Critical Alert Modal */}
      <CriticalAlertModal
        alert={criticalAlertFullscreen}
        onAcknowledge={acknowledgeAlert}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <AnimatePresence mode="wait">
          {viewMode === 'DRIVER' && (
            <DriverView
              key="driver"
              alerts={alerts}
              healthScore={healthScore}
              drivingScore={drivingScore}
              sensorData={sensorData}
              sensorHistory={sensorReadingsHistory}
              onAcknowledge={acknowledgeAlert}
            />
          )}
          {viewMode === 'MECHANIC' && (
            <MechanicView
              key="mechanic"
              alerts={alerts}
              healthScore={healthScore}
              sensorData={sensorData}
              sensorHistory={sensorReadingsHistory}
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
            />
          )}
          {viewMode === 'TUNING' && (
            <TuningView
              key="tuning"
              parameters={parameters}
              history={tuningHistory}
              onUpdateParameter={handleParameterUpdate}
              onReverseChange={reverseChange}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Driver View Component
function DriverView({
  alerts,
  healthScore,
  drivingScore,
  sensorData,
  sensorHistory,
  onAcknowledge,
}: {
  alerts: AlertPayload[];
  healthScore: HealthScore;
  drivingScore: any;
  sensorData: any;
  sensorHistory: any;
  onAcknowledge: (id: string) => void;
}) {
  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health */}
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Vehicle Health</span>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{healthScore.overall}</span>
            <span className="text-sm text-green-400">Good</span>
          </div>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore.overall}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            />
          </div>
        </GlassPanel>

        {/* Speed */}
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Speed</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{sensorData.speed}</span>
            <span className="text-sm text-white/50">MPH</span>
          </div>
        </GlassPanel>

        {/* Engine Temp */}
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Engine Temp</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{sensorData.engineTemp}</span>
            <span className="text-sm text-white/50">°F</span>
          </div>
        </GlassPanel>

        {/* Fuel */}
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Fuel Level</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{sensorData.fuelLevel}</span>
            <span className="text-sm text-white/50">%</span>
          </div>
        </GlassPanel>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Alerts
          </h2>
          {activeAlerts.length === 0 ? (
            <GlassPanel className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-white/70">All systems normal</p>
              <p className="text-sm text-white/50 mt-1">No active alerts</p>
            </GlassPanel>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={onAcknowledge}
                  compact
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Driving Score */}
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-400" />
            Driving Score
          </h2>
          <DrivingScoreGauge
            score={drivingScore.score}
            showDetails
            details={drivingScore}
            size="md"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NeuButton variant="primary" className="py-6">
          <Wrench className="w-5 h-5" />
          Schedule Service
        </NeuButton>
        <NeuButton variant="default" className="py-6">
          <FileText className="w-5 h-5" />
          View Reports
        </NeuButton>
        <NeuButton variant="default" className="py-6">
          <History className="w-5 h-5" />
          History
        </NeuButton>
        <NeuButton variant="ghost" className="py-6">
          <Settings className="w-5 h-5" />
          Settings
        </NeuButton>
      </div>
    </motion.div>
  );
}

// Mechanic View Component
function MechanicView({
  alerts,
  healthScore,
  sensorData,
  sensorHistory,
  onAcknowledge,
  onResolve,
}: {
  alerts: AlertPayload[];
  healthScore: HealthScore;
  sensorData: any;
  sensorHistory: any;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const [selectedTab, setSelectedTab] = React.useState('alerts');

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'sensors', label: 'Sensors', icon: Activity },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(healthScore).map(([key, value]) => (
          <GlassPanel key={key} variant="subtle" className="p-3 text-center">
            <p className="text-xs text-white/50 capitalize">{key}</p>
            <p
              className={`text-xl font-bold ${
                value >= 80 ? 'text-green-400' : value >= 60 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {value}
            </p>
          </GlassPanel>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {tabs.map((tab) => (
          <NeuButton
            key={tab.id}
            variant={selectedTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab(tab.id)}
            icon={<tab.icon className="w-4 h-4" />}
          >
            {tab.label}
          </NeuButton>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'alerts' && (
          <motion.div
            key="alerts-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <AlertList
              alerts={alerts}
              onAcknowledge={onAcknowledge}
              onResolve={onResolve}
              maxHeight="500px"
            />
          </motion.div>
        )}

        {selectedTab === 'sensors' && (
          <motion.div
            key="sensors-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <SensorGrid sensors={sensorData} history={sensorHistory} />
          </motion.div>
        )}

        {selectedTab === 'predictions' && (
          <motion.div
            key="predictions-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <DegradationChart
              data={batteryDegradationHistory}
              title="Battery Health"
              trend="DECLINING"
              color="#f59e0b"
              showPrediction
              predictedValue={55}
            />
            <DegradationChart
              data={brakeWearHistory}
              title="Brake Pad Life"
              trend="DECLINING"
              color="#ef4444"
              showPrediction
              predictedValue={60}
            />
            <DegradationChart
              data={healthScoreHistory}
              title="Overall Health Trend"
              trend="STABLE"
              color="#22c55e"
            />
            <DegradationChart
              data={drivingEventsByDay}
              title="Driving Events (Weekly)"
              trend="STABLE"
              color="#3b82f6"
              unit=" events"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Actions */}
      <div className="flex gap-3">
        <NeuButton variant="primary" icon={<Download className="w-4 h-4" />}>
          Export PDF Report
        </NeuButton>
        <NeuButton variant="default" icon={<FileText className="w-4 h-4" />}>
          Export CSV
        </NeuButton>
      </div>
    </motion.div>
  );
}

// Tuning View Component
function TuningView({
  parameters,
  history,
  onUpdateParameter,
  onReverseChange,
}: {
  parameters: any[];
  history: any[];
  onUpdateParameter: (id: string, value: number) => void;
  onReverseChange: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Warning Banner */}
      <GlassPanel className="p-4 bg-amber-500/10 border-amber-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <p className="font-medium text-amber-100">Advanced Tuning Mode</p>
            <p className="text-sm text-amber-200/70 mt-1">
              Modifying ECU parameters may affect vehicle warranty and emissions compliance.
              Ensure vehicle is parked and engine is off before making changes.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Parameters Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {parameters.map((param) => (
          <TuningSlider
            key={param.id}
            parameter={param}
            onValueChange={onUpdateParameter}
          />
        ))}
      </div>

      {/* History */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-white/60" />
          Change History
        </h3>
        <TuningHistory history={history} onReverse={onReverseChange} />
      </div>
    </motion.div>
  );
}
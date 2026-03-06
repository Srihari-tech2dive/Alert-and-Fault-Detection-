import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AlertPayload,
  VehicleProfile,
  SensorData,
  HealthScore,
  DrivingScore,
  ViewMode,
  TuningParameter,
} from '@/types/alert';

// Alert Slice
interface AlertSlice {
  alerts: AlertPayload[];
  addAlert: (alert: AlertPayload) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  clearAlerts: () => void;
  getAlertsByPriority: (priority: AlertPayload['priority']) => AlertPayload[];
  getUnacknowledgedCount: () => number;
}

// Vehicle Slice
interface VehicleSlice {
  currentVehicle: VehicleProfile | null;
  sensorData: SensorData;
  healthScore: HealthScore;
  drivingScore: DrivingScore;
  setVehicle: (vehicle: VehicleProfile) => void;
  updateSensorData: (data: Partial<SensorData>) => void;
  updateHealthScore: (score: Partial<HealthScore>) => void;
  updateDrivingScore: (score: Partial<DrivingScore>) => void;
}

// UI Slice
interface UISlice {
  viewMode: ViewMode;
  isOffline: boolean;
  showOfflineBanner: boolean;
  criticalAlertFullscreen: AlertPayload | null;
  setViewMode: (mode: ViewMode) => void;
  setOffline: (offline: boolean) => void;
  setCriticalAlert: (alert: AlertPayload | null) => void;
}

// Tuning Slice
interface TuningSlice {
  parameters: TuningParameter[];
  tuningHistory: Array<{
    id: string;
    parameterId: string;
    parameterName: string;
    oldValue: number;
    newValue: number;
    timestamp: string;
    reversed: boolean;
  }>;
  updateParameter: (id: string, value: number) => void;
  addHistoryEntry: (entry: TuningSlice['tuningHistory'][0]) => void;
  reverseChange: (id: string) => void;
}

// Combined Store Type
type AppStore = AlertSlice & VehicleSlice & UISlice & TuningSlice;

// Initial Sensor Data
const initialSensorData: SensorData = {
  rpm: 2500,
  speed: 65,
  engineTemp: 195,
  fuelLevel: 72,
  oilPressure: 45,
  batteryVoltage: 14.2,
  mafSensor: 28.5,
  o2Sensor1: 0.85,
  o2Sensor2: 0.82,
  throttlePosition: 22,
  intakeTemp: 95,
  coolantTemp: 192,
};

// Initial Health Score
const initialHealthScore: HealthScore = {
  overall: 87,
  engine: 92,
  transmission: 85,
  brakes: 78,
  tires: 88,
  battery: 65,
  emissions: 91,
};

// Initial Driving Score
const initialDrivingScore: DrivingScore = {
  score: 82,
  hardBrakeCount: 3,
  rapidAccelCount: 5,
  corneringEvents: 2,
  averageSpeed: 45,
  fuelEfficiency: 28.5,
};

// Initial Tuning Parameters
const initialTuningParameters: TuningParameter[] = [
  {
    id: 'fuel-air-ratio',
    name: 'Fuel/Air Ratio',
    category: 'Engine',
    currentValue: 14.7,
    minValue: 10.0,
    maxValue: 18.0,
    unit: ':1',
    description: 'Target air-fuel ratio for optimal combustion',
    isReversible: true,
    riskLevel: 'MEDIUM',
  },
  {
    id: 'idle-rpm',
    name: 'Idle RPM',
    category: 'Engine',
    currentValue: 750,
    minValue: 600,
    maxValue: 1000,
    unit: 'RPM',
    description: 'Engine idle speed in revolutions per minute',
    isReversible: true,
    riskLevel: 'LOW',
  },
  {
    id: 'rev-limit',
    name: 'Rev Limit',
    category: 'Engine',
    currentValue: 6500,
    minValue: 5000,
    maxValue: 8000,
    unit: 'RPM',
    description: 'Maximum engine speed before fuel cutoff',
    isReversible: true,
    riskLevel: 'HIGH',
  },
  {
    id: 'throttle-response',
    name: 'Throttle Response',
    category: 'Performance',
    currentValue: 50,
    minValue: 0,
    maxValue: 100,
    unit: '%',
    description: 'Throttle pedal sensitivity mapping',
    isReversible: true,
    riskLevel: 'LOW',
  },
  {
    id: 'shift-points',
    name: 'Transmission Shift Points',
    category: 'Transmission',
    currentValue: 3500,
    minValue: 2000,
    maxValue: 6000,
    unit: 'RPM',
    description: 'Automatic transmission shift points',
    isReversible: true,
    riskLevel: 'MEDIUM',
  },
];

// Create the Store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Alert Slice
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts],
        })),
      acknowledgeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, acknowledged: true } : alert
          ),
        })),
      resolveAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, resolved: true } : alert
          ),
        })),
      clearAlerts: () => set({ alerts: [] }),
      getAlertsByPriority: (priority) =>
        get().alerts.filter((alert) => alert.priority === priority),
      getUnacknowledgedCount: () =>
        get().alerts.filter((alert) => !alert.acknowledged).length,

      // Vehicle Slice
      currentVehicle: null,
      sensorData: initialSensorData,
      healthScore: initialHealthScore,
      drivingScore: initialDrivingScore,
      setVehicle: (vehicle) => set({ currentVehicle: vehicle }),
      updateSensorData: (data) =>
        set((state) => ({
          sensorData: { ...state.sensorData, ...data },
        })),
      updateHealthScore: (score) =>
        set((state) => ({
          healthScore: { ...state.healthScore, ...score },
        })),
      updateDrivingScore: (score) =>
        set((state) => ({
          drivingScore: { ...state.drivingScore, ...score },
        })),

      // UI Slice
      viewMode: 'DRIVER',
      isOffline: false,
      showOfflineBanner: false,
      criticalAlertFullscreen: null,
      setViewMode: (mode) => set({ viewMode: mode }),
      setOffline: (offline) => set({ isOffline: offline, showOfflineBanner: offline }),
      setCriticalAlert: (alert) => set({ criticalAlertFullscreen: alert }),

      // Tuning Slice
      parameters: initialTuningParameters,
      tuningHistory: [],
      updateParameter: (id, value) =>
        set((state) => ({
          parameters: state.parameters.map((param) =>
            param.id === id ? { ...param, currentValue: value } : param
          ),
        })),
      addHistoryEntry: (entry) =>
        set((state) => ({
          tuningHistory: [entry, ...state.tuningHistory],
        })),
      reverseChange: (id) =>
        set((state) => ({
          tuningHistory: state.tuningHistory.map((entry) =>
            entry.id === id ? { ...entry, reversed: true } : entry
          ),
        })),
    }),
    {
      name: 'vehicle-alert-storage',
      partialize: (state) => ({
        alerts: state.alerts,
        currentVehicle: state.currentVehicle,
        viewMode: state.viewMode,
        tuningHistory: state.tuningHistory,
      }),
    }
  )
);

// Selectors
export const useAlerts = () => useAppStore((state) => state.alerts);
export const useSensorData = () => useAppStore((state) => state.sensorData);
export const useHealthScore = () => useAppStore((state) => state.healthScore);
export const useDrivingScore = () => useAppStore((state) => state.drivingScore);
export const useViewMode = () => useAppStore((state) => state.viewMode);
export const useIsOffline = () => useAppStore((state) => state.isOffline);
export const useTuningParameters = () => useAppStore((state) => state.parameters);
